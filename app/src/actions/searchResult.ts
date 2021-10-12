import { searchQuery } from '../api';
import { API_BASE_URL } from '../constants';
import { Dispatch } from 'redux' // hit cmd click to see type definition file
import { SearchResult } from '../model/searchResult';
import { SetStatusAction } from '.';
import { ActionTypes } from './actionTypes';
import initialState from '../store/initialState';
import { getParameterByName } from '../helpers/queryString';

export interface getSearchResultAction {
  type: ActionTypes.getSearchResult;
  payload: SearchResult;
}

export interface clearSearchResultAction {
  type: ActionTypes.clearSearchResult;
  payload: SearchResult;
}

export const getSearchResult = (queryString: string) => async (dispatch: Dispatch) => {
  const searchTerms = getParameterByName('query', `${API_BASE_URL}/?${queryString}`)
  const data = await searchQuery(queryString);
  dispatch<getSearchResultAction>({
    type: ActionTypes.getSearchResult,
    payload: {...data, searchQuery: searchTerms}
  })
  dispatch<SetStatusAction>({
    type: ActionTypes.setStatus,
    payload: {
      processing: false
    }
  })
}

export const clearSearchResult = () => (dispatch: Dispatch, getState) => {
  const currSearch = getState().searchResult;
  const { searchQuery } = currSearch;
  const emptyResult = {
    searchQuery: searchQuery,
    metadata: {
      numDocsReturned: 0
    },
    resultsByDocument: []
  };

  dispatch<clearSearchResultAction>({
    type: ActionTypes.clearSearchResult,
    payload: emptyResult
  })
}