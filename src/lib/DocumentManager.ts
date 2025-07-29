import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface DocumentMetadata {
  title: string;
  path: string;
  section: string;
  filename: string;
  lastModified?: string;
  tags?: string[];
  description?: string;
}

export interface DocumentContent {
  path: string;
  content: string;
  metadata: DocumentMetadata;
  size: number;
}

export interface SearchResult {
  document: DocumentMetadata;
  relevanceScore: number;
  excerpts: string[];
}

export class DocumentManager {
  private docsPath: string;
  private documentsCache: Map<string, DocumentContent> = new Map();
  private metadataCache: DocumentMetadata[] = [];
  private lastScanTime: number = 0;

  constructor(docsPath: string) {
    this.docsPath = path.resolve(docsPath);
  }

  getDocsPath(): string {
    return this.docsPath;
  }

  async listDocuments(section: string = 'all'): Promise<DocumentMetadata[]> {
    await this.ensureDocumentsScanned();
    
    if (section === 'all') {
      return this.metadataCache;
    }
    
    return this.metadataCache.filter(doc => doc.section === section);
  }

  async getDocument(documentPath: string): Promise<DocumentContent> {
    await this.ensureDocumentsScanned();
    
    // Check cache first
    if (this.documentsCache.has(documentPath)) {
      return this.documentsCache.get(documentPath)!;
    }
    
    // Load document from filesystem
    const fullPath = path.join(this.docsPath, documentPath);
    
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const parsed = matter(content);
      const stats = await fs.stat(fullPath);
      
      const document: DocumentContent = {
        path: documentPath,
        content: parsed.content,
        metadata: {
          title: parsed.data.title || path.basename(documentPath, '.md'),
          path: documentPath,
          section: this.extractSection(documentPath),
          filename: path.basename(documentPath),
          lastModified: stats.mtime.toISOString(),
          tags: parsed.data.tags || [],
          description: parsed.data.description
        },
        size: content.length
      };
      
      // Cache the document
      this.documentsCache.set(documentPath, document);
      
      return document;
    } catch (error) {
      throw new Error(`Document not found: ${documentPath}`);
    }
  }

  async searchDocuments(query: string, maxResults: number = 10): Promise<SearchResult[]> {
    await this.ensureDocumentsScanned();
    
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();
    
    for (const metadata of this.metadataCache) {
      try {
        const document = await this.getDocument(metadata.path);
        const content = document.content.toLowerCase();
        const title = metadata.title.toLowerCase();
        
        // Simple relevance scoring
        let score = 0;
        let excerpts: string[] = [];
        
        // Title match (high weight)
        if (title.includes(queryLower)) {
          score += 10;
        }
        
        // Content matches
        const contentLines = document.content.split('\n');
        for (let i = 0; i < contentLines.length; i++) {
          const line = contentLines[i];
          const lineLower = line.toLowerCase();
          
          if (lineLower.includes(queryLower)) {
            score += 1;
            
            // Add excerpt (with context)
            const start = Math.max(0, i - 1);
            const end = Math.min(contentLines.length, i + 2);
            const excerpt = contentLines.slice(start, end).join('\n');
            excerpts.push(excerpt);
            
            if (excerpts.length >= 3) break; // Limit excerpts
          }
        }
        
        // Tags match
        if (metadata.tags) {
          for (const tag of metadata.tags) {
            if (tag.toLowerCase().includes(queryLower)) {
              score += 5;
            }
          }
        }
        
        if (score > 0) {
          results.push({
            document: metadata,
            relevanceScore: score,
            excerpts: excerpts.slice(0, 3) // Limit to 3 excerpts
          });
        }
        
      } catch (error) {
        // Skip documents that can't be loaded
        continue;
      }
    }
    
    // Sort by relevance and limit results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  private async ensureDocumentsScanned(): Promise<void> {
    const now = Date.now();
    // Rescan every 5 minutes or on first call
    if (now - this.lastScanTime > 5 * 60 * 1000 || this.metadataCache.length === 0) {
      await this.scanDocuments();
      this.lastScanTime = now;
    }
  }

  private async scanDocuments(): Promise<void> {
    this.metadataCache = [];
    this.documentsCache.clear();
    
    try {
      await this.scanDirectory(this.docsPath, '');
    } catch (error) {
      console.error('Error scanning documents:', error);
      // Create empty structure if docs don't exist
      this.metadataCache = [];
    }
  }

  private async scanDirectory(dirPath: string, relativePath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const entryRelativePath = path.join(relativePath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this.scanDirectory(fullPath, entryRelativePath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          // Process markdown files
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const parsed = matter(content);
            const stats = await fs.stat(fullPath);
            
            const metadata: DocumentMetadata = {
              title: parsed.data.title || this.formatTitle(entry.name),
              path: entryRelativePath,
              section: this.extractSection(entryRelativePath),
              filename: entry.name,
              lastModified: stats.mtime.toISOString(),
              tags: parsed.data.tags || [],
              description: parsed.data.description
            };
            
            this.metadataCache.push(metadata);
          } catch (error) {
            // Skip files that can't be parsed
            console.error(`Error processing ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }
  }

  private extractSection(filePath: string): string {
    const parts = filePath.split(path.sep);
    return parts.length > 1 ? parts[0] : 'root';
  }

  private formatTitle(filename: string): string {
    return filename
      .replace(/\.md$/, '')
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
