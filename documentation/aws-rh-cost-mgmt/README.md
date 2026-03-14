## Red Hat Cost Management / ELS metering AWS bootstrap

This utility automates the AWS-side setup needed for integrating AWS cost data and RHEL ELS metering with the Red Hat Hybrid Cloud Console.

It follows the workshop guidance for:
- S3 bucket creation for CUR
- Defining the CUR report “koku” (hourly, resources, gzip, Redshift/QuickSight)
- Optional EC2 instance tagging across regions:
  - `com_redhat_rhel=7`
  - `com_redhat_rhel_addon=ELS`
- Activating the two Cost Allocation Tags
- Creating an IAM policy and role trusted to the Red Hat account with your External ID

What remains manual
- Subscribe the correct ELS Marketplace listing (per your locale).
- Paste the generated Role ARN and your External ID into the Red Hat Hybrid Cloud Console wizard.
- Wait for CUR delivery to the S3 bucket (can take up to 24 hours).

### Easier path: Run in AWS CloudShell

No local AWS CLI or credential setup needed. Log into the AWS Console (including via Red Hat IdP → Select a role), open **AWS CloudShell** from the console header, then run:

```bash
curl -fsSL "<BASE_URL>/setup_rh_cost_mgmt.sh" | bash -s -- --wizard
```

Replace `<BASE_URL>` with the URL where the script is hosted (e.g. GitHub raw or your CDN). CloudShell uses the same session as the console, so no SSO or profile configuration is required.

### Contents
- `scripts/setup_rh_cost_mgmt.sh`: Main setup script
- `scripts/setup_rh_cost_mgmt.sh.sha256`: SHA-256 checksum
- `scripts/install-rh-cost-mgmt.sh`: Installer that verifies checksum and runs the setup

### One‑liner install (recommended)
Host the files at a URL (e.g., your CDN, S3 static site, GitHub raw), then share this one‑liner with customers:

```bash
curl -fsSL "<BASE_URL>/install-rh-cost-mgmt.sh" | bash -s -- --base-url "<BASE_URL>" --tool setup -- --wizard
```

Notes:
- Replace `<BASE_URL>` with where you host:
  - `setup_rh_cost_mgmt.sh`
  - `setup_rh_cost_mgmt.sh.sha256`
  - `install-rh-cost-mgmt.sh`
  - `validate_rh_cost_mgmt.sh` + `.sha256`
  - `teardown_rh_cost_mgmt.sh` + `.sha256`
- Everything after the second `--` is forwarded to the setup script.

### Direct script usage

```bash
./scripts/setup_rh_cost_mgmt.sh <BUCKET_NAME> <AWS_REGION> <EXTERNAL_ID> [TAG_REGIONS]
```

Flags:
- `--wizard`: Guided prompts for all inputs
- `--plan`: Dry run; prints intended actions and exits
- `--output json`: Prints machine‑readable JSON (RoleArn, Bucket, Region, Prefix)

Examples:
```bash
# Guided setup
./scripts/setup_rh_cost_mgmt.sh --wizard

# Non‑interactive with optional EC2 tagging across multiple regions
./scripts/setup_rh_cost_mgmt.sh rh-cost-mgmt-reports-123456789012-us-east-1 us-east-1 abcdef-1234 us-east-1,us-west-2

# Dry run
./scripts/setup_rh_cost_mgmt.sh rh-bucket us-east-1 abc --plan

# JSON output for automation
./scripts/setup_rh_cost_mgmt.sh rh-bucket us-east-1 abc --output json
```

### Validation
Use the installer to fetch and run validation (with checksum):

```bash
curl -fsSL "<BASE_URL>/install-rh-cost-mgmt.sh" | bash -s -- --base-url "<BASE_URL>" --tool validate -- <BUCKET_NAME> <AWS_REGION> [ROLE_NAME] [EXTERNAL_ID]
```

Or directly:

```bash
./scripts/validate_rh_cost_mgmt.sh <BUCKET_NAME> <AWS_REGION> [ROLE_NAME] [EXTERNAL_ID]
```

Validation checks:
- Bucket/prefix exists and latest CUR object if available
- CUR “koku” points to your bucket/prefix
- Cost Allocation Tags are Active
- IAM role trust has External ID and Red Hat principal; policy attached

### Teardown

```bash
curl -fsSL "<BASE_URL>/install-rh-cost-mgmt.sh" | bash -s -- --base-url "<BASE_URL>" --tool teardown -- <BUCKET_NAME> <AWS_REGION> --yes
```

Or directly:

```bash
./scripts/teardown_rh_cost_mgmt.sh <BUCKET_NAME> <AWS_REGION> [--remove-bucket] [--yes]
```

Teardown removes the CUR definition and IAM artifacts; optionally empties and deletes the bucket.

### Required permissions (AWS)
- S3: Create/ListBucket, GetObject
- CUR: `cur:PutReportDefinition`, `cur:DescribeReportDefinitions` (us-east-1 scoped)
- EC2: `CreateTags` (optional, only if tagging is used)
- CE: `ce:UpdateCostAllocationTagsStatus`
- IAM: Create/Update policy and role; attach policy

### Output
- Role ARN to paste into the Red Hat wizard
- CUR S3 location: `s3://<bucket>/cost`
- Optional JSON block if `--output json` is used

Security notes:
- The IAM trust policy restricts assume-role by requiring the External ID you provide.
- Installer verifies the setup script via SHA‑256 before running it.

