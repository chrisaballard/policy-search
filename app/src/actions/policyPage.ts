import { PolicyPage } from "../model/policyPage";
import { ActionTypes } from './actionTypes';
import { loadPolicyPage } from '../api';
import { Dispatch } from 'redux';
import initialState from "../store/initialState";

export interface getPolicyPageAction {
  type: ActionTypes.getPolicyPage;
  payload: PolicyPage;
}
export interface clearPolicyPageAction {
  type: ActionTypes.clearPolicyPage;
  payload: PolicyPage;
}

export const getPolicyPage = (id: number, page: number) => async (dispatch: Dispatch) => {
  const data = await loadPolicyPage(id, page);
  dispatch<getPolicyPageAction>({
    type: ActionTypes.getPolicyPage,
    payload: data
  })
}

export const clearPolicyPage = () => (dispatch: Dispatch) => {
  dispatch<getPolicyPageAction>({
    type: ActionTypes.getPolicyPage,
    payload: initialState.policyPage
  })
}
