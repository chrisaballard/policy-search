import { ResultByDocument } from "./resultByDocument";

export interface searchResult {
  metadata: object; // todo make model for this object
  resultsByDocument: ResultByDocument[];
  
}