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
export declare class DocumentManager {
    private docsPath;
    private documentsCache;
    private metadataCache;
    private lastScanTime;
    constructor(docsPath: string);
    getDocsPath(): string;
    listDocuments(section?: string): Promise<DocumentMetadata[]>;
    getDocument(documentPath: string): Promise<DocumentContent>;
    searchDocuments(query: string, maxResults?: number): Promise<SearchResult[]>;
    private ensureDocumentsScanned;
    private scanDocuments;
    private scanDirectory;
    private extractSection;
    private formatTitle;
}
