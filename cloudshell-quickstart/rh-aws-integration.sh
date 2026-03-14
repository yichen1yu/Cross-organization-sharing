#!/usr/bin/env bash
set -euo pipefail

# CloudShell-first AWS integration bootstrap for Red Hat Hybrid Cloud Console.
# This script completes AWS-side setup and prints the IAM Role ARN to paste
# into the Red Hat integration wizard.

RH_ACCOUNT_ID="589173575009"
REPORT_NAME="koku"
S3_PREFIX="cost"
POLICY_NAME="ELS_Metering_Access_Policy"
ROLE_NAME="RH_ELS_Metering_Role"
TAG_KEY_RHEL="com_redhat_rhel"
TAG_VAL_RHEL="7"
TAG_KEY_ADDON="com_redhat_rhel_addon"
TAG_VAL_ADDON="ELS"
EXTERNAL_ID_PLACEHOLDER="REPLACE_WITH_EXTERNAL_ID_FROM_RED_HAT"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

info() { printf "${CYAN}▸ %s${NC}\n" "$*"; }
ok() { printf "${GREEN}✔ %s${NC}\n" "$*"; }
warn() { printf "${YELLOW}⚠ %s${NC}\n" "$*"; }
die() { printf "${RED}✖ %s${NC}\n" "$*" >&2; exit 1; }
banner() { printf "\n${BOLD}═══ %s ═══${NC}\n\n" "$*"; }

account_id() { aws sts get-caller-identity --query Account --output text; }

PLAN=0
OUTPUT="text"
BUCKET_NAME=""
AWS_REGION=""
EXTERNAL_ID=""
TAG_REGIONS=""
TAG_ALL_REGIONS=0
SKIP_TAGGING=0

usage() {
  cat <<'EOF'
Usage:
  bash rh-aws-integration.sh [options]

Options:
  --bucket <NAME>       S3 bucket for CUR (default: rh-cost-mgmt-reports-<acct>-<region>)
  --region <REGION>     AWS region for S3/CE (default: current AWS CLI region)
  --external-id <ID>    External ID from Red Hat wizard (default: placeholder)
  --tag-regions <CSV>   Regions to tag EC2 instances, e.g. us-east-1,us-west-2
  --tag-all-regions     Tag running instances in all enabled EC2 regions
  --skip-tagging        Skip EC2 tagging step
  --plan                Dry run, print actions only
  --output json         JSON summary output
  -h, --help            Show help

Examples:
  bash rh-aws-integration.sh --plan
  bash rh-aws-integration.sh --external-id "<EXTERNAL_ID>"
  bash rh-aws-integration.sh --external-id "<EXTERNAL_ID>" --tag-all-regions
EOF
}

while (( "$#" )); do
  case "$1" in
    --bucket) BUCKET_NAME="${2:-}"; shift 2 ;;
    --region) AWS_REGION="${2:-}"; shift 2 ;;
    --external-id) EXTERNAL_ID="${2:-}"; shift 2 ;;
    --tag-regions) TAG_REGIONS="${2:-}"; shift 2 ;;
    --tag-all-regions) TAG_ALL_REGIONS=1; shift ;;
    --skip-tagging) SKIP_TAGGING=1; shift ;;
    --plan) PLAN=1; shift ;;
    --output) OUTPUT="${2:-text}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $1" ;;
  esac
done

banner "Preflight"
command -v aws >/dev/null 2>&1 || die "aws CLI not found (run this in AWS CloudShell)"
aws sts get-caller-identity >/dev/null 2>&1 || die "Not authenticated. Open AWS CloudShell from AWS Console."

ACCT_ID="$(account_id)"
DEFAULT_REGION="${AWS_DEFAULT_REGION:-$(aws configure get region 2>/dev/null || echo us-east-1)}"
AWS_REGION="${AWS_REGION:-$DEFAULT_REGION}"
BUCKET_NAME="${BUCKET_NAME:-rh-cost-mgmt-reports-${ACCT_ID}-${AWS_REGION}}"
EXTERNAL_ID="${EXTERNAL_ID:-$EXTERNAL_ID_PLACEHOLDER}"

if [[ "$SKIP_TAGGING" -eq 0 && "$TAG_ALL_REGIONS" -eq 1 ]]; then
  TAG_REGIONS="$(aws ec2 describe-regions --all-regions --query "Regions[].RegionName" --output text | tr '\t' ',')"
elif [[ "$SKIP_TAGGING" -eq 0 && -z "$TAG_REGIONS" ]]; then
  TAG_REGIONS="$AWS_REGION"
fi

if [[ "$PLAN" -eq 1 ]]; then
  banner "Plan"
  cat <<EOF
Account:           ${ACCT_ID}
Bucket:            s3://${BUCKET_NAME}
Bucket region:     ${AWS_REGION}
CUR report:        ${REPORT_NAME} -> s3://${BUCKET_NAME}/${S3_PREFIX} (CUR API in us-east-1)
EC2 tagging:       $( [[ "$SKIP_TAGGING" -eq 1 ]] && echo "disabled" || echo "${TAG_REGIONS}" )
Cost tags:         ${TAG_KEY_RHEL}, ${TAG_KEY_ADDON}
IAM policy:        ${POLICY_NAME}
IAM role:          ${ROLE_NAME}
Trusted account:   ${RH_ACCOUNT_ID}
External ID:       ${EXTERNAL_ID}
EOF
  exit 0
fi

banner "S3 bucket"
if aws s3api head-bucket --bucket "$BUCKET_NAME" >/dev/null 2>&1; then
  ok "Bucket already exists: s3://${BUCKET_NAME}"
else
  info "Creating bucket s3://${BUCKET_NAME} in ${AWS_REGION}"
  if [[ "$AWS_REGION" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "$BUCKET_NAME" >/dev/null
  else
    aws s3api create-bucket --bucket "$BUCKET_NAME" \
      --create-bucket-configuration "LocationConstraint=${AWS_REGION}" >/dev/null
  fi
  ok "Bucket created"
fi

banner "Cost & Usage Report"
EXISTING_CUR="$(aws cur describe-report-definitions --region us-east-1 \
  --query "ReportDefinitions[?ReportName=='${REPORT_NAME}'] | length(@)" --output text 2>/dev/null || echo 0)"
if [[ "$EXISTING_CUR" -gt 0 ]]; then
  ok "CUR report '${REPORT_NAME}' already exists"
else
  info "Creating CUR report '${REPORT_NAME}'"
  aws cur put-report-definition --region us-east-1 --report-definition "{
    \"ReportName\": \"${REPORT_NAME}\",
    \"TimeUnit\": \"HOURLY\",
    \"Format\": \"textORcsv\",
    \"Compression\": \"GZIP\",
    \"AdditionalSchemaElements\": [\"RESOURCES\"],
    \"S3Bucket\": \"${BUCKET_NAME}\",
    \"S3Prefix\": \"${S3_PREFIX}\",
    \"S3Region\": \"${AWS_REGION}\",
    \"AdditionalArtifacts\": [\"REDSHIFT\", \"QUICKSIGHT\"],
    \"RefreshClosedReports\": true,
    \"ReportVersioning\": \"OVERWRITE_REPORT\"
  }" >/dev/null
  ok "CUR report created"
fi

banner "EC2 tagging"
if [[ "$SKIP_TAGGING" -eq 1 ]]; then
  warn "Skipping EC2 tagging (--skip-tagging)"
else
  IFS=',' read -r -a REGIONS <<< "$TAG_REGIONS"
  for REGION in "${REGIONS[@]}"; do
    REGION="$(printf '%s' "$REGION" | xargs)"
    [[ -z "$REGION" ]] && continue
    IDS="$(aws ec2 describe-instances --region "$REGION" \
      --filters "Name=instance-state-name,Values=running" \
      --query "Reservations[].Instances[].InstanceId" --output text 2>/dev/null || true)"
    if [[ -z "${IDS// /}" ]]; then
      warn "No running instances found in ${REGION}"
      continue
    fi
    COUNT="$(printf '%s\n' "$IDS" | wc -w | xargs)"
    # shellcheck disable=SC2086
    aws ec2 create-tags --region "$REGION" --resources $IDS \
      --tags "Key=${TAG_KEY_RHEL},Value=${TAG_VAL_RHEL}" "Key=${TAG_KEY_ADDON},Value=${TAG_VAL_ADDON}" >/dev/null
    ok "Tagged ${COUNT} running instance(s) in ${REGION}"
  done
fi

banner "Cost allocation tags"
aws ce update-cost-allocation-tags-status --region "$AWS_REGION" --cost-allocation-tags-status "[
  {\"TagKey\":\"${TAG_KEY_RHEL}\",\"Status\":\"Active\"},
  {\"TagKey\":\"${TAG_KEY_ADDON}\",\"Status\":\"Active\"}
]" >/dev/null 2>&1 || warn "Activation requested; tags may take time to appear before they can be activated."
ok "Cost allocation tags processed"

banner "IAM policy and role"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT
POLICY_FILE="${WORKDIR}/policy.json"
TRUST_FILE="${WORKDIR}/trust.json"

cat > "$POLICY_FILE" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::${BUCKET_NAME}"],
      "Condition": { "StringLike": { "s3:prefix": ["${S3_PREFIX}/*"] } }
    },
    {
      "Sid": "ReadObjects",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::${BUCKET_NAME}/${S3_PREFIX}/*"]
    }
  ]
}
EOF

cat > "$TRUST_FILE" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::${RH_ACCOUNT_ID}:root" },
      "Action": "sts:AssumeRole",
      "Condition": { "StringEquals": { "sts:ExternalId": "${EXTERNAL_ID}" } }
    }
  ]
}
EOF

POLICY_ARN="arn:aws:iam::${ACCT_ID}:policy/${POLICY_NAME}"
if aws iam get-policy --policy-arn "$POLICY_ARN" >/dev/null 2>&1; then
  NON_DEFAULT="$(aws iam list-policy-versions --policy-arn "$POLICY_ARN" \
    --query "Versions[?IsDefaultVersion==\`false\`]|sort_by(@,&CreateDate)[].VersionId" --output text)"
  if [[ "$(printf '%s\n' "$NON_DEFAULT" | wc -w | xargs)" -ge 4 ]]; then
    OLDEST="$(printf '%s\n' "$NON_DEFAULT" | awk '{print $1}')"
    aws iam delete-policy-version --policy-arn "$POLICY_ARN" --version-id "$OLDEST"
  fi
  aws iam create-policy-version --policy-arn "$POLICY_ARN" \
    --policy-document "file://${POLICY_FILE}" --set-as-default >/dev/null
  ok "Policy updated: ${POLICY_NAME}"
else
  POLICY_ARN="$(aws iam create-policy --policy-name "$POLICY_NAME" \
    --policy-document "file://${POLICY_FILE}" --query "Policy.Arn" --output text)"
  ok "Policy created: ${POLICY_NAME}"
fi

if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam update-assume-role-policy --role-name "$ROLE_NAME" \
    --policy-document "file://${TRUST_FILE}" >/dev/null
  ok "Role trust policy updated: ${ROLE_NAME}"
else
  aws iam create-role --role-name "$ROLE_NAME" \
    --assume-role-policy-document "file://${TRUST_FILE}" >/dev/null
  ok "Role created: ${ROLE_NAME}"
fi

ATTACHED="$(aws iam list-attached-role-policies --role-name "$ROLE_NAME" \
  --query "AttachedPolicies[?PolicyArn=='${POLICY_ARN}'] | length(@)" --output text)"
if [[ "$ATTACHED" -eq 0 ]]; then
  aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn "$POLICY_ARN" >/dev/null
fi
ok "Policy attached to role"

ROLE_ARN="$(aws iam get-role --role-name "$ROLE_NAME" --query "Role.Arn" --output text)"

banner "Done"
if [[ "$OUTPUT" == "json" ]]; then
  printf '{"RoleArn":"%s","Bucket":"%s","Region":"%s","Prefix":"%s","ExternalId":"%s"}\n' \
    "$ROLE_ARN" "$BUCKET_NAME" "$AWS_REGION" "$S3_PREFIX" "$EXTERNAL_ID"
else
  cat <<EOF
AWS-side setup complete.

Role ARN:
  ${ROLE_ARN}

Copy/paste helper:
  ROLE_ARN=${ROLE_ARN}

Bucket and report path:
  s3://${BUCKET_NAME}/${S3_PREFIX}

Next in Red Hat:
  1) Open Add Cloud Integration wizard
  2) Enter bucket: ${BUCKET_NAME}
  3) Enter region: ${AWS_REGION}
  4) Paste Role ARN above
EOF
fi
