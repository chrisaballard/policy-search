import { ResultByPage } from "./resultByPage";

export interface ResultByDocument {
  resultsByPage: ResultByPage[];
  countryCode: string;
  language: string;
  policyId: number;
  policyName: string;
  policyTxtFile: any;
  policyType: string;
  sourceName: string;
  sourcePolicyId: number;
  url: string;
}