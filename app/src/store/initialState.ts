import { Status } from "../model/status";
import { Policies } from "../model/policies";
import { SearchResult } from "../model/searchResult";
import { Geography } from "../model/geography";
import { Filters } from "../model/filters";
import { PolicyPage } from "../model/policyPage";

export interface State {
  status: Status;
  policies: Policies;
  searchResult: SearchResult;
  geographies: Geography[];
  filters: Filters;
  policyPage: PolicyPage;
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
  policyPage: {
    documentMetadata: {
      pageCount: 0
    },
    pageText: []
  }
}
export default initialState;