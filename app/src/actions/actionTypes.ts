import { getSearchResultAction, clearSearchResultAction } from "./searchResult";
import { getPoliciesAction, getPolicyAction } from './policy';
// import { getGeographiesAction, geographyFiltersAction } from "./geographies";
import { getGeographiesAction } from "./geographies";
import { SetStatusAction } from "./status";
import { getPolicyPageAction, clearPolicyPageAction } from './policyPage';
import { getSectorsAction } from "./sectors";
import { getInstrumentsAction } from "./instruments";
import { filtersAction } from './filters';

export enum ActionTypes {
  getPolicies, // 0
  getSearchResult, // 1
  clearSearchResult, // 2
  getGeographies, // 3
  setStatus, // 4
  getPolicyPage, // 5
  clearPolicyPage, // 6
  getPolicy, // 7
  getSectors, // 8
  getInstruments, // 9
  setNewFilters // 10
}

export type Action = getPoliciesAction | getSearchResultAction | clearSearchResultAction | getGeographiesAction | SetStatusAction | getPolicyPageAction | clearPolicyPageAction | getPolicyAction | getSectorsAction | getInstrumentsAction | filtersAction;