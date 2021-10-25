import produce from 'immer';
import initialState from '../store/initialState';
import { Action, ActionTypes } from '../actions';
import { Filters } from '../model/filters';

const filtersReducer = (state: Filters = initialState.filters, action: Action) => {
  return produce(state, (draft: any) => {
    switch (action.type) {
      case ActionTypes.setNewFilters:
        return draft = action.payload;
      default:
        break;
    }
  })
}
export default filtersReducer;