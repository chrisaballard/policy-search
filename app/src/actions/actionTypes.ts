import { getPoliciesAction, getSearchResultAction, clearSearchResultAction } from "./searchResults";
import { getGeographiesAction } from "./geographies";
import { SetStatusAction } from "./status";
import { geographyFiltersAction } from ".";

export enum ActionTypes {
  getPolicies,
  getSearchResult,
  clearSearchResult,
  getGeographies,
  setStatus,
  setGeographyFilters
}

export type Action = getPoliciesAction | getSearchResultAction | clearSearchResultAction | getGeographiesAction | SetStatusAction | geographyFiltersAction;