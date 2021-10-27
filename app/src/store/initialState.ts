import { Status } from "../model/status";
import { Policies } from "../model/policies";
import { SearchResult } from "../model/searchResult";
import { Geography } from "../model/geography";
import { Filters } from "../model/filters";
import { PolicyPage } from "../model/policyPage";
import { Policy } from "../model/policy";
import { Sector } from "../model/sector";
import { Instrument } from "../model/instrument";

export interface State {
  status: Status;
  policies: Policies;
  policy: Policy;
  searchResult: SearchResult;
  geographyList: Geography[];
  sectorList: Sector[];
  instrumentList: Instrument[];
  filters: Filters;
  policyPage: PolicyPage;
}

const initialState = {
  status: {
    processing: false
  },
  policies: {
    count: 0,
    last_key: 0,
    policies: []
  },
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
    endOfList: true,
    metadata: {
      numDocsReturned: 0
    },
    resultsByDocument: []
  },
  geographyList: [],
  sectorList: [],
  instrumentList: [],
  filters: {
    geographyFilters: [],
    sectorFilters: [],
    instrumentFilters: [],
    yearFilters: {
      min: 1947,
      max: 2021
    }
  },
  policyPage: {
    documentMetadata: {
      pageCount: 0
    },
    pageText: []
  }
}
export default initialState;