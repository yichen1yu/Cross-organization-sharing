# MCP Orchestrated Integration Quickstart

This README is for the script:

- `cloudshell-quickstart/run-rh-aws-integration-via-mcp.sh`

It is intended for users who already have the **Red Hat integration MCP** installed in Cursor (or available via a CLI bridge).

---

## What this script does

Runs the full integration flow through MCP tools so users do not manually move values (like ARN) between AWS and Red Hat:

1. `preflight_check`
2. `rh_integration_init`
3. `aws_apply_integration`
4. `rh_integration_finalize`
5. `integration_validate` (polling until healthy or timeout)

---

## Prerequisites

1. **AWS authentication is active** (for example via CloudShell, SSO profile, or assumed role).
2. **MCP CLI bridge is installed** and supports:

   ```bash
   <MCP_CMD> call --tool <tool_name> --input '<json>'
   ```

3. Commands available in shell:
   - `aws`
   - `jq`
   - MCP command (default `rh-mcp`, or set `MCP_CMD` env var)
4. User has required AWS/RH permissions for integration setup.

---

## Quick start

```bash
bash cloudshell-quickstart/run-rh-aws-integration-via-mcp.sh \
  --integration-name "AWS Cost Management - Production" \
  --bucket "rh-cost-mgmt-reports-123456789012-us-east-1" \
  --region "us-east-1" \
  --tag-regions "us-east-1,us-west-2"
```

If your MCP binary is not named `rh-mcp`:

```bash
MCP_CMD="your-mcp-cli" \
bash cloudshell-quickstart/run-rh-aws-integration-via-mcp.sh \
  --integration-name "AWS Cost Management - Production" \
  --bucket "rh-cost-mgmt-reports-123456789012-us-east-1" \
  --region "us-east-1"
```

---

## Dry run

```bash
bash cloudshell-quickstart/run-rh-aws-integration-via-mcp.sh \
  --integration-name "AWS Cost Management - Production" \
  --bucket "rh-cost-mgmt-reports-123456789012-us-east-1" \
  --region "us-east-1" \
  --dry-run
```

---

## Options

| Option | Description |
|---|---|
| `--integration-name` | Red Hat integration display name |
| `--bucket` | S3 bucket for CUR |
| `--region` | AWS region |
| `--tag-regions` | Comma-separated regions for EC2 tagging |
| `--tag-all-regions` | Tag running instances in all enabled regions |
| `--skip-tagging` | Skip EC2 tagging step |
| `--no-rhel-usage` | Disable include RHEL usage flag on init |
| `--dry-run` | Plan-only mode, no writes |

---

## Output

At completion, the script prints:

- `Integration ID`
- `Role ARN`
- `Bucket`
- `Region`
- Health and status summary

It also writes a local JSON summary file:

- `./rh-aws-integration-summary-<integrationId>.json`

---

## Notes

- The script assumes MCP tool contracts from `cloudshell-quickstart/RedHat-AWS-Integration-MCP-Spec.md`.
- Depending on account policy, **AWS Marketplace ELS subscription** may still require manual acceptance.
