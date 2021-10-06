import { getPoliciesAction, getSearchResultAction, clearSearchResultAction } from "./searchResults";
import { getGeographiesAction } from "./geographies";
import { SetStatusAction } from "./status";

export enum ActionTypes {
  getPolicies,
  getSearchResult,
  clearSearchResult,
  getGeographies,
  setStatus
}

export type Action = getPoliciesAction | getSearchResultAction | clearSearchResultAction | getGeographiesAction | SetStatusAction;