#!/usr/bin/env bash
# Jira REST API helper functions for Red Hat Atlassian instance.
# Source this file:  source scripts/jira-api.sh

JIRA_BASE="https://redhat.atlassian.net/rest/api/3"
JIRA_EMAIL="yiyu@redhat.com"
JIRA_TOKEN_FILE="$HOME/.jira-token"

_jira_auth() {
  if [[ ! -f "$JIRA_TOKEN_FILE" ]]; then
    echo "ERROR: Token file $JIRA_TOKEN_FILE not found." >&2
    echo "Generate one at https://id.atlassian.com/manage-profile/security/api-tokens" >&2
    return 1
  fi
  echo "${JIRA_EMAIL}:$(cat "$JIRA_TOKEN_FILE")"
}

# Search issues via JQL (POST endpoint — the old GET /search was removed)
# Usage: jira_search "project = CPUX ORDER BY created DESC"
jira_search() {
  local jql="$1"
  local max="${2:-50}"
  curl -s -u "$(_jira_auth)" \
    -X POST \
    -H "Content-Type: application/json" \
    "${JIRA_BASE}/search/jql" \
    -d "{\"jql\": \"${jql}\", \"maxResults\": ${max}}"
}

# Get a single issue by key
# Usage: jira_get_issue "CPUX-1234"
jira_get_issue() {
  local key="$1"
  curl -s -u "$(_jira_auth)" \
    -H "Content-Type: application/json" \
    "${JIRA_BASE}/issue/${key}"
}

# Create an issue from a JSON payload
# Usage: jira_create_issue '{"fields":{"project":{"key":"CPUX"},"summary":"title","issuetype":{"name":"Story"}}}'
jira_create_issue() {
  local json="$1"
  curl -s -u "$(_jira_auth)" \
    -X POST \
    -H "Content-Type: application/json" \
    "${JIRA_BASE}/issue" \
    -d "$json"
}

# Edit/update an existing issue
# Usage: jira_edit_issue "CPUX-1234" '{"fields":{"summary":"new title"}}'
jira_edit_issue() {
  local key="$1"
  local json="$2"
  curl -s -u "$(_jira_auth)" \
    -X PUT \
    -H "Content-Type: application/json" \
    "${JIRA_BASE}/issue/${key}" \
    -d "$json"
}

# Transition an issue to a new status
# Usage: jira_transition_issue "CPUX-1234" '{"transition":{"id":"31"}}'
jira_transition_issue() {
  local key="$1"
  local json="$2"
  curl -s -u "$(_jira_auth)" \
    -X POST \
    -H "Content-Type: application/json" \
    "${JIRA_BASE}/issue/${key}/transitions" \
    -d "$json"
}

# List available transitions for an issue
# Usage: jira_get_transitions "CPUX-1234"
jira_get_transitions() {
  local key="$1"
  curl -s -u "$(_jira_auth)" \
    -H "Content-Type: application/json" \
    "${JIRA_BASE}/issue/${key}/transitions"
}

# Add a comment to an issue (Atlassian Document Format)
# Usage: jira_add_comment "CPUX-1234" "This is my comment"
jira_add_comment() {
  local key="$1"
  local text="$2"
  curl -s -u "$(_jira_auth)" \
    -X POST \
    -H "Content-Type: application/json" \
    "${JIRA_BASE}/issue/${key}/comment" \
    -d "{\"body\":{\"version\":1,\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"${text}\"}]}]}}"
}

# Search for a user by name or email
# Usage: jira_lookup_user "yiyu"
jira_lookup_user() {
  local query="$1"
  curl -s -u "$(_jira_auth)" \
    -G \
    --data-urlencode "query=${query}" \
    "${JIRA_BASE}/user/search"
}

# Link two issues together
# Usage: jira_link_issues "Blocks" "CPUX-100" "CPUX-200"
jira_link_issues() {
  local type="$1"
  local inward_key="$2"
  local outward_key="$3"
  curl -s -u "$(_jira_auth)" \
    -X POST \
    -H "Content-Type: application/json" \
    "${JIRA_BASE}/issueLink" \
    -d "{\"type\":{\"name\":\"${type}\"},\"inwardIssue\":{\"key\":\"${inward_key}\"},\"outwardIssue\":{\"key\":\"${outward_key}\"}}"
}
