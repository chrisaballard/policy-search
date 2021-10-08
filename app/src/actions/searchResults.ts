import { searchQuery } from '../api';
import { Dispatch } from 'redux' // hit cmd click to see type definition file
import { SearchResult } from '../model/searchResult';
import { Policies } from '../model/policies';
import { setStatus } from './';
import { SetStatusAction } from '.';
import { ActionTypes } from './actionTypes';

export interface getSearchResultAction {
  type: ActionTypes.getSearchResult;
  payload: SearchResult;
}

export interface clearSearchResultAction {
  type: ActionTypes.clearSearchResult;
  payload: SearchResult;
}


export interface getPoliciesAction {
  type: ActionTypes.getPolicies;
  payload: Policies;
}

export const getSearchResult = (queryString: string) => async (dispatch: Dispatch) => {
  const data = await searchQuery(queryString);
  dispatch<getSearchResultAction>({
    type: ActionTypes.getSearchResult,
    payload: data
  })
  dispatch<SetStatusAction>({
    type: ActionTypes.setStatus,
    payload: {
      processing: false
    }
  })
}

export const clearSearchResult = () => (dispatch: Dispatch) => {
  dispatch<clearSearchResultAction>({
    type: ActionTypes.clearSearchResult,
    payload: {
      metadata: {},
      resultsByDocument: []
    }
  })
}