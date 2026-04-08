## Red Hat Cost Management / ELS metering AWS bootstrap

This utility automates the AWS-side setup needed for integrating AWS cost data and RHEL ELS metering with the Red Hat Hybrid Cloud Console.

It follows the workshop guidance for:
- S3 bucket creation for CUR
- Defining the CUR report "koku" (hourly, resources, gzip, Redshift/QuickSight)
- Optional EC2 instance tagging across regions:
  - `com_redhat_rhel=7`
  - `com_redhat_rhel_addon=ELS`
- Activating the two Cost Allocation Tags
- Creating an IAM policy and role trusted to the Red Hat account with your External ID

### Two-phase workflow

AWS requires up to 24 hours for Cost Allocation Tags and CUR data to become available. The script splits setup into two phases to handle this gracefully:

| Phase | When | What it does |
|-------|------|-------------|
| **Phase 1** | Run immediately | Creates S3 bucket, CUR report, IAM role/policy, tags EC2 instances. Saves all values to a state file. |
| **Phase 2** | Run after ~24 hours | Activates Cost Allocation Tags, validates CUR delivery, checks IAM setup. |

If the Red Hat wizard is re-run and generates a **new External ID**, the script can update the IAM role trust in one command — no need to redo the full setup.

What remains manual:
- Subscribe the correct ELS Marketplace listing (per your locale).
- Paste the generated Role ARN and your External ID into the Red Hat Hybrid Cloud Console wizard.

### Easier path: Run in AWS CloudShell

No local AWS CLI or credential setup needed. Log into the AWS Console (including via Red Hat IdP → Select a role), open **AWS CloudShell** from the console header, then run:

```bash
curl -fsSL "<BASE_URL>/setup_rh_cost_mgmt.sh" | bash -s -- --wizard
```

Replace `<BASE_URL>` with the URL where the script is hosted (e.g. GitHub raw or your CDN). CloudShell uses the same session as the console, so no SSO or profile configuration is required.

### Contents
- `scripts/setup_rh_cost_mgmt.sh`: Main setup script (Phase 1, Phase 2, and External ID update)
- `scripts/setup_rh_cost_mgmt.sh.sha256`: SHA-256 checksum
- `scripts/validate_rh_cost_mgmt.sh`: Standalone validation script
- `scripts/teardown_rh_cost_mgmt.sh`: Removes all AWS resources created by setup
- `scripts/install-rh-cost-mgmt.sh`: Installer that verifies checksum and runs the setup

### Quick start

```bash
# Phase 1: Initial setup (guided wizard)
./scripts/setup_rh_cost_mgmt.sh --wizard

# Complete the Red Hat Hybrid Cloud Console wizard with the output values.
# Wait ~24 hours for Cost Allocation Tags and CUR data.

# Phase 2: Activate tags and validate
./scripts/setup_rh_cost_mgmt.sh --phase2
```

### Direct script usage

```bash
./scripts/setup_rh_cost_mgmt.sh <BUCKET_NAME> <AWS_REGION> <EXTERNAL_ID> [TAG_REGIONS]
```

Flags:
- `--wizard`: Guided prompts for all inputs
- `--plan`: Dry run; prints intended actions and exits
- `--output json`: Prints machine-readable JSON (RoleArn, ExternalId, Bucket, Region, Prefix)
- `--update-external-id <ID>`: Updates IAM role trust with a new External ID
- `--phase2`: Runs delayed steps (activate tags, validate CUR, check IAM)
- `--show`: Displays saved wizard values from state file

Examples:
```bash
# Guided setup (Phase 1)
./scripts/setup_rh_cost_mgmt.sh --wizard

# Non-interactive with optional EC2 tagging across multiple regions
./scripts/setup_rh_cost_mgmt.sh rh-cost-mgmt-reports-123456789012-us-east-1 us-east-1 abcdef-1234 us-east-1,us-west-2

# Dry run
./scripts/setup_rh_cost_mgmt.sh rh-bucket us-east-1 abc --plan

# JSON output for automation
./scripts/setup_rh_cost_mgmt.sh rh-bucket us-east-1 abc --output json

# Update External ID (if Red Hat wizard generates a new one)
./scripts/setup_rh_cost_mgmt.sh --update-external-id <NEW_EXTERNAL_ID>

# Phase 2: Activate tags and validate (after ~24 hours)
./scripts/setup_rh_cost_mgmt.sh --phase2

# Show saved wizard values
./scripts/setup_rh_cost_mgmt.sh --show
```

### State file

The script saves all wizard values to `~/.rh-cost-mgmt-state.json` after Phase 1. This file is used by `--phase2`, `--update-external-id`, and `--show` so you don't need to remember or re-enter values.

```json
{
  "role_arn": "arn:aws:iam::123456789012:role/RH_ELS_Metering_Role",
  "external_id": "abc-123-...",
  "bucket": "rh-cost-mgmt-reports-123456789012-us-east-1",
  "region": "us-east-1",
  "prefix": "cost",
  "saved_at": "2026-04-06T04:30:00Z"
}
```

### Handling External ID changes

If you remove and re-add the integration in the Red Hat Hybrid Cloud Console, the wizard generates a **new External ID**. Instead of re-running the full setup, just run:

```bash
./scripts/setup_rh_cost_mgmt.sh --update-external-id <NEW_EXTERNAL_ID>
```

This updates the IAM role trust policy and the state file in one step. No other AWS resources are affected.

### Validation

Use the standalone validation script or Phase 2:

```bash
# Via Phase 2 (recommended — uses saved state)
./scripts/setup_rh_cost_mgmt.sh --phase2

# Standalone
./scripts/validate_rh_cost_mgmt.sh <BUCKET_NAME> <AWS_REGION> [ROLE_NAME] [EXTERNAL_ID]
```

Validation checks:
- Bucket/prefix exists and latest CUR object if available
- CUR "koku" points to your bucket/prefix
- Cost Allocation Tags are Active
- IAM role trust has External ID and Red Hat principal; policy attached
- EC2 instances tagged in the configured region

### Teardown

```bash
./scripts/teardown_rh_cost_mgmt.sh <BUCKET_NAME> <AWS_REGION> [--remove-bucket] [--yes]
```

Teardown removes the CUR definition and IAM artifacts; optionally empties and deletes the bucket.

### Required permissions (AWS)
- S3: `s3:Get*`, `s3:List*`, `s3:CreateBucket`, `s3:PutBucketPolicy`
- CUR: `cur:PutReportDefinition`, `cur:DescribeReportDefinitions` (us-east-1 scoped)
- CE: `ce:UpdateCostAllocationTagsStatus`, `ce:ListCostAllocationTags`, `ce:GetCostAndUsage`, `ce:GetCostForecast`
- EC2: `ec2:CreateTags`, `ec2:DescribeInstances` (optional, only if tagging is used)
- IAM: Create/Update policy and role; attach policy
- Organizations: `organizations:List*`, `organizations:Describe*` (if applicable)

### Output
- All four wizard values (Role ARN, External ID, S3 Bucket, AWS Region)
- CUR S3 location: `s3://<bucket>/cost`
- State file at `~/.rh-cost-mgmt-state.json`
- Optional JSON block if `--output json` is used

Security notes:
- The IAM trust policy restricts assume-role by requiring the External ID you provide.
- Installer verifies the setup script via SHA-256 before running it.
- The state file contains the External ID — keep it secure (same machine, same user).
