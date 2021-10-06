import { Status } from "../model/status";
import { Policies } from "../model/policies";
import { SearchResult } from "../model/searchResult";
import { Geography } from "../model/geography";

export interface State {
  status: Status;
  policies: Policies;
  searchResult: SearchResult;
  geographies: Geography[];
  geographyFilters: Geography[];
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
  geographyFilters: []
}
export default initialState;