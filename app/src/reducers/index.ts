import { combineReducers } from 'redux';
import { Status } from '../model/status';
import { SearchResult } from '../model/searchResult';
import { Geography } from '../model/geography';
import searchResultReducer from './searchResult';
import { geographiesReducer, geographyFiltersReducer } from './geographies';
import policyPageReducer from './policyPage';
import statusReducer from './status';
import { Filters } from '../model/filters';
import { PolicyPage } from '../model/policyPage';

// interface of entire redux store
export interface StoreState {
  status: Status,
  searchResult: SearchResult;
  geographies: Geography[];
  filters: Filters,
  policyPage: PolicyPage;
}
export default combineReducers<StoreState>({
  status: statusReducer,
  searchResult: searchResultReducer,
  geographies: geographiesReducer,
  filters: geographyFiltersReducer,
  policyPage: policyPageReducer
});