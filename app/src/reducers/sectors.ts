import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Sector } from '../model/sector';

const sectorsReducer = (state: Sector[] = initialState.sectorList, action: Action) => {
  return produce(state, (draft: any) => { // TODO figure out the typing for this
    switch (action.type) {
      case ActionTypes.getSectors:
        return draft = action.payload;
      default:
        break;
    }
  })
}
export default sectorsReducer;