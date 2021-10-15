import { combineReducers } from 'redux';
import searchResultReducer from './searchResult';
import geographiesReducer from './geographies';
import policyPageReducer from './policyPage';
import statusReducer from './status';
import sectorsReducer from './sectors';
import instrumentsReducer from './instruments';
import filtersReducer from './filters';
import { Status } from '../model/status';
import { SearchResult } from '../model/searchResult';
import { Geography } from '../model/geography';
import { Filters } from '../model/filters';
import { PolicyPage } from '../model/policyPage';
import { Policy } from '../model/policy';
import { policyReducer } from './policies';
import { Sector } from '../model/sector';
import { Instrument } from '../model/instrument';

// interface of entire redux store
export interface StoreState {
  status: Status,
  searchResult: SearchResult;
  geographyList: Geography[];
  sectorList: Sector[];
  instrumentList: Instrument[];
  filters: Filters,
  policyPage: PolicyPage;
  policy: Policy;
}
export default combineReducers<StoreState>({
  status: statusReducer,
  searchResult: searchResultReducer,
  geographyList: geographiesReducer,
  sectorList: sectorsReducer,
  instrumentList: instrumentsReducer,
  filters: filtersReducer,
  policyPage: policyPageReducer,
  policy: policyReducer,
});