# MCP Client for GitHub Actions

A command-line client for connecting to MCP servers using the Model Context Protocol.

## Installation

```bash
npm install -g @lmquang/mcp-client-cli
```

## Usage

```bash
npx @lmquang/mcp-client-cli --server-config server.json --server <server-name> --tool <tool-name> --args key1=value1 --args key2=value2
```

Or, for complex arguments:

```bash
npx @lmquang/mcp-client-cli --server-config server.json --server <server-name> --tool <tool-name> --json-args args.json
```

### Options

- `--server-config`: Path to server configuration JSON file (required)
- `--server`: Name of the server to connect to (required)
- `--tool`: Name of the tool to run (required)
- `--args`: Arguments for the tool in key=value format (optional, can be specified multiple times)
- `--json-args`: Path to a JSON file containing all arguments (optional, overrides --args)

### Server Configuration

Create a `server.json` file with the following structure. **It is recommended to use the full path to `npx` in the `command` field to avoid PATH issues:**

```json
{
  "mcpServers": {
    "discord-webhook": {
      "command": "/Users/youruser/.nvm/versions/node/vXX.XX.X/bin/npx",
      "args": [
        "-y",
        "@lmquang/mcp-discord-webhook@latest"
      ],
      "env": {
        "OPENAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

Each server entry should specify:
- `command`: The command to run the server (use the full path to npx for reliability)
- `args`: Array of arguments to pass to the command
- `env`: Environment variables to set when running the command

> **Note:** Do not commit `server.json` to your repository. It may contain secrets and should be listed in `.gitignore`.

## Examples

Run a tool with simple arguments:

```bash
npx @lmquang/mcp-client-cli --server-config server.json --server discord-webhook --tool discord-send-embed --args username="Tech Trends Analyzer" --args webhookUrl="https://your-webhook-url" --args content="Your summary text" --args autoFormat=true --args embeds="[]"
```

Run a tool with complex arguments using a JSON file:

Create `args.json`:
```json
{
  "username": "Tech Trends Analyzer",
  "webhookUrl": "https://your-webhook-url",
  "content": "Your summary text",
  "autoFormat": true,
  "embeds": []
}
```

Then run:
```bash
npx @lmquang/mcp-client-cli --server-config server.json --server discord-webhook --tool discord-send-embed --json-args args.json
```

If you need to share a server configuration, provide a `server.json.example` file with placeholder values and no secrets. 