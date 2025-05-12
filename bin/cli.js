#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv))
  .option('server-config', {
    describe: 'Path to server configuration JSON file',
    type: 'string',
    demandOption: true
  })
  .option('server', {
    describe: 'Server name to connect to',
    type: 'string',
    demandOption: true
  })
  .option('tool', {
    describe: 'Tool name to run',
    type: 'string',
    demandOption: true
  })
  .option('args', {
    describe: 'Arguments for the tool in key=value format or key=json format for complex values',
    type: 'array',
    default: []
  })
  .option('json-args', {
    describe: 'Path to a JSON file containing all arguments',
    type: 'string'
  })
  .help()
  .argv;

async function main() {
  try {
    let toolArgs = {};
    
    // If json-args is provided, load arguments from the JSON file
    if (argv.jsonArgs) {
      const argsPath = path.resolve(process.cwd(), argv.jsonArgs);
      const argsContent = await fs.readFile(argsPath, 'utf8');
      toolArgs = JSON.parse(argsContent);
    } 
    // Otherwise, process individual args
    else if (argv.args && Array.isArray(argv.args)) {
      argv.args.forEach(arg => {
        const separatorIndex = arg.indexOf('=');
        if (separatorIndex !== -1) {
          const key = arg.substring(0, separatorIndex);
          const value = arg.substring(separatorIndex + 1);
          
          // Try to parse as JSON if it starts with [ or {
          if ((value.startsWith('{') && value.endsWith('}')) || 
              (value.startsWith('[') && value.endsWith(']'))) {
            try {
              toolArgs[key] = JSON.parse(value);
            } catch (e) {
              // If parsing fails, use the raw string
              toolArgs[key] = value;
            }
          } else if (value === 'true') {
            toolArgs[key] = true;
          } else if (value === 'false') {
            toolArgs[key] = false;
          } else if (!isNaN(Number(value))) {
            toolArgs[key] = Number(value);
          } else {
            toolArgs[key] = value;
          }
        }
      });
    }

    // Load server configuration
    const configPath = path.resolve(process.cwd(), argv.serverConfig);
    const configContent = await fs.readFile(configPath, 'utf8');
    const serverConfig = JSON.parse(configContent);

    // Find the specified server in mcpServers
    const server = serverConfig.mcpServers?.[argv.server];
    if (!server) {
      console.error(`Server "${argv.server}" not found in configuration`);
      process.exit(1);
    }

    // Create client
    const client = new Client({
      name: "mcp-client-cli",
      version: "1.0.0"
    });

    // Create transport based on server configuration
    const transport = new StdioClientTransport({
      command: server.command,
      args: server.args || [],
      env: server.env || {}
    });

    // Connect to the server
    await client.connect(transport);
    console.log(`Connected to MCP server: ${argv.server}`);

    // Call the tool
    const result = await client.callTool({
      name: argv.tool,
      arguments: toolArgs
    });

    // Output the result
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main(); 