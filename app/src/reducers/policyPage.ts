import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { PolicyPage } from '../model/policyPage';

const policyPageReducer = (state: PolicyPage = initialState.policyPage, action: Action) => { 
  return produce(state, (draft: PolicyPage) => { 
    switch (action.type) {
      case ActionTypes.getPolicyPage:
        return draft = action.payload;
      case ActionTypes.clearPolicyPage:
        return draft = action.payload;
      default:
        break;
    }
  })
}
export default policyPageReducer;