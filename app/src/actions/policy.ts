import { Dispatch } from 'redux';
import { getPolicies, getPolicy } from '../api';
import { Policies } from '../model/policies';
import { SetStatusAction } from '.';
import { ActionTypes } from './actionTypes';
import { Policy } from '../model/policy';

export interface getPoliciesAction {
  type: ActionTypes.getPolicies;
  payload: Policies;
}

export interface getPolicyAction {
  type: ActionTypes.getPolicy;
  payload: Policy;
}

export const loadPolicies = (start?: number) => async (dispatch: Dispatch) => {
  dispatch<SetStatusAction>({
    type: ActionTypes.setStatus,
    payload: {
      processing: true
    }
  })
  const data = await getPolicies(start);
  dispatch<getPoliciesAction>({
    type: ActionTypes.getPolicies,
    payload: data
  })
  dispatch<SetStatusAction>({
    type: ActionTypes.setStatus,
    payload: {
      processing: false
    }
  })
}

export const loadPolicy = (id:  string | string[]) => async (dispatch: Dispatch) => {
  const data = await getPolicy(id);
  dispatch<getPolicyAction>({
    type: ActionTypes.getPolicy,
    payload: data
  })
}