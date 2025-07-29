#!/usr/bin/env node

/**
 * Universal MCP Docs Server
 * Template for documentation-based MCP servers
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DocumentManager } from './lib/DocumentManager.js';
import { config } from './config.js';

class UniversalMcpDocsServer {
  private server: Server;
  private documentManager: DocumentManager;

  constructor() {
    this.documentManager = new DocumentManager(config.docsPath);
    
    this.server = new Server({
      name: config.name,
      version: config.version,
    }, {
      capabilities: {
        tools: {},
      },
    });

    this.setupTools();
  }

  private setupTools() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_documents',
            description: 'List all available documents in the documentation',
            inputSchema: {
              type: 'object',
              properties: {
                section: {
                  type: 'string',
                  description: 'Filter by section (optional)',
                  enum: ['guides', 'api', 'tutorials', 'reference', 'all']
                }
              }
            }
          },
          {
            name: 'get_document',
            description: 'Get the full content of a specific document',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to the document (e.g., "guides/getting-started.md")'
                }
              },
              required: ['path']
            }
          },
          {
            name: 'search_docs',
            description: 'Search through all documentation',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query'
                },
                maxResults: {
                  type: 'number',
                  description: 'Maximum number of results (default: 10)',
                  default: 10
                }
              },
              required: ['query']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'list_documents':
            return await this.handleListDocuments(request.params.arguments);
          
          case 'get_document':
            return await this.handleGetDocument(request.params.arguments);
          
          case 'search_docs':
            return await this.handleSearchDocs(request.params.arguments);
          
          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true,
        };
      }
    });
  }

  private async handleListDocuments(args: any) {
    const section = args?.section || 'all';
    const documents = await this.documentManager.listDocuments(section);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            documents,
            total: documents.length,
            section
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetDocument(args: any) {
    if (!args?.path) {
      throw new Error('Document path is required');
    }

    const document = await this.documentManager.getDocument(args.path);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(document, null, 2)
        }
      ]
    };
  }

  private async handleSearchDocs(args: any) {
    if (!args?.query) {
      throw new Error('Search query is required');
    }

    const maxResults = args.maxResults || 10;
    const results = await this.documentManager.searchDocuments(args.query, maxResults);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            results,
            query: args.query,
            total: results.length
          }, null, 2)
        }
      ]
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    console.error('🚀 Initializing Universal MCP Docs Server...');
    console.error(`📁 Docs path resolved to: ${this.documentManager.getDocsPath()}`);
    console.error('✅ MCP Server ready for STDIO communication');
    
    await this.server.connect(transport);
  }
}

// Start the server
const server = new UniversalMcpDocsServer();
server.start().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
