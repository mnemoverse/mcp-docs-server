---
title: Getting Started
description: Quick start guide for using the MCP Docs Demo
tags: ["getting-started", "setup", "mcp"]
---

# Getting Started

Welcome to the MCP Docs Demo! This guide will help you get up and running quickly.

## What is MCP?

Model Context Protocol (MCP) is a standardized way for AI agents to interact with external tools and data sources. This demo server provides AI agents with access to documentation through the MCP protocol.

## Quick Setup

### 1. Test the Demo
```bash
npx @mcp-x/mcp-docs-server
```

You should see:
```
🚀 Initializing Universal MCP Docs Server...
📁 Docs path resolved to: /path/to/docs
✅ MCP Server ready for STDIO communication
```

### 2. Add to Your IDE

**Cursor:**
```json
{
  "mcpServers": {
    "demo-docs": {
      "command": "npx",
      "args": ["-y", "@mcp-x/mcp-docs-server"]
    }
  }
}
```

**VS Code:**
```json
{
  "mcpServers": {
    "demo-docs": {
      "command": "npx", 
      "args": ["-y", "@mcp-x/mcp-docs-server"]
    }
  }
}
```

### 3. Test with AI Agent

Once configured, you can ask your AI agent:
- "List all available documents"
- "Show me the getting started guide" 
- "Search for information about MCP setup"

## Available Commands

The demo server provides three main tools:

### `list_documents`
Lists all available documentation
```
/list_documents
/list_documents section:guides
```

### `get_document`
Retrieves full document content
```
/get_document path:guides/getting-started.md
```

### `search_docs`
Searches across all documentation
```
/search_docs query:"MCP setup"
/search_docs query:"getting started" maxResults:5
```

## Next Steps

1. **Customize for your docs** - Replace the demo docs with your own
2. **Configure the server** - Update settings in `src/config.ts`
3. **Publish your version** - Create your own npm package
4. **Integrate with your workflow** - Add to your development environment

See the [Customization Guide](./customization.md) for detailed instructions.

## Troubleshooting

### Server not starting
- Check that Node.js >= 18 is installed
- Verify npm/npx is working: `npx --version`
- Try running with verbose output: `DEBUG=* npx @mcp-x/mcp-docs-server`

### IDE not detecting server
- Restart your IDE after adding MCP configuration
- Check the configuration file syntax
- Verify the server starts manually first

### No documents found
- Check that docs directory exists and contains .md files
- Verify file permissions
- Look for error messages in server output

## Getting Help

- [GitHub Issues](https://github.com/mcp-x/mcp-docs-server/issues)
- [MCP Documentation](https://spec.modelcontextprotocol.io/)
- [Customization Guide](./customization.md)
