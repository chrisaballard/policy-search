import { PolicyPage } from "../model/policyPage";
import { ActionTypes } from './actionTypes';
import { SetStatusAction } from '.';
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

export const getPolicyPage = (id: string | string[], page: string | string[]) => async (dispatch: Dispatch) => {
  const data = await loadPolicyPage(id, page);
  dispatch<getPolicyPageAction>({
    type: ActionTypes.getPolicyPage,
    payload: data
  })
  dispatch<SetStatusAction>({
    type: ActionTypes.setStatus,
    payload: {
      processing: false
    }
  })
}

export const clearPolicyPage = () => (dispatch: Dispatch) => {
  dispatch<clearPolicyPageAction>({
    type: ActionTypes.clearPolicyPage,
    payload: initialState.policyPage
  })
}
