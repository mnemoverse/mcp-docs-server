import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const config = {
    name: '@mcp-x/mcp-docs-server',
    version: '1.0.0',
    description: 'Universal MCP Server Demo - Template for documentation-based MCP servers',
    docsPath: path.resolve(__dirname, '../docs'),
    // Search configuration
    search: {
        maxResults: 50,
        fuzzyThreshold: 0.6
    },
    // Document sections
    sections: ['guides', 'api', 'tutorials', 'reference', 'examples']
};
//# sourceMappingURL=config.js.map