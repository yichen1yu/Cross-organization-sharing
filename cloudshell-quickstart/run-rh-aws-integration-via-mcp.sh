#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# Red Hat + AWS Integration Orchestrator (MCP-driven)
#
# Purpose:
#   End-to-end integration run for users who already have the Red Hat
#   integration MCP installed and exposed via a CLI bridge.
#
# Flow:
#   1) preflight_check
#   2) rh_integration_init
#   3) aws_apply_integration
#   4) rh_integration_finalize
#   5) integration_validate (with polling)
#
# IMPORTANT:
#   This script assumes your MCP package provides a CLI command that supports:
#     <MCP_CMD> call --tool <tool_name> --input '<json>'
#
#   Default MCP_CMD is "rh-mcp". Override if needed:
#     MCP_CMD="your-mcp-cli" bash run-rh-aws-integration-via-mcp.sh ...
###############################################################################

MCP_CMD="${MCP_CMD:-rh-mcp}"
DRY_RUN=0
INCLUDE_RHEL_USAGE=1
TAGGING_ENABLED=1
TAG_ALL_REGIONS=0
VALIDATE_TIMEOUT_SEC=900
VALIDATE_INTERVAL_SEC=30

INTEGRATION_NAME=""
BUCKET=""
REGION=""
TAG_REGIONS=""

CUR_REPORT_NAME="koku"
CUR_PREFIX="cost"
POLICY_NAME="ELS_Metering_Access_Policy"
ROLE_NAME="RH_ELS_Metering_Role"

usage() {
  cat <<'EOF'
Usage:
  bash run-rh-aws-integration-via-mcp.sh \
    --integration-name "<NAME>" \
    --bucket "<S3_BUCKET>" \
    --region "<AWS_REGION>" \
    [--tag-regions "us-east-1,us-west-2"] \
    [--tag-all-regions] \
    [--skip-tagging] \
    [--no-rhel-usage] \
    [--dry-run]

Examples:
  # Standard run
  bash run-rh-aws-integration-via-mcp.sh \
    --integration-name "AWS Cost Management - Production" \
    --bucket "rh-cost-mgmt-reports-123456789012-us-east-1" \
    --region "us-east-1" \
    --tag-regions "us-east-1,us-west-2"

  # Dry-run plan
  bash run-rh-aws-integration-via-mcp.sh \
    --integration-name "AWS Cost Management - Production" \
    --bucket "rh-cost-mgmt-reports-123456789012-us-east-1" \
    --region "us-east-1" \
    --dry-run
EOF
}

log() { printf "▸ %s\n" "$*"; }
ok() { printf "✔ %s\n" "$*"; }
warn() { printf "⚠ %s\n" "$*"; }
die() { printf "✖ %s\n" "$*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}

mcp_call() {
  local tool="$1"
  local payload="$2"
  "$MCP_CMD" call --tool "$tool" --input "$payload"
}

json_get() {
  local json="$1"
  local query="$2"
  printf '%s' "$json" | jq -er "$query"
}

while (( "$#" )); do
  case "$1" in
    --integration-name) INTEGRATION_NAME="${2:-}"; shift 2 ;;
    --bucket) BUCKET="${2:-}"; shift 2 ;;
    --region) REGION="${2:-}"; shift 2 ;;
    --tag-regions) TAG_REGIONS="${2:-}"; shift 2 ;;
    --tag-all-regions) TAG_ALL_REGIONS=1; shift ;;
    --skip-tagging) TAGGING_ENABLED=0; shift ;;
    --no-rhel-usage) INCLUDE_RHEL_USAGE=0; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $1" ;;
  esac
done

[[ -n "$INTEGRATION_NAME" ]] || die "--integration-name is required"
[[ -n "$BUCKET" ]] || die "--bucket is required"
[[ -n "$REGION" ]] || die "--region is required"

require_cmd jq
require_cmd aws
require_cmd "$MCP_CMD"

aws sts get-caller-identity >/dev/null 2>&1 || die "AWS auth is not valid. Authenticate before running."

log "Running MCP preflight checks..."
PREFLIGHT_PAYLOAD="$(jq -n \
  --arg region "$REGION" \
  '{aws:{region:$region}, redhat:{}, checks:{permissions:true, network:true}}')"
PREFLIGHT_OUT="$(mcp_call "preflight_check" "$PREFLIGHT_PAYLOAD")"
ok "Preflight completed"

if [[ "$DRY_RUN" -eq 1 ]]; then
  log "Dry-run mode enabled"
fi

log "Initializing Red Hat integration draft..."
INIT_PAYLOAD="$(jq -n \
  --arg name "$INTEGRATION_NAME" \
  --arg bucket "$BUCKET" \
  --arg region "$REGION" \
  --argjson includeRhelUsage "$INCLUDE_RHEL_USAGE" \
  '{
     displayName:$name,
     integrationType:"aws-cost-management",
     includeRhelUsage:$includeRhelUsage,
     bucket:$bucket,
     region:$region
   }')"
INIT_OUT="$(mcp_call "rh_integration_init" "$INIT_PAYLOAD")"

INTEGRATION_ID="$(json_get "$INIT_OUT" '.integrationId')"
EXTERNAL_ID="$(json_get "$INIT_OUT" '.externalId')"
TRUSTED_ACCOUNT_ID="$(json_get "$INIT_OUT" '.trustedAccountId')"
ok "Draft created: ${INTEGRATION_ID}"

AWS_TAG_REGIONS_JSON="[]"
if [[ "$TAGGING_ENABLED" -eq 1 ]]; then
  if [[ "$TAG_ALL_REGIONS" -eq 1 ]]; then
    REGIONS_CSV="$(aws ec2 describe-regions --all-regions --query 'Regions[].RegionName' --output text | tr '\t' ',')"
    AWS_TAG_REGIONS_JSON="$(printf '%s' "$REGIONS_CSV" | jq -R 'split(",") | map(select(length>0))')"
  elif [[ -n "$TAG_REGIONS" ]]; then
    AWS_TAG_REGIONS_JSON="$(printf '%s' "$TAG_REGIONS" | jq -R 'split(",") | map(gsub("^\\s+|\\s+$";"")) | map(select(length>0))')"
  else
    AWS_TAG_REGIONS_JSON="$(jq -n --arg region "$REGION" '[$region]')"
  fi
fi

log "Applying AWS-side integration setup via MCP..."
AWS_APPLY_PAYLOAD="$(jq -n \
  --arg bucket "$BUCKET" \
  --arg region "$REGION" \
  --arg externalId "$EXTERNAL_ID" \
  --arg trustedAccountId "$TRUSTED_ACCOUNT_ID" \
  --arg reportName "$CUR_REPORT_NAME" \
  --arg prefix "$CUR_PREFIX" \
  --arg policyName "$POLICY_NAME" \
  --arg roleName "$ROLE_NAME" \
  --argjson dryRun "$DRY_RUN" \
  --argjson tagsEnabled "$TAGGING_ENABLED" \
  --argjson regions "$AWS_TAG_REGIONS_JSON" \
  '{
     bucket:$bucket,
     region:$region,
     externalId:$externalId,
     trustedAccountId:$trustedAccountId,
     cur:{
       reportName:$reportName,
       prefix:$prefix,
       timeUnit:"HOURLY",
       compression:"GZIP",
       includeResourceIds:true,
       artifacts:["REDSHIFT","QUICKSIGHT"]
     },
     tags:{
       enabled:$tagsEnabled,
       regions:$regions,
       pairs:[
         {key:"com_redhat_rhel", value:"7"},
         {key:"com_redhat_rhel_addon", value:"ELS"}
       ]
     },
     iam:{
       policyName:$policyName,
       roleName:$roleName
     },
     dryRun:$dryRun
   }')"
AWS_APPLY_OUT="$(mcp_call "aws_apply_integration" "$AWS_APPLY_PAYLOAD")"

if [[ "$DRY_RUN" -eq 1 ]]; then
  ok "Dry-run completed. No changes applied."
  printf '%s\n' "$AWS_APPLY_OUT" | jq '.'
  exit 0
fi

ROLE_ARN="$(json_get "$AWS_APPLY_OUT" '.roleArn')"
ok "AWS resources applied. Role ARN: ${ROLE_ARN}"

log "Finalizing integration in Red Hat..."
FINALIZE_PAYLOAD="$(jq -n \
  --arg integrationId "$INTEGRATION_ID" \
  --arg roleArn "$ROLE_ARN" \
  --arg bucket "$BUCKET" \
  --arg region "$REGION" \
  '{
     integrationId:$integrationId,
     roleArn:$roleArn,
     bucket:$bucket,
     region:$region
   }')"
FINALIZE_OUT="$(mcp_call "rh_integration_finalize" "$FINALIZE_PAYLOAD")"
ok "Finalize requested"

log "Validating integration status..."
START_TS="$(date +%s)"
HEALTHY=0
LAST_STATUS="unknown"

while true; do
  VALIDATE_PAYLOAD="$(jq -n \
    --arg integrationId "$INTEGRATION_ID" \
    --arg bucket "$BUCKET" \
    --arg region "$REGION" \
    --arg roleName "$ROLE_NAME" \
    '{
       integrationId:$integrationId,
       aws:{bucket:$bucket, region:$region, roleName:$roleName}
     }')"
  VALIDATE_OUT="$(mcp_call "integration_validate" "$VALIDATE_PAYLOAD")"

  HEALTHY_NOW="$(printf '%s' "$VALIDATE_OUT" | jq -r '.healthy // false')"
  LAST_STATUS="$(printf '%s' "$VALIDATE_OUT" | jq -r '.checks.redhatIntegrationStatus // "unknown"')"

  if [[ "$HEALTHY_NOW" == "true" ]]; then
    HEALTHY=1
    break
  fi

  NOW_TS="$(date +%s)"
  ELAPSED="$(( NOW_TS - START_TS ))"
  if (( ELAPSED >= VALIDATE_TIMEOUT_SEC )); then
    warn "Validation timed out after ${VALIDATE_TIMEOUT_SEC}s (last status: ${LAST_STATUS})"
    break
  fi

  log "Still validating (status: ${LAST_STATUS})... retrying in ${VALIDATE_INTERVAL_SEC}s"
  sleep "$VALIDATE_INTERVAL_SEC"
done

SUMMARY_FILE="./rh-aws-integration-summary-${INTEGRATION_ID}.json"
jq -n \
  --arg integrationId "$INTEGRATION_ID" \
  --arg roleArn "$ROLE_ARN" \
  --arg bucket "$BUCKET" \
  --arg region "$REGION" \
  --arg externalId "$EXTERNAL_ID" \
  --arg trustedAccountId "$TRUSTED_ACCOUNT_ID" \
  --arg redhatStatus "$LAST_STATUS" \
  --argjson healthy "$HEALTHY" \
  '{
     integrationId:$integrationId,
     roleArn:$roleArn,
     bucket:$bucket,
     region:$region,
     externalId:$externalId,
     trustedAccountId:$trustedAccountId,
     redhatStatus:$redhatStatus,
     healthy:$healthy
   }' > "$SUMMARY_FILE"

ok "Run complete"
printf '\n'
printf 'Integration ID: %s\n' "$INTEGRATION_ID"
printf 'Role ARN:       %s\n' "$ROLE_ARN"
printf 'Bucket:         %s\n' "$BUCKET"
printf 'Region:         %s\n' "$REGION"
printf 'Healthy:        %s\n' "$HEALTHY"
printf 'Status:         %s\n' "$LAST_STATUS"
printf 'Summary file:   %s\n' "$SUMMARY_FILE"
printf '\n'
printf 'Note: Marketplace ELS subscription may still require manual acceptance depending on account policy.\n'
