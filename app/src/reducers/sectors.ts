import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Sector } from '../model/sector';
import { Filters } from '../model/filters';

export const sectorsReducer = (state: Sector[] = initialState.sectors, action: Action) => {
  return produce(state, (draft: any) => { // TODO figure out the typing for this
    switch (action.type) {
      case ActionTypes.getSectors:
        return draft = action.payload;
      default:
        break;
    }
  })
}