import { Status } from "../model/status";
import { Policies } from "../model/policies";
import { SearchResult } from "../model/searchResult";
import { Geography } from "../model/geography";
import { Filters } from "../model/filters";

export interface State {
  status: Status;
  policies: Policies;
  searchResult: SearchResult;
  geographies: Geography[];
  filters: Filters;
}

const initialState = {
  status: {
    processing: false
  },
  policies: {},
  searchResult: {
    metadata: {},
    resultsByDocument: []
  },
  geographies: [],
  filters: {
    geographyFilters: []
  },
}
export default initialState;