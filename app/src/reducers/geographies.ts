import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Geography } from '../model/geography';

const geographiesReducer = (state: Geography[] = initialState.geographyList, action: Action) => {
  return produce(state, (draft: any) => { // TODO figure out the typing for this
    switch (action.type) {
      case ActionTypes.getGeographies:
        return draft = action.payload;
      default:
        break;
    }
  })
}

export default geographiesReducer;
