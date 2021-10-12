import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Status } from '../model/status';

const statusReducer = (state: Status = initialState.status, action: Action) => {
  return produce(state, (draft: any) => { // TODO figure out the typing for this
    switch (action.type) {
      case ActionTypes.setStatus:
        return draft = action.payload;
      default:
        break;
    }
  })
}
export default statusReducer;