import { Status } from "../model/status";
import { Policies } from "../model/policies";
import { SearchResult } from "../model/searchResult";
import { Geography } from "../model/geography";
import { Filters } from "../model/filters";
import { PolicyPage } from "../model/policyPage";
import { Policy } from "../model/policy";

export interface State {
  status: Status;
  policies: Policies;
  policy: Policy;
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
  policy: {
    countryCode: '',
    language: '',
    policyId: null,
    policyName: '',
    policyTxtFile: '',
    policyType: '',
    sourceName: '',
    sourcePolicyId: null,
    url: '',
  },
  searchResult: {
    searchQuery: '',
    metadata: {
      numDocsReturned: 0
    },
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