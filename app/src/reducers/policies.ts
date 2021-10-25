import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Policy } from '../model/policy';
import { Policies } from '../model/policies';

export const policyReducer = (state: Policy = initialState.policy, action: Action) => { 
  return produce(state, (draft: Policy) => { 
    switch (action.type) {
      case ActionTypes.getPolicy:
        return draft = action.payload;
      default:
        break;
    }
  })
}

export const policiesReducer = (state: Policies = initialState.policies, action: Action) => { 
  return produce(state, (draft: Policies) => { 
    switch (action.type) {
      case ActionTypes.getPolicies:
        return draft = action.payload;
      default:
        break;
    }
  })
}
