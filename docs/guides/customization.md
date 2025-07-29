---
title: Customization Guide
description: How to customize the MCP Docs Demo for your own documentation
tags: ["customization", "configuration", "development"]
---

# Customization Guide

This guide shows you how to customize the MCP Docs Demo template for your own documentation server.

## Overview

The demo template is designed to be easily customizable. You can:
- Replace the demo documentation with your own
- Configure server settings and behavior
- Customize the search functionality
- Brand it with your own package name

## Step-by-Step Customization

### 1. Clone or Fork the Template

```bash
# Option A: Use as template (recommended)
npx @mcp-x/mcp-docs-server create my-docs-server
cd my-docs-server

# Option B: Clone manually
git clone https://github.com/mcp-x/mcp-docs-server.git my-docs-server
cd my-docs-server
npm install
```

### 2. Replace Documentation

```bash
# Remove demo docs
rm -rf docs/*

# Add your documentation structure
mkdir -p docs/guides docs/api docs/tutorials

# Copy your markdown files
cp -r /path/to/your/docs/* docs/
```

**Supported frontmatter:**
```yaml
---
title: Document Title
description: Brief description
tags: ["tag1", "tag2"]
section: guides  # optional, auto-detected from folder
---
```

### 3. Update Package Configuration

Edit `package.json`:
```json
{
  "name": "@your-org/your-docs-server",
  "description": "Your custom MCP documentation server",
  "author": "Your Name",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/your-docs-server.git"
  },
  "keywords": [
    "mcp",
    "documentation", 
    "your-domain"
  ]
}
```

### 4. Configure Server Settings

Edit `src/config.ts`:
```typescript
export const config = {
  name: '@your-org/your-docs-server',
  version: '1.0.0',
  description: 'Your custom documentation MCP server',
  docsPath: path.resolve(__dirname, '../docs'),
  
  // Customize search behavior
  search: {
    maxResults: 20,        // Default max search results
    fuzzyThreshold: 0.7    // Search sensitivity (0-1)
  },
  
  // Define your document sections
  sections: ['guides', 'api', 'tutorials', 'reference']
};
```

### 5. Customize Document Sections

The server automatically detects sections from your folder structure:
```
docs/
├── guides/           → section: "guides"
├── api/             → section: "api" 
├── tutorials/       → section: "tutorials"
└── reference/       → section: "reference"
```

Update the sections array in config to match your structure.

### 6. Build and Test

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Test locally
node dist/server.js
```

You should see:
```
🚀 Initializing Universal MCP Docs Server...
📁 Docs path resolved to: /path/to/your/docs
✅ MCP Server ready for STDIO communication
```

### 7. Test Tools Manually

You can test the MCP tools by sending JSON-RPC requests:

```bash
# List documents
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_documents","arguments":{}}}' | node dist/server.js

# Get specific document  
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_document","arguments":{"path":"guides/getting-started.md"}}}' | node dist/server.js

# Search documents
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"search_docs","arguments":{"query":"setup"}}}' | node dist/server.js
```

## Advanced Customization

### Custom Search Logic

Edit `src/lib/DocumentManager.ts` to customize search behavior:

```typescript
async searchDocuments(query: string, maxResults: number = 10): Promise<SearchResult[]> {
  // Add your custom search logic here
  // Examples:
  // - Fuzzy matching
  // - Semantic search with embeddings
  // - External search service integration
  // - Custom relevance scoring
}
```

### Additional Tools

Add new MCP tools by editing `src/server.ts`:

```typescript
// Add to ListToolsRequestSchema handler
{
  name: 'your_custom_tool',
  description: 'Description of your tool',
  inputSchema: {
    type: 'object',
    properties: {
      // Define your tool's parameters
    }
  }
}

// Add to CallToolRequestSchema handler
case 'your_custom_tool':
  return await this.handleYourCustomTool(request.params.arguments);
```

### Custom Document Processing

Extend the DocumentManager to handle different file types:

```typescript
// Add support for .json, .yaml, .txt files
private async processDocument(filePath: string): Promise<DocumentContent> {
  const ext = path.extname(filePath);
  
  switch (ext) {
    case '.md':
      return this.processMarkdown(filePath);
    case '.json':
      return this.processJson(filePath);
    case '.yaml':
      return this.processYaml(filePath);
    default:
      return this.processText(filePath);
  }
}
```

## Publishing Your Server

### 1. Update Package Details

Ensure your `package.json` has:
- Unique name under your organization
- Correct repository URL
- Proper keywords for discoverability

### 2. Build and Test

```bash
npm run build
npm test  # Add tests if needed
```

### 3. Publish to npm

```bash
# Login to npm (one-time setup)
npm login

# Publish your package
npm publish --access public
```

### 4. Test Installation

```bash
# Test your published package
npx @your-org/your-docs-server
```

## IDE Integration Examples

### Cursor Configuration

`.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "my-docs": {
      "command": "npx",
      "args": ["-y", "@your-org/your-docs-server"]
    }
  }
}
```

### VS Code Configuration

`.vscode/mcp.json`:
```json
{
  "mcpServers": {
    "my-docs": {
      "command": "npx",
      "args": ["-y", "@your-org/your-docs-server"]
    }
  }
}
```

### Claude Desktop Configuration

Add to your Claude Desktop config file:
```json
{
  "mcpServers": {
    "my-docs": {
      "command": "npx",
      "args": ["-y", "@your-org/your-docs-server"]
    }
  }
}
```

## Best Practices

### Documentation Structure
- Use clear, descriptive filenames
- Organize content into logical sections
- Include frontmatter with title and tags
- Keep documents focused and scannable

### Search Optimization
- Use descriptive titles and headings
- Include relevant keywords naturally
- Add tags for categorization
- Keep file sizes reasonable

### Performance
- Limit document size (< 100KB per file)
- Use caching for frequently accessed docs
- Implement lazy loading for large document sets
- Monitor memory usage with many documents

### Maintenance
- Version your documentation alongside code
- Set up automated testing
- Monitor server performance
- Keep dependencies updated

## Troubleshooting

### Build Issues
```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build
```

### Runtime Errors
- Check Node.js version (>= 18 required)
- Verify document paths and permissions
- Review server logs for specific errors
- Test with minimal document set first

### IDE Integration Problems
- Restart IDE after configuration changes
- Check configuration file syntax with JSON validator
- Verify server starts successfully when run manually
- Check IDE-specific MCP setup requirements

## Getting Help

- [GitHub Issues](https://github.com/mcp-x/mcp-docs-server/issues)
- [MCP Community Discord](https://discord.gg/mcp)
- [Example Implementations](https://github.com/mcp-x)

## Contributing

We welcome contributions to improve the template:
- Bug fixes and improvements
- Additional customization options
- Better documentation and examples
- Performance optimizations

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
