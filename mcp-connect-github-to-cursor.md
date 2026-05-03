**Time needed:** 3–5 minutes. No extra tools required.

This guide connects your GitHub account to Cursor using [GitHub's hosted MCP endpoint](https://github.com/modelcontextprotocol/servers/tree/main/src/github). Once connected, your Cursor agent can read, search, and manage your GitHub repositories, pull requests, and Actions directly from chat.

---

## What you'll be able to do

Once connected, you can open Cursor's chat and type things like:

* "Show me the recent commits on main."
* "Create a PR for my current branch with a summary of what changed."
* "Check my GitHub Actions deployment status."
* "Search for usage of AuthService across my repo."
* "Show me the contents of README.md from my repo."
* "Push, deploy, and fix deployment errors if any."

No switching to the browser. No clicking through GitHub's UI. Just describe what you want in plain language.

---

## What you'll need

* **Cursor** installed and licensed (see Step 1 if you don't have it).
* **A GitHub account** with access to the repos you want to work with.

---

## Step 1: Get Cursor (if you don't have it yet)

If you already have Cursor installed, skip to Step 2.

1. Go to the [Cursor page on The Source](https://source.redhat.com/projects_and_programs/ai/ai_tools/cursor).
2. Click **Getting started**, then **Cursor License Request**.
3. You'll get a license email within about 5 minutes.
4. Download, install, and open Cursor.

---

## Step 2: Generate a GitHub Personal Access Token

You'll need a Personal Access Token (PAT) so the MCP server can access GitHub on your behalf.

1. Go to [GitHub.com](https://github.com) → click your **profile icon** → **Settings**.
2. Scroll down to **Developer settings** (bottom of the left sidebar).
3. Click **Personal access tokens** → **Tokens (Fine-grained tokens)**.
4. Click **Generate new token**.
5. Give it a descriptive name (e.g., "Cursor MCP").
6. Set an expiration that works for you.
7. Select repository access and permissions. At minimum, enable:
   * **Repository access** — select the repos you want to work with (or all repositories).
   * **Contents** — Read and write (to read files and push code).
   * **Pull requests** — Read and write (to create and manage PRs).
   * **Actions** — Read-only (to check deployment status).
   * **Metadata** — Read-only (always required for fine-grained tokens).
8. Click **Generate token** and **copy it immediately** — you won't see it again.

> **Classic tokens work too.** If you prefer a classic token, select scopes: `repo`, `workflow`, and `read:org`. Fine-grained tokens are recommended because they follow the principle of least privilege.

---

## Step 3: Add the GitHub MCP to Cursor

Open your MCP config file at `~/.cursor/mcp.json`. If you already have other MCPs configured (like Atlassian or Slack), add `github` inside the existing `mcpServers` object.

**Note:** If you already have an `mcp.json` file with other servers configured, add `github` inside the existing `mcpServers` object rather than replacing the whole file. You can also edit the file directly at `~/.cursor/mcp.json`. Replace the placeholder value with your actual token.

```
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR-TOKEN-HERE"
      }
    }
  }
}
```

Replace `YOUR-TOKEN-HERE` with the PAT you generated in Step 2. Save the file.

This uses GitHub's hosted MCP endpoint — no local server, no Node.js, no extra dependencies. Cursor connects directly to GitHub's API.

> **Project-level config.** You can also place `mcp.json` inside `.cursor/` in a specific project root. The global file at `~/.cursor/mcp.json` applies to all projects; a project-level file applies only to that project.

---

## Step 4: Try it out

1. Reload Cursor (Cmd+Shift+P → "Reload Window"). A full restart (Cmd+Q and reopen) also works.
2. Go to **Settings** → **Tools & MCP**. You should see **github** in the list with a **green dot**.
3. Open Cursor's chat panel.
4. Make sure you're in **Agent** mode with **claude-4.6-opus-high**.
5. Type: "Show me the recent commits on main."
6. Cursor will ask permission to run a tool. Click **Run tool** to approve.

If you see a list of commits, you're all set.

---

## Troubleshooting

| What's happening | What to do |
| --- | --- |
| **MCP shows red or disconnected** | Reload Cursor (Cmd+Shift+P → "Reload Window"). If it persists, try a full restart (Cmd+Q and reopen). |
| **"Bad credentials" or auth errors** | Your PAT may be invalid or expired. Generate a new one in GitHub Settings → Developer settings → Personal access tokens. Update `mcp.json` with the new token. |
| **"Not found" on a repo** | Fine-grained tokens are scoped to specific repos. Make sure your token has access to the repository you're asking about. |
| **JSON syntax error** | Check your `mcp.json` for missing commas or brackets. If you have multiple MCPs, make sure each entry is separated by a comma inside the `mcpServers` object. |
| **"Unauthorized" errors** | Make sure the `Authorization` header value starts with `Bearer ` (with a space) followed by your token. |

---

## Things to try

Once you're up and running:

* "What open PRs do I have? Summarize each one."
* "Create a PR for my current branch. Include a summary of all changes."
* "Check if the latest GitHub Actions run passed on main."
* "Show me all issues labeled 'bug' in my repo."
* "Search for TODO comments across my codebase on GitHub."
* "Compare the main branch with my current branch — what's different?"

Describe what you want in plain language. The MCP handles the GitHub API mechanics.

---

## Important notes

* **Your PAT is personal.** Don't share it. It grants access to GitHub as you. Store it only in your `mcp.json` file, which stays on your machine.
* **Tokens expire.** When your PAT expires, generate a new one and update `mcp.json`.
* **The MCP acts as you.** Any PR, push, or comment it makes appears under your GitHub account. Review what the agent wants to do before approving.
* **Fine-grained tokens are recommended.** They let you limit access to specific repos and permissions, rather than granting blanket access.

---

## Getting help

* **Cursor's Agent** (your first stop): describe what's wrong in chat, paste any errors.
* **Slack:** `#forum-cursor-at-red-hat` for Cursor setup questions.
* **GitHub:** [@modelcontextprotocol/server-github](https://github.com/modelcontextprotocol/servers/tree/main/src/github) for MCP-specific issues.

---

## Quick checklist

* Cursor installed and licensed
* Chat set to **Agent** mode with **claude-4.6-opus-high**
* GitHub PAT generated and copied
* `github` added to `~/.cursor/mcp.json` with your token in the `Authorization` header
* MCP shows green/connected in Settings → Tools & MCP
* Ran a test prompt and got results from GitHub
