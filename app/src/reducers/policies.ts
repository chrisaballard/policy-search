import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Policy } from '../model/policy';

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
