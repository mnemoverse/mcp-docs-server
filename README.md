# @mcp-x/mcp-docs-server

Universal MCP Server Demo - Template for creating documentation-based MCP servers

## 🎯 What is this?

This is a **universal template** for creating MCP (Model Context Protocol) servers that provide AI agents with access to documentation. It's designed to be:

- **Easy to customize** - replace docs, update configuration, publish your own
- **Production ready** - includes TypeScript, testing, and proper npm packaging  
- **Cross-platform** - works with Cursor, VS Code, Claude Desktop, Windsurf
- **Documented** - comprehensive examples and setup guides

## 🚀 Quick Start

### Use as template:
```bash
npx @mcp-x/mcp-docs-server create my-docs-server
cd my-docs-server
npm install
npm run build
npx your-package-name  # Test your server
```

### Test the demo:
```bash
npx @mcp-x/mcp-docs-server
# ✅ MCP Server ready for STDIO communication
```

## 📁 What's included

- **Universal MCP server** - STDIO protocol implementation
- **Document management** - markdown parsing with frontmatter
- **Search capabilities** - basic text search across documents  
- **IDE configurations** - ready-to-use configs for popular IDEs
- **TypeScript setup** - full development environment
- **Testing framework** - Jest tests included
- **Publishing guide** - npm package publication

## 🛠️ Customization

### 1. Replace documentation
```bash
# Remove demo docs
rm -rf docs/*

# Add your markdown files
cp -r /path/to/your/docs/* docs/

# Update package.json name and description
```

### 2. Configure server
```typescript
// src/config.ts
export const config = {
  name: "your-docs-server",
  description: "Your documentation MCP server",
  docsPath: "./docs"
};
```

### 3. Build and test
```bash
npm run build
node dist/server.js
```

## 🔧 IDE Integration

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

### Claude Desktop
Add to config file:
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

## 📚 Available Tools

### `list_documents`
List all available documents
```
Input: { section?: "guides" | "api" | "all" }
Output: Array of document metadata
```

### `get_document` 
Get full document content
```
Input: { path: "guides/getting-started.md" }
Output: { content: string, metadata: object }
```

### `search_docs`
Search across all documentation
```
Input: { query: string, maxResults?: number }
Output: Array of search results with relevance scores
```

## 🏗️ Architecture

```
MCP Client (AI Agent)
    ↓ JSON-RPC over STDIO
MCP Server (Node.js)
    ↓
Document Manager
    ↓
File System (markdown files)
```

**Key Components:**
- **STDIO Transport** - communication with AI agents
- **Document Parser** - markdown + frontmatter processing
- **Search Engine** - text-based search with relevance scoring
- **Tool Registry** - MCP tool definitions and handlers

## 🧪 Development

```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Test built version
node dist/server.js
```

## 📦 Publishing Your Server

1. **Update package.json**
   ```json
   {
     "name": "@your-org/your-docs-server",
     "description": "Your custom documentation server"
   }
   ```

2. **Build and test**
   ```bash
   npm run build
   npm test
   ```

3. **Publish to npm**
   ```bash
   npm login
   npm publish --access public
   ```

4. **Test installation**
   ```bash
   npx @your-org/your-docs-server
   ```

## 🤝 Contributing

This template is maintained by the MCP-X organization. Contributions welcome!

- Report bugs: [GitHub Issues](https://github.com/mnemoverse/mcp-docs-server/issues)
- Feature requests: [Discussions](https://github.com/mnemoverse/mcp-docs-server/discussions)
- Pull requests: Follow our [Contributing Guide](CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Related Projects

- **[@mnemoverse/mcp-docs-server](https://www.npmjs.com/package/@mnemoverse/mcp-docs-server)** - Production server powering Mnemoverse docs
- **[MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - Official TypeScript SDK
- **[MCP Specification](https://spec.modelcontextprotocol.io/)** - Protocol documentation

---

**Made with ❤️ by the MCP-X for Mnemoverse and community**
