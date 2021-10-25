import { Filters } from '../model/filters';
import { ActionTypes } from './actionTypes';
import { Dispatch } from 'redux'
import initialState from '../store/initialState';

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

export const clearFilters = () => (dispatch: Dispatch) => {
  dispatch<filtersAction>({
    type: ActionTypes.setNewFilters,
    payload: initialState.filters
  })
}