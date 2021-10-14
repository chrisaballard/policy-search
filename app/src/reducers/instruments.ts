import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Instrument } from '../model/instrument';

const instrumentsReducer = (state: Instrument[] = initialState.instruments, action: Action) => {
  return produce(state, (draft: any) => { // TODO figure out the typing for this
    switch (action.type) {
      case ActionTypes.getInstruments:
        return draft = action.payload;
      default:
        break;
    }
  })
}
export default instrumentsReducer;