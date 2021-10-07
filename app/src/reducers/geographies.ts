import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Geography } from '../model/geography';
import { Filters } from '../model/filters';

export const geographiesReducer = (state: Geography[] = initialState.geographies, action: Action) => {
  return produce(state, (draft: any) => { // TODO figure out the typing for this
    switch (action.type) {
      case ActionTypes.getGeographies:
        return draft = action.payload;
      default:
        break;
    }
  })
}
export const geographyFiltersReducer = (state: Filters = initialState.filters, action: Action) => {
  return produce(state, (draft: any) => { // TODO figure out the typing for this
    switch (action.type) {
      case ActionTypes.setGeographyFilters:
        draft.geographyFilters = action.payload;
        break;
      default:
        break;
    }
  })
}
