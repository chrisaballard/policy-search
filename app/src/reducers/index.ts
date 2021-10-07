import { combineReducers } from 'redux';
import { Status } from '../model/status';
import { SearchResult } from '../model/searchResult';
import { Geography } from '../model/geography';
import searchResultReducer from './searchResult';
import { geographiesReducer, geographyFiltersReducer } from './geographies';
import statusReducer from './status';
import { Filters } from '../model/filters';

// interface of entire redux store
export interface StoreState {
  status: Status,
  searchResult: SearchResult;
  geographies: Geography[];
  filters: Filters
}
export default combineReducers<StoreState>({
  status: statusReducer,
  searchResult: searchResultReducer,
  geographies: geographiesReducer,
  filters: geographyFiltersReducer,
});