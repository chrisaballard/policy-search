import { ResultByDocument } from "./resultByDocument";

export interface SearchResult {
  searchQuery: string;
  metadata: {
    numDocsReturned: number;
  }
  resultsByDocument: ResultByDocument[];
  
}