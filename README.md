# MCP Client for GitHub Actions

A command-line client for connecting to MCP servers using the Model Context Protocol.

## Installation

```bash
npm install -g mcp-client-gha
```

## Usage

```bash
npx mcp-client-gha --server-config server.json --server <server-name> --tool <tool-name> --args key1=value1 --args key2=value2
```

Or, for complex arguments:

```bash
npx mcp-client-gha --server-config server.json --server <server-name> --tool <tool-name> --json-args args.json
```

### Options

- `--server-config`: Path to server configuration JSON file (required)
- `--server`: Name of the server to connect to (required)
- `--tool`: Name of the tool to run (required)
- `--args`: Arguments for the tool in key=value format (optional, can be specified multiple times)
- `--json-args`: Path to a JSON file containing all arguments (optional, overrides --args)

### Server Configuration

Create a `server.json` file with the following structure:

```json
{
  "mcpServers": {
    "discord-webhook": {
      "command": "/path/to/npx",
      "args": [
        "-y",
        "@lmquang/mcp-discord-webhook@latest"
      ],
      "env": {
        "PATH": "/path/to/node/bin:/usr/local/bin:/usr/bin:/bin",
        "NODE_PATH": "/path/to/node/lib/node_modules",
        "OPENAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

Each server entry should specify:
- `command`: The command to run the server
- `args`: Array of arguments to pass to the command
- `env`: Environment variables to set when running the command

## Examples

Run a tool with simple arguments:

```bash
npx mcp-client-gha --server-config server.json --server discord-webhook --tool discord-send-embed --args username="Tech Trends Analyzer" --args webhookUrl="https://your-webhook-url" --args content="Your summary text" --args autoFormat=true --args embeds="[]"
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
npx mcp-client-gha --server-config server.json --server discord-webhook --tool discord-send-embed --json-args args.json
``` 