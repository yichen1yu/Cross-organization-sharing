# Red Hat AWS Integration MCP Specification (Draft v0.1)

## 1) Purpose
Provide end-to-end automation of Red Hat Hybrid Cloud Console AWS integration so users can run from Cursor and complete setup without manual ARN copy/paste.

## 2) Scope
Automates:
- Red Hat integration draft/init
- AWS-side resource setup (S3, CUR, optional EC2 tags, Cost Allocation Tags, IAM policy/role)
- Red Hat integration finalize (submit ARN/config)
- Validation and status reporting
- Optional rollback

Out of scope by default:
- AWS Marketplace ELS subscription acceptance

## 3) MCP Server Identity
- Server name: `redhat-aws-integration`
- Version: `0.1.0`
- Transport: stdio (required), streamable HTTP (optional)
- Runtime: Node.js or Python
- State: stateless API calls + optional persisted run records

## 4) Required Credentials
### AWS auth (one of)
- CloudShell identity (preferred)
- `AWS_PROFILE`
- Access key env vars
- Assume-role chain

### Red Hat auth
- `RH_API_TOKEN` (or OAuth bearer)
- Required scope: integration read/write (exact scopes per RH API)

## 5) MCP Resources (read-only)
1. `rh://integration/templates/aws-cost-mgmt`
   - Canonical defaults (`koku`, `cost`, tag keys, role/policy names)
2. `rh://integration/permissions/aws-minimum`
   - IAM action checklist for preflight
3. `rh://integration/run/{runId}`
   - Execution log/status snapshot
4. `rh://integration/errors/catalog`
   - Known error codes and remediation hints

## 6) MCP Tools

### 6.1 `preflight_check`
Purpose: Verify prerequisites before any write.

Input:
```json
{
  "aws": { "region": "us-east-1", "profile": "optional" },
  "redhat": { "orgId": "optional" },
  "checks": { "permissions": true, "network": true }
}
```

Output:
```json
{
  "ok": true,
  "aws": {
    "accountId": "123456789012",
    "callerArn": "arn:aws:sts::...",
    "region": "us-east-1",
    "missingPermissions": []
  },
  "redhat": { "authenticated": true, "orgId": "12345" },
  "warnings": []
}
```

### 6.2 `rh_integration_init`
Purpose: Create draft integration in Red Hat and fetch required AWS trust values.

Input:
```json
{
  "displayName": "AWS Cost Management - Production",
  "integrationType": "aws-cost-management",
  "includeRhelUsage": true,
  "bucket": "rh-cost-mgmt-reports-123456789012-us-east-1",
  "region": "us-east-1"
}
```

Output:
```json
{
  "integrationId": "rh-int-abc123",
  "externalId": "ext-xxxx",
  "trustedAccountId": "589173575009",
  "status": "draft"
}
```

### 6.3 `aws_apply_integration`
Purpose: Perform AWS-side setup idempotently.

Input:
```json
{
  "bucket": "rh-cost-mgmt-reports-123456789012-us-east-1",
  "region": "us-east-1",
  "externalId": "ext-xxxx",
  "trustedAccountId": "589173575009",
  "cur": {
    "reportName": "koku",
    "prefix": "cost",
    "timeUnit": "HOURLY",
    "compression": "GZIP",
    "includeResourceIds": true,
    "artifacts": ["REDSHIFT", "QUICKSIGHT"]
  },
  "tags": {
    "enabled": true,
    "regions": ["us-east-1", "us-west-2"],
    "pairs": [
      {"key": "com_redhat_rhel", "value": "7"},
      {"key": "com_redhat_rhel_addon", "value": "ELS"}
    ]
  },
  "iam": {
    "policyName": "ELS_Metering_Access_Policy",
    "roleName": "RH_ELS_Metering_Role"
  },
  "dryRun": false
}
```

Output:
```json
{
  "roleArn": "arn:aws:iam::123456789012:role/RH_ELS_Metering_Role",
  "policyArn": "arn:aws:iam::123456789012:policy/ELS_Metering_Access_Policy",
  "curLocation": "s3://rh-cost-mgmt-reports-123456789012-us-east-1/cost",
  "changes": [
    {"resource": "s3.bucket", "action": "created"},
    {"resource": "cur.report", "action": "exists"},
    {"resource": "iam.role", "action": "updated"}
  ],
  "warnings": []
}
```

### 6.4 `rh_integration_finalize`
Purpose: Submit ARN/config back to Red Hat and activate integration.

Input:
```json
{
  "integrationId": "rh-int-abc123",
  "roleArn": "arn:aws:iam::123456789012:role/RH_ELS_Metering_Role",
  "bucket": "rh-cost-mgmt-reports-123456789012-us-east-1",
  "region": "us-east-1"
}
```

Output:
```json
{
  "integrationId": "rh-int-abc123",
  "status": "pending_validation",
  "nextCheckAfterSeconds": 60
}
```

### 6.5 `integration_validate`
Purpose: Validate AWS + Red Hat side health.

Input:
```json
{
  "integrationId": "rh-int-abc123",
  "aws": {
    "bucket": "rh-cost-mgmt-reports-123456789012-us-east-1",
    "region": "us-east-1",
    "roleName": "RH_ELS_Metering_Role"
  }
}
```

Output:
```json
{
  "healthy": true,
  "checks": {
    "iamTrust": "pass",
    "policyAttached": "pass",
    "curDefinition": "pass",
    "costTagsActive": "warn",
    "redhatIntegrationStatus": "pending_data_ingest"
  },
  "warnings": [
    "Cost allocation tags may take up to 24h to appear as active."
  ]
}
```

### 6.6 `rollback_integration` (recommended)
Purpose: Undo created resources and/or cancel RH draft.

Input:
```json
{
  "integrationId": "rh-int-abc123",
  "aws": {
    "removeCur": true,
    "removeIam": true,
    "removeBucket": false
  },
  "confirm": true
}
```

Output:
```json
{
  "rolledBack": true,
  "actions": [
    {"resource": "iam.role", "action": "deleted"},
    {"resource": "cur.report", "action": "deleted"}
  ]
}
```

## 7) Prompt Templates (Optional)
- `run_full_setup`
- `run_dry_run_plan`
- `validate_existing_integration`
- `rollback_failed_setup`

## 8) Idempotency Rules
- S3 bucket: create if absent
- CUR report: create if absent; optional reconcile drift
- IAM policy: create new default version; prune old versions when needed
- IAM role: create/update trust policy
- Role policy attachment: attach only if missing
- RH init/finalize: safe retries with correlation key

## 9) Error Model
Suggested error codes:
- `AUTH_AWS_INVALID`
- `AUTH_RH_INVALID`
- `PERMISSION_MISSING`
- `RESOURCE_CONFLICT`
- `EXTERNAL_ID_MISMATCH`
- `RATE_LIMITED`
- `NETWORK_UNREACHABLE`

Error payload:
```json
{
  "errorCode": "PERMISSION_MISSING",
  "message": "Missing iam:CreateRole",
  "retryable": false,
  "remediation": "Grant iam:CreateRole or use elevated role."
}
```

## 10) Security Requirements
- Never log tokens/secrets (`RH_API_TOKEN`, AWS session tokens)
- Mask sensitive values in logs where required
- Require explicit confirmation for mutating actions unless `autoApprove=true`
- Support dry-run (read-only) mode
- Maintain auditable run logs with retention policy
- Enforce least privilege

## 11) End-User Prerequisites
- Cursor with MCP configured
- Red Hat API token available to MCP runtime
- AWS authenticated context (CloudShell / profile / assumed role)
- IAM permissions from `rh://integration/permissions/aws-minimum`
- Network access to AWS and Red Hat APIs

## 12) End-to-End Execution Flow
1. `preflight_check`
2. `rh_integration_init`
3. `aws_apply_integration`
4. `rh_integration_finalize`
5. `integration_validate` (poll until stable)
6. Return final success summary

This flow removes manual ARN copy/paste once tools 6.2–6.4 are implemented.
