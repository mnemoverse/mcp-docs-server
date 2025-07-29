# Contributing to MCP Docs Demo

Thank you for your interest in contributing to the MCP Docs Demo template! This project aims to provide a universal template for creating documentation-based MCP servers.

## 🎯 Project Goals

- **Universal template** - Works for any documentation project
- **Production ready** - Reliable, tested, and well-documented
- **Developer friendly** - Easy to understand, customize, and extend
- **Cross-platform** - Compatible with all major MCP clients (Cursor, VS Code, Claude Desktop, etc.)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/mnemoverse/mcp-docs-server.git
   cd mcp-docs-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Test your changes**
   ```bash
   npm test
   npm run build
   node dist/server.js
   ```

## 📝 How to Contribute

### Bug Reports

When reporting bugs, please include:

- **Environment details** (Node.js version, OS, IDE)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Error messages** (if any)
- **Sample documentation** that triggers the issue

### Feature Requests

Before proposing new features:

1. Check if it aligns with project goals
2. Search existing issues to avoid duplicates
3. Provide detailed use cases and examples
4. Consider backward compatibility

### Pull Requests

#### Before submitting:

- [ ] Fork the repository and create a feature branch
- [ ] Write clear, concise commit messages
- [ ] Add tests for new functionality
- [ ] Update documentation if needed
- [ ] Ensure all tests pass
- [ ] Verify the build succeeds

#### PR Guidelines:

1. **Branch naming**: `feature/description` or `fix/description`
2. **Commit messages**: Use conventional commits format
   ```
   feat: add support for custom file extensions
   fix: resolve path resolution on Windows
   docs: update installation instructions
   ```
3. **Description**: Explain what changes you made and why
4. **Testing**: Include instructions for testing your changes

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Add unit tests for new functions
- Add integration tests for MCP tool functionality
- Test edge cases and error conditions
- Use descriptive test names

Example:
```typescript
describe('DocumentManager', () => {
  it('should list documents in specified section', async () => {
    // Test implementation
  });
});
```

## 📁 Project Structure

```
mcp-docs-server/
├── src/
│   ├── server.ts          # Main MCP server
│   ├── config.ts          # Configuration
│   └── lib/
│       └── DocumentManager.ts  # Document handling
├── docs/                  # Demo documentation
├── scripts/               # Build and utility scripts
├── tests/                 # Test files
└── dist/                  # Built output
```

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### MCP Best Practices

- Keep tool schemas simple and well-documented
- Handle errors gracefully and return meaningful messages
- Use consistent naming for tools and parameters
- Test with multiple MCP clients

### Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for complex functions
- Include examples in documentation
- Keep TEMPLATE.md up to date

## 🤝 Community Guidelines

### Be Respectful

- Use inclusive language
- Be patient with newcomers
- Provide constructive feedback
- Help others learn and grow

### Communication

- **Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Discord**: [Join our community](https://discord.gg/mnemoverse) for real-time chat

## 🏷️ Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md` with new features and fixes
3. Create release PR
4. Tag release after merge
5. Publish to npm

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

- Check existing [Issues](https://github.com/mnemoverse/mcp-docs-server/issues)
- Start a [Discussion](https://github.com/mnemoverse/mcp-docs-server/discussions)
- Join our [Discord community](https://discord.gg/mnemoverse)

---

**Thank you for helping make MCP development easier for everyone! 🚀**
