import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { SearchResult } from '../model/searchResult';

const searchResultReducer = (state: SearchResult = initialState.searchResult, action: Action) => { 
  return produce(state, (draft: SearchResult) => { 
    switch (action.type) {
      case ActionTypes.getSearchResult:
        const { searchQuery, metadata, resultsByDocument } = action.payload;
        draft.searchQuery = searchQuery;
        draft.resultsByDocument = [...draft.resultsByDocument, ...resultsByDocument]
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