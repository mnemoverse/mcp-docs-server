---
title: MCP Tools API Reference
description: Complete API reference for all available MCP tools
tags: ["api", "reference", "mcp", "tools"]
---

# MCP Tools API Reference

This document describes all available MCP tools provided by the docs server.

## Overview

The server implements the Model Context Protocol (MCP) and provides three main tools for accessing documentation:

- **`list_documents`** - List available documents with metadata
- **`get_document`** - Retrieve full content of specific documents  
- **`search_docs`** - Search across all documentation

All tools return JSON responses and follow MCP specification standards.

## Tools

### `list_documents`

Lists all available documents in the documentation.

**Input Schema:**
```typescript
{
  section?: "guides" | "api" | "tutorials" | "reference" | "all"
}
```

**Parameters:**
- `section` (optional) - Filter results by document section. Defaults to "all"

**Response:**
```json
{
  "documents": [
    {
      "title": "Getting Started",
      "path": "guides/getting-started.md", 
      "section": "guides",
      "filename": "getting-started.md",
      "lastModified": "2025-01-29T10:30:00.000Z",
      "tags": ["getting-started", "setup"],
      "description": "Quick start guide for using the MCP Docs Demo"
    }
  ],
  "total": 1,
  "section": "all"
}
```

**Example Usage:**
```bash
# List all documents
{"name": "list_documents", "arguments": {}}

# List only guides
{"name": "list_documents", "arguments": {"section": "guides"}}
```

### `get_document`

Retrieves the full content of a specific document.

**Input Schema:**
```typescript
{
  path: string  // Required
}
```

**Parameters:**
- `path` (required) - Relative path to the document (e.g., "guides/getting-started.md")

**Response:**
```json
{
  "path": "guides/getting-started.md",
  "content": "# Getting Started\n\nWelcome to...",
  "metadata": {
    "title": "Getting Started",
    "path": "guides/getting-started.md",
    "section": "guides", 
    "filename": "getting-started.md",
    "lastModified": "2025-01-29T10:30:00.000Z",
    "tags": ["getting-started", "setup"],
    "description": "Quick start guide"
  },
  "size": 2048
}
```

**Example Usage:**
```bash
# Get specific document
{"name": "get_document", "arguments": {"path": "guides/getting-started.md"}}
```

**Error Response:**
```json
{
  "content": [
    {
      "type": "text", 
      "text": "Error: Document not found: invalid/path.md"
    }
  ],
  "isError": true
}
```

### `search_docs`

Searches across all documentation using text-based matching.

**Input Schema:**
```typescript
{
  query: string,      // Required
  maxResults?: number // Optional, default: 10
}
```

**Parameters:**
- `query` (required) - Search query string
- `maxResults` (optional) - Maximum number of results to return (default: 10)

**Response:**
```json
{
  "results": [
    {
      "document": {
        "title": "Getting Started",
        "path": "guides/getting-started.md",
        "section": "guides",
        "filename": "getting-started.md",
        "tags": ["getting-started", "setup"]
      },
      "relevanceScore": 15,
      "excerpts": [
        "# Getting Started\n\nWelcome to the MCP Docs Demo!",
        "This guide will help you get up and running quickly.",
        "Model Context Protocol (MCP) is a standardized way..."
      ]
    }
  ],
  "query": "getting started",
  "total": 1
}
```

**Relevance Scoring:**
- Title match: +10 points
- Content line match: +1 point per line
- Tag match: +5 points per tag

**Example Usage:**
```bash
# Basic search
{"name": "search_docs", "arguments": {"query": "MCP setup"}}

# Limited results
{"name": "search_docs", "arguments": {"query": "getting started", "maxResults": 5}}
```

## Document Metadata Schema

All documents include the following metadata structure:

```typescript
interface DocumentMetadata {
  title: string;          // Document title (from frontmatter or filename)
  path: string;           // Relative path from docs root
  section: string;        // Document section (folder name)
  filename: string;       // Just the filename
  lastModified?: string;  // ISO 8601 timestamp
  tags?: string[];        // Tags from frontmatter
  description?: string;   // Description from frontmatter
}
```

## Frontmatter Support

Documents can include YAML frontmatter for enhanced metadata:

```yaml
---
title: Document Title
description: Brief description of the document
tags: ["tag1", "tag2", "tag3"]
section: custom-section  # Optional override
---

# Document Content

Your markdown content here...
```

**Supported Fields:**
- `title` - Display title (overrides filename-based title)
- `description` - Brief description for search results
- `tags` - Array of tags for categorization and search
- `section` - Override auto-detected section

## Error Handling

All tools implement consistent error handling:

**Error Response Format:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: [Error message]"
    }
  ],
  "isError": true
}
```

**Common Errors:**
- `Document not found: [path]` - Invalid document path
- `Search query is required` - Missing required query parameter
- `Document path is required` - Missing required path parameter

## Performance Considerations

### Caching
- Documents are cached in memory after first access
- Metadata is scanned every 5 minutes or on server restart
- Cache is cleared when documents are modified

### Limits
- Default search results: 10 (configurable via maxResults)
- Maximum excerpts per result: 3
- Document scan frequency: 5 minutes

### Optimization Tips
- Keep document sizes reasonable (< 100KB)
- Use descriptive titles and tags for better search
- Structure content with clear headings
- Avoid deeply nested directory structures

## MCP Protocol Details

### Transport
- Uses STDIO transport for communication
- JSON-RPC 2.0 protocol
- Bi-directional communication

### Capabilities
```json
{
  "capabilities": {
    "tools": {}
  }
}
```

### Tool Registration
All tools are registered during server initialization and available via the `tools/list` method.

### Request/Response Flow
1. Client sends `tools/list` to discover available tools
2. Client sends `tools/call` with tool name and arguments
3. Server processes request and returns structured response
4. Client receives either success response or error response

## Examples

### Complete Integration Example

```typescript
// MCP Client code example
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({
  name: 'docs-client',
  version: '1.0.0'
});

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@mcp-x/mcp-docs-server']
});

await client.connect(transport);

// List all documents
const docs = await client.callTool('list_documents', {});

// Search for specific content
const results = await client.callTool('search_docs', {
  query: 'getting started',
  maxResults: 5
});

// Get specific document
const document = await client.callTool('get_document', {
  path: 'guides/getting-started.md'
});
```

### Configuration Examples

**Cursor (.cursor/mcp.json):**
```json
{
  "mcpServers": {
    "docs-server": {
      "command": "npx", 
      "args": ["-y", "@mcp-x/mcp-docs-server"]
    }
  }
}
```

**VS Code (.vscode/mcp.json):**
```json
{
  "mcpServers": {
    "docs-server": {
      "command": "npx",
      "args": ["-y", "@mcp-x/mcp-docs-server"]
    }
  }
}
```

## Extending the API

See the [Customization Guide](../guides/customization.md) for information on:
- Adding new MCP tools
- Customizing search behavior
- Implementing additional document processors
- Integrating external data sources
