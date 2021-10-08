import { getPoliciesAction, getSearchResultAction, clearSearchResultAction } from "./searchResults";
import { getGeographiesAction } from "./geographies";
import { SetStatusAction } from "./status";
import { geographyFiltersAction } from ".";

export enum ActionTypes {
  getPolicies, // 0
  getSearchResult, // 1
  clearSearchResult, // 2
  getGeographies, // 3
  setStatus, // 4
  setGeographyFilters // 5
}

export type Action = getPoliciesAction | getSearchResultAction | clearSearchResultAction | getGeographiesAction | SetStatusAction | geographyFiltersAction;