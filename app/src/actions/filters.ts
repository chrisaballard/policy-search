import { Filters } from '../model/filters';
import { ActionTypes } from './actionTypes';
import { Dispatch } from 'redux'

export interface filtersAction {
  type: ActionTypes.setNewFilters;
  payload: Filters;
}

export const setFilters = (filters: Filters) => (dispatch: Dispatch) => {
  dispatch<filtersAction>({
    type: ActionTypes.setNewFilters,
    payload: filters
  })
}