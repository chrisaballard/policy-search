import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { SearchResult } from '../model/searchResult';

const searchResultReducer = (state: SearchResult = initialState.searchResult, action: Action) => { 
  return produce(state, (draft: SearchResult) => { 
    switch (action.type) {
      case ActionTypes.getSearchResult:
        const { searchQuery, metadata, resultsByDocument, endOfList } = action.payload;
        let docs = resultsByDocument;
        draft.searchQuery = searchQuery;
        draft.endOfList = endOfList;
        if(!resultsByDocument) {
          docs = [];
        }
        draft.resultsByDocument = [...draft.resultsByDocument, ...docs]
        draft.metadata = metadata;
        break;
      case ActionTypes.clearSearchResult:
        return draft = action.payload;
      default:
        break;
    }
  })
}
export default searchResultReducer;