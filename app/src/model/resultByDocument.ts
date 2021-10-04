import { ResultByPage } from "./resultByPage";

export interface ResultByDocument {
  countryCode: string;
  policyId: number;
  policyName: string;
  resultsByPage: ResultByPage[];
}