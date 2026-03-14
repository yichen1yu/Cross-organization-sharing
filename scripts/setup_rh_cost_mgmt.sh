#!/usr/bin/env bash
set -euo pipefail

# Red Hat Cost Management / ELS metering AWS bootstrap
# Automates:
# - S3 bucket for CUR
# - CUR report "koku" (hourly, resources, gzip, Redshift/QuickSight)
# - Optional EC2 tagging (com_redhat_rhel=7, com_redhat_rhel_addon=ELS)
# - Activate Cost Allocation Tags
# - Create/Update IAM policy and role trusted to Red Hat account with provided External ID
# Outputs Role ARN and CUR details for use in Red Hat Hybrid Cloud Console wizard.
#
# Requirements:
# - AWS CLI v2 authenticated with permissions for S3, CUR, CE, IAM, EC2 (if tagging)
# - bash, jq (optional for pretty JSON)
#
# Manual steps still required:
# - Subscribe ELS Marketplace listing as per your locale
# - Paste Role ARN + External ID into Red Hat Hybrid Cloud Console wizard
# - Wait for CUR delivery (can take up to 24h)
#
# Usage:
#   ./setup_rh_cost_mgmt.sh <BUCKET_NAME> <AWS_REGION> <EXTERNAL_ID> [TAG_REGIONS]
# Flags:
#   --wizard          Guided prompts for inputs
#   --plan            Dry run; show intended actions and exit
#   --output json     Machine-readable output (RoleArn, Bucket, Region)
#   -h | --help       Show help
#
# Examples:
#   ./setup_rh_cost_mgmt.sh rh-cost-mgmt-reports-123456789012-us-east-1 us-east-1 abcdef-1234
#   ./setup_rh_cost_mgmt.sh --wizard
#   ./setup_rh_cost_mgmt.sh rh-... us-east-1 abc --plan
#   ./setup_rh_cost_mgmt.sh rh-... us-east-1 abc us-east-1,us-west-2 --output json

REPORT_NAME="koku"
S3_PREFIX="cost"
CUR_TIME_UNIT="HOURLY"
CUR_COMPRESSION="GZIP"
CUR_ARTIFACTS='["REDSHIFT","QUICKSIGHT"]'
RH_ACCOUNT_ID="589173575009"   # From workshop slides
POLICY_NAME="ELS_Metering_Access_Policy"
ROLE_NAME="RH_ELS_Metering_Role"
TAG_KEY_1="com_redhat_rhel"
TAG_VAL_1="7"
TAG_KEY_2="com_redhat_rhel_addon"
TAG_VAL_2="ELS"

WIZARD=0
PLAN=0
OUTPUT="text"

usage() {
  sed -n '1,120p' "$0" | sed -n '1,120p' | awk '
    BEGIN { print "Usage:\n  setup_rh_cost_mgmt.sh <BUCKET_NAME> <AWS_REGION> <EXTERNAL_ID> [TAG_REGIONS]\nFlags:\n  --wizard          Guided prompts for inputs\n  --plan            Dry run; show intended actions and exit\n  --output json     Machine-readable output (RoleArn, Bucket, Region)\n  -h | --help       Show help\n" }
  '
}

die() { echo "Error: $*" >&2; exit 1; }

have() { command -v "$1" >/dev/null 2>&1; }

json_out() {
  local payload="$1"
  if [[ "$OUTPUT" == "json" ]]; then
    if have jq; then echo "$payload" | jq '.'; else echo "$payload"; fi
  fi
}

preflight() {
  have aws || die "aws CLI is required (https://docs.aws.amazon.com/cli/)."
  aws sts get-caller-identity >/dev/null 2>&1 || die "AWS credentials not configured or lack STS permissions."
}

account_id() { aws sts get-caller-identity --query Account --output text; }
exists_bucket() { aws s3api head-bucket --bucket "$1" >/dev/null 2>&1; }
cur_defined() { aws cur describe-report-definitions --region us-east-1 --query "ReportDefinitions[?ReportName=='$REPORT_NAME'] | length(@)" --output text 2>/dev/null || echo 0; }

ensure_bucket() {
  local bucket="$1" region="$2"
  if ! exists_bucket "$bucket"; then
    echo "=> Creating S3 bucket: s3://$bucket (region: $region)"
    if [[ "$region" == "us-east-1" ]]; then
      aws s3api create-bucket --bucket "$bucket"
    else
      aws s3api create-bucket --bucket "$bucket" --create-bucket-configuration "LocationConstraint=$region"
    fi
  else
    echo "=> Bucket exists: s3://$bucket"
  fi
}

ensure_cur() {
  local bucket="$1" region="$2"
  echo "=> Ensuring CUR report '$REPORT_NAME' to s3://$bucket/$S3_PREFIX (CUR API is us-east-1 scoped)"
  if [[ "$(cur_defined)" -eq 0 ]]; then
    aws cur put-report-definition --region us-east-1 --report-definition "{
      \"ReportName\": \"$REPORT_NAME\",
      \"TimeUnit\": \"$CUR_TIME_UNIT\",
      \"Format\": \"textORcsv\",
      \"Compression\": \"$CUR_COMPRESSION\",
      \"AdditionalSchemaElements\": [\"RESOURCES\"],
      \"S3Bucket\": \"$bucket\",
      \"S3Prefix\": \"$S3_PREFIX\",
      \"S3Region\": \"$region\",
      \"AdditionalArtifacts\": $CUR_ARTIFACTS,
      \"RefreshClosedReports\": true,
      \"ReportVersioning\": \"OVERWRITE_REPORT\",
      \"BillingViewArn\": null
    }"
  else
    echo "   CUR '$REPORT_NAME' already present; skipping."
  fi
}

tag_instances() {
  local regions_csv="$1"
  [[ -z "${regions_csv:-}" ]] && { echo "=> Skipping instance tagging (no TAG_REGIONS provided)"; return 0; }
  IFS=',' read -r -a REGIONS <<< "$regions_csv"
  for R in "${REGIONS[@]}"; do
    echo "=> Tagging running EC2 instances in $R with $TAG_KEY_1=$TAG_VAL_1 and $TAG_KEY_2=$TAG_VAL_2"
    IDS=$(aws ec2 describe-instances --region "$R" --query "Reservations[].Instances[?State.Name=='running'].InstanceId" --output text)
    if [[ -n "${IDS// /}" ]]; then
      aws ec2 create-tags --region "$R" --resources $IDS --tags Key="$TAG_KEY_1",Value="$TAG_VAL_1" Key="$TAG_KEY_2",Value="$TAG_VAL_2"
    else
      echo "   No running instances found in $R; skipping."
    fi
  done
}

activate_cat() {
  local region="$1"
  echo "=> Activating Cost Allocation Tags in region: $region"
  aws ce update-cost-allocation-tags-status --region "$region" --cost-allocation-tags-status "[
    {\"TagKey\":\"$TAG_KEY_1\",\"Status\":\"Active\"},
    {\"TagKey\":\"$TAG_KEY_2\",\"Status\":\"Active\"}
  ]" >/dev/null || true
}

upsert_iam() {
  local bucket="$1" external_id="$2"
  local acct role_arn policy_arn
  acct="$(account_id)"
  local policy_doc trust_doc
  policy_doc="$(mktemp)"; trust_doc="$(mktemp)"
  cat > "$policy_doc" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::$bucket"],
      "Condition": { "StringLike": { "s3:prefix": [ "$S3_PREFIX/*" ] } }
    },
    {
      "Sid": "ReadObjects",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::$bucket/$S3_PREFIX/*"]
    }
  ]
}
EOF
  cat > "$trust_doc" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::$RH_ACCOUNT_ID:root" },
      "Action": "sts:AssumeRole",
      "Condition": { "StringEquals": { "sts:ExternalId": "$external_id" } }
    }
  ]
}
EOF
  echo "=> Creating/Updating IAM policy $POLICY_NAME"
  policy_arn="arn:aws:iam::$acct:policy/$POLICY_NAME"
  if aws iam get-policy --policy-arn "$policy_arn" >/dev/null 2>&1; then
    aws iam create-policy-version --policy-arn "$policy_arn" --policy-document "file://$policy_doc" --set-as-default >/dev/null
  else
    policy_arn=$(aws iam create-policy --policy-name "$POLICY_NAME" --policy-document "file://$policy_doc" --query Policy.Arn --output text)
  fi
  echo "=> Creating/Updating role $ROLE_NAME"
  if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
    aws iam update-assume-role-policy --role-name "$ROLE_NAME" --policy-document "file://$trust_doc"
  else
    aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document "file://$trust_doc" >/dev/null
  fi
  if ! aws iam list-attached-role-policies --role-name "$ROLE_NAME" --query "AttachedPolicies[?PolicyArn=='$policy_arn'] | length(@)" --output text | grep -q '^1$'; then
    aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn "$policy_arn"
  fi
  role_arn=$(aws iam get-role --role-name "$ROLE_NAME" --query Role.Arn --output text)
  echo "$role_arn"
}

post_run_summary() {
  local role_arn="$1" bucket="$2" region="$3"
  echo
  echo "Success."
  echo "Role ARN: $role_arn"
  echo "CUR bucket/prefix: s3://$bucket/$S3_PREFIX"
  echo "Next steps:"
  echo "  1) Paste Role ARN + your External ID into Red Hat Hybrid Cloud Console wizard"
  echo "  2) Subscribe the required ELS Marketplace listing"
  echo "  3) Wait for CUR to deliver (up to 24h); verify objects under s3://$bucket/$S3_PREFIX/"
}

# Parse flags
ARGS=()
while (( "$#" )); do
  case "${1:-}" in
    --wizard) WIZARD=1; shift ;;
    --plan) PLAN=1; shift ;;
    --output) OUTPUT="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    --) shift; break ;;
    -* ) die "Unknown flag: $1" ;;
    *  ) ARGS+=("$1"); shift ;;
  esac
done
# If only --plan is provided, allow generic plan output without AWS CLI or args
if [[ "$PLAN" -eq 1 && "$WIZARD" -eq 0 && "$#" -lt 3 ]]; then
  cat <<EOF
Plan (generic):
  - Ensure S3 bucket: s3://<BUCKET_NAME> (region: <AWS_REGION>)
  - Ensure CUR '$REPORT_NAME' -> s3://<BUCKET_NAME>/$S3_PREFIX (us-east-1 API)
  - Tag EC2 instances in: <TAG_REGIONS or none>
  - Activate Cost Allocation Tags in: <AWS_REGION>
  - Upsert IAM policy '$POLICY_NAME' and role '$ROLE_NAME' (trust: Red Hat $RH_ACCOUNT_ID, ExternalId)
  - Output Role ARN and summary
Manual:
  - Subscribe ELS Marketplace listing
  - Paste Role ARN + External ID into RH Console wizard
EOF
  exit 0
fi

if [[ ${#ARGS[@]:-0} -gt 0 ]]; then
  set -- "${ARGS[@]}" "$@"
fi

# Only require AWS CLI when performing actual AWS operations or detailed plan with concrete args
if [[ "$PLAN" -eq 0 || ( "$PLAN" -eq 1 && "$#" -ge 3 ) || "$WIZARD" -eq 1 ]]; then
  preflight
fi

DEFAULT_REGION="$(aws configure get region || true)"

if [[ "$WIZARD" -eq 1 ]]; then
  echo "== Wizard mode =="
  read -rp "S3 bucket name for CUR [rh-cost-mgmt-reports-$(account_id)-${DEFAULT_REGION:-us-east-1}]: " BUCKET_NAME
  BUCKET_NAME="${BUCKET_NAME:-rh-cost-mgmt-reports-$(account_id)-${DEFAULT_REGION:-us-east-1}}"
  read -rp "AWS region for bucket and CE [${DEFAULT_REGION:-us-east-1}]: " AWS_REGION
  AWS_REGION="${AWS_REGION:-${DEFAULT_REGION:-us-east-1}}"
  read -rp "External ID (from Red Hat wizard): " EXTERNAL_ID
  read -rp "Tagging regions (comma-separated) [leave blank to skip tagging]: " TAG_REGIONS
else
  if [[ $# -lt 3 ]]; then
    usage; exit 1
  fi
  BUCKET_NAME="$1"
  AWS_REGION="$2"
  EXTERNAL_ID="$3"
  TAG_REGIONS="${4:-}"
fi

if [[ "$PLAN" -eq 1 ]]; then
  cat <<EOF
Plan:
  - Ensure S3 bucket: s3://$BUCKET_NAME (region: $AWS_REGION)
  - Ensure CUR '$REPORT_NAME' -> s3://$BUCKET_NAME/$S3_PREFIX (us-east-1 API)
  - Tag EC2 instances in: ${TAG_REGIONS:-<none>}
  - Activate Cost Allocation Tags in: $AWS_REGION
  - Upsert IAM policy '$POLICY_NAME' and role '$ROLE_NAME' (trust: Red Hat $RH_ACCOUNT_ID, ExternalId)
  - Output Role ARN and summary
Manual:
  - Subscribe ELS Marketplace listing
  - Paste Role ARN + External ID into RH Console wizard
EOF
  exit 0
fi

ensure_bucket "$BUCKET_NAME" "$AWS_REGION"
ensure_cur "$BUCKET_NAME" "$AWS_REGION"
tag_instances "${TAG_REGIONS:-}"
activate_cat "$AWS_REGION"
ROLE_ARN="$(upsert_iam "$BUCKET_NAME" "$EXTERNAL_ID")"

if [[ "$OUTPUT" == "json" ]]; then
  json_out "{\"RoleArn\":\"$ROLE_ARN\",\"Bucket\":\"$BUCKET_NAME\",\"Region\":\"$AWS_REGION\",\"Prefix\":\"$S3_PREFIX\"}"
else
  post_run_summary "$ROLE_ARN" "$BUCKET_NAME" "$AWS_REGION"
fi

