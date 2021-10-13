import { getSearchResultAction, clearSearchResultAction } from "./searchResult";
import { getPoliciesAction, getPolicyAction } from './policy';
import { getGeographiesAction, geographyFiltersAction } from "./geographies";
import { SetStatusAction } from "./status";
import { getPolicyPageAction, clearPolicyPageAction } from './policyPage';
import { getSectorsAction } from "./sectors";
import { getInstrumentsAction } from "./instruments";

export enum ActionTypes {
  getPolicies, // 0
  getSearchResult, // 1
  clearSearchResult, // 2
  getGeographies, // 3
  setStatus, // 4
  setGeographyFilters, // 5
  getPolicyPage, // 6
  clearPolicyPage, // 7
  getPolicy, // 8
  getSectors, // 9
  getInstruments, // 10
}

export type Action = getPoliciesAction | getSearchResultAction | clearSearchResultAction | getGeographiesAction | SetStatusAction | geographyFiltersAction | getPolicyPageAction | clearPolicyPageAction | getPolicyAction | getSectorsAction | getInstrumentsAction;