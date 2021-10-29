import { multipleIds, searchQuery } from '../api';
import { API_BASE_URL, PER_PAGE } from '../constants';
import { Dispatch } from 'redux' // hit cmd click to see type definition file
import { SearchResult } from '../model/searchResult';
import { SetStatusAction } from '.';
import { ActionTypes } from './actionTypes';
import { getParameterByName } from '../helpers/queryString';

export interface getSearchResultAction {
  type: ActionTypes.getSearchResult;
  payload: SearchResult;
}

export interface clearSearchResultAction {
  type: ActionTypes.clearSearchResult;
  payload: SearchResult;
}

export const getSearchResult = (queryString: string) => async (dispatch: Dispatch, getState) => {
  const searchTerms = getParameterByName('query', `${API_BASE_URL}/?${queryString}`)

  const data = await searchQuery(queryString);
  const endOfList = data.resultsByDocument.length < PER_PAGE;
  dispatch<getSearchResultAction>({
    type: ActionTypes.getSearchResult,
    payload: {...data, searchQuery: searchTerms, endOfList}
  })
  dispatch<SetStatusAction>({
    type: ActionTypes.setStatus,
    payload: {
      processing: false
    }
  })
}

export const getMultipleById = (queryString: string) => async (dispatch: Dispatch, getState) => {
  
  const data = await multipleIds(queryString);
  let docs = [];
  if(data?.resultsByDocument?.length) {
    docs = data.resultsByDocument;
  }
  const endOfList = docs.length < PER_PAGE;

  dispatch<getSearchResultAction>({
    type: ActionTypes.getSearchResult,
    payload: {...data, searchQuery: '', endOfList}
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
    searchQuery: '',
    endOfList: true,
    metadata: {
      numDocsReturned: 0
    },
    resultsByDocument: []
  };

  dispatch<clearSearchResultAction>({
    type: ActionTypes.clearSearchResult,
    payload: emptyResult,
  })
}