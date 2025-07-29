# MCP Docs Server Template

This is a template generated from `@mcp-x/mcp-docs-server`.

## What's Included

- **Universal MCP server** - STDIO protocol implementation
- **Document management** - Markdown parsing with frontmatter support
- **Search functionality** - Text-based search across all documents
- **TypeScript setup** - Full development environment
- **IDE configurations** - Ready-to-use configs for popular IDEs

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your Documentation
```bash
# Remove demo docs
rm -rf docs/*

# Add your markdown files
mkdir -p docs/guides docs/api
# Copy your documentation here
```

### 3. Configure the Server

Edit `src/config.ts`:
```typescript
export const config = {
  name: 'your-package-name',
  description: 'Your documentation server',
  // ... customize other settings
};
```

### 4. Update Package Details

Edit `package.json`:
```json
{
  "name": "@your-org/your-docs-server",
  "description": "Your custom MCP documentation server"
}
```

### 5. Build and Test
```bash
npm run build
node dist/server.js
```

### 6. Publish
```bash
npm login
npm publish --access public
```

## Documentation Structure

Organize your docs like this:
```
docs/
├── guides/
│   ├── getting-started.md
│   └── configuration.md
├── api/
│   └── reference.md
└── tutorials/
    └── first-steps.md
```

## Frontmatter Format

Use YAML frontmatter in your markdown files:
```yaml
---
title: Document Title
description: Brief description
tags: ["guide", "setup"]
---

# Your Content Here
```

## IDE Integration

### Cursor
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "your-docs": {
      "command": "npx",
      "args": ["-y", "@your-org/your-docs-server"]
    }
  }
}
```

### VS Code  
Add to `.vscode/mcp.json`:
```json
{
  "mcpServers": {
    "your-docs": {
      "command": "npx",
      "args": ["-y", "@your-org/your-docs-server"]
    }
  }
}
```

## Available Commands

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests
- `npm start` - Start the built server

## Customization

See the original [Customization Guide](https://github.com/mnemoverse/mcp-docs-server/blob/main/docs/guides/customization.md) for detailed instructions on:

- Adding custom MCP tools
- Modifying search behavior
- Supporting additional file types
- Performance optimization

## Help & Support

- [MCP Docs Demo Repository](https://github.com/mnemoverse/mcp-docs-server)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [GitHub Issues](https://github.com/mnemoverse/mcp-docs-server/issues)

---

**Generated from @mcp-x/mcp-docs-server template**
