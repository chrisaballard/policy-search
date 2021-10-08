import { ResultByDocument } from "./resultByDocument";

export interface SearchResult {
  metadata: {
    numDocsReturned: number;
  }
  resultsByDocument: ResultByDocument[];
  
}