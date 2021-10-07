import { getPoliciesAction, getSearchResultAction, clearSearchResultAction } from "./searchResults";
import { getGeographiesAction, geographyFiltersAction } from "./geographies";
import { SetStatusAction } from "./status";
import { getPolicyPageAction, clearPolicyPageActoin } from './policyPage';

export enum ActionTypes {
  getPolicies, // 0
  getSearchResult, // 1
  clearSearchResult, // 2
  getGeographies, // 3
  setStatus, // 4
  setGeographyFilters, // 5
  getPolicyPage, // 6
  clearPolicyPage // 7
}

export type Action = getPoliciesAction | getSearchResultAction | clearSearchResultAction | getGeographiesAction | SetStatusAction | geographyFiltersAction | getPolicyPageAction | clearPolicyPageAction;