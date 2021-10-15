import { ResultByDocument } from "./resultByDocument";

export interface SearchResult {
  searchQuery: string;
  endOfList: boolean;
  metadata: {
    numDocsReturned: number;
  }
  resultsByDocument: ResultByDocument[];
  
}