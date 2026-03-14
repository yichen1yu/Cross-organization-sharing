# CloudShell Quickstart — AWS + Red Hat Hybrid Cloud Console Integration

A single script that automates the entire AWS side of the Red Hat Cost Management / RHEL ELS metering integration. Designed to run in **AWS CloudShell** — no local CLI install, no credential configuration.

---

## What it does

The script walks through 5 steps (matching the Red Hat Subscription Workshop flow):

| Step | Action | PDF reference |
|------|--------|---------------|
| 1 | Create an S3 bucket for billing reports | Step 1 |
| 2 | Create the CUR report `koku` (hourly, GZIP, resources, Redshift + QuickSight) | Steps 2–3 |
| 3 | Tag running EC2 instances with `com_redhat_rhel=7` and `com_redhat_rhel_addon=ELS` | Step 3 |
| 4 | Activate the two Cost Allocation Tags in Cost Explorer | Step 4 |
| 5 | Create IAM policy + role trusted to Red Hat (account `589173575009`) with your External ID | Step 6 |

At the end it prints the **Role ARN** you paste into the Red Hat Hybrid Cloud Console wizard (Steps 5 & 7 in the PDF).

---

## Prerequisites

1. **An AWS account** with permissions for S3, CUR, IAM, Cost Explorer, and (optionally) EC2 tagging.
2. **AWS CloudShell** — open it from the AWS Console header bar (the terminal icon).
3. **External ID** — optional input to this script. If not provided, the script uses a placeholder value (`REPLACE_WITH_EXTERNAL_ID_FROM_RED_HAT`) so you can see script shape and output.

That's it. CloudShell already has the AWS CLI and uses the same session as your console login.

---

## Quick start

### 1. Open AWS CloudShell

Log into the [AWS Console](https://console.aws.amazon.com) (via any method, including Red Hat IdP) and click the **CloudShell** icon in the top navigation bar.

### 2. One copy-paste command (recommended)

Replace the two placeholder values, then run this single block in CloudShell:

```bash
BASE_URL="https://your-host.example.com"
EXTERNAL_ID="REPLACE_WITH_EXTERNAL_ID_FROM_RED_HAT"
curl -fsSL "${BASE_URL}/rh-aws-integration.sh" | bash -s -- --external-id "${EXTERNAL_ID}"
```

### 3. Download and run manually (alternative)

**If the script is hosted at a URL** (e.g. CDN, GitHub raw, S3 static site):

```bash
curl -fsSL "https://your-host.example.com/rh-aws-integration.sh" | bash
```

**Or download and run manually:**

```bash
curl -fsSL "https://your-host.example.com/rh-aws-integration.sh" -o rh-aws-integration.sh
chmod +x rh-aws-integration.sh
bash rh-aws-integration.sh
```

If run with no options, the script uses defaults:

- Bucket: `rh-cost-mgmt-reports-<account-id>-<region>`
- Region: current CloudShell region (or `us-east-1`)
- External ID: placeholder (`REPLACE_WITH_EXTERNAL_ID_FROM_RED_HAT`)
- Tagging: running EC2 instances in the selected region

### 4. Copy the Role ARN

When the script finishes, it prints the Role ARN. Copy it.

### 5. Complete the Red Hat wizard

1. Return to the Red Hat Hybrid Cloud Console integration wizard.
2. Paste the Role ARN.
3. Review and click **Add**.
4. Subscribe your AWS account to the ELS Marketplace listing (EMEA and non-EMEA have separate listings).
5. Wait up to 24 hours for CUR data to appear.

---

## Usage reference

`bash rh-aws-integration.sh [OPTIONS]`

| Option | Description |
|--------|-------------|
| *(no flags)* | Run with sensible defaults |
| `--plan` | Dry run — shows what would happen, makes no changes |
| `--bucket <NAME>` | S3 bucket name |
| `--region <REGION>` | AWS region (e.g. `us-east-1`) |
| `--external-id <ID>` | External ID from Red Hat wizard (recommended in real runs) |
| `--tag-regions <CSV>` | Comma-separated regions for EC2 tagging |
| `--tag-all-regions` | Tag running EC2 instances in all enabled regions |
| `--skip-tagging` | Skip EC2 tagging step |
| `--output json` | Print machine-readable summary with ARN |
| `-h`, `--help` | Show help |

### Examples

```bash
# Default run with sensible defaults
bash rh-aws-integration.sh

# Dry run
bash rh-aws-integration.sh --plan

# Run with explicit External ID (recommended)
bash rh-aws-integration.sh \
  --region us-east-1 \
  --external-id abcdef-1234-5678

# Run across multiple regions for EC2 tags
bash rh-aws-integration.sh \
  --external-id abcdef-1234-5678 \
  --tag-regions us-east-1,us-west-2

# JSON output (for pipelines)
bash rh-aws-integration.sh --external-id abcdef-1234-5678 --output json
```

---

## What you still do manually

| Step | Where | Why |
|------|-------|-----|
| Get the External ID | Red Hat Hybrid Cloud Console wizard | Red Hat generates this per-integration |
| Paste the Role ARN | Red Hat Hybrid Cloud Console wizard | Links Red Hat to your AWS role |
| Subscribe to ELS Marketplace listing | AWS Marketplace | Required for metering to work |
| Wait for CUR delivery | — | First delivery can take up to 24 hours |

---

## Idempotency

The script is safe to re-run:

- **S3 bucket** — skips creation if it already exists.
- **CUR report** — skips if `koku` is already defined.
- **EC2 tags** — applies tags idempotently (existing tags are overwritten with the same values).
- **IAM policy** — creates a new version if the policy exists (and auto-cleans old non-default versions if needed); otherwise creates it.
- **IAM role** — updates the trust policy if the role exists; otherwise creates it.
- **Cost Allocation Tags** — activation is idempotent; if tags don't exist yet (can take 24h to appear), it gracefully warns.

---

## Required AWS permissions

The identity used in CloudShell needs:

| Service | Permissions |
|---------|-------------|
| STS | `sts:GetCallerIdentity` |
| S3 | `s3:CreateBucket`, `s3:HeadBucket` |
| CUR | `cur:PutReportDefinition`, `cur:DescribeReportDefinitions` |
| EC2 | `ec2:DescribeInstances`, `ec2:CreateTags` (only if tagging) |
| Cost Explorer | `ce:UpdateCostAllocationTagsStatus` |
| IAM | `iam:CreatePolicy`, `iam:CreatePolicyVersion`, `iam:GetPolicy`, `iam:CreateRole`, `iam:GetRole`, `iam:UpdateAssumeRolePolicy`, `iam:AttachRolePolicy`, `iam:ListAttachedRolePolicies` |

---

## Files

```
cloudshell-quickstart/
├── README.md                ← this file
└── rh-aws-integration.sh   ← the script
```
