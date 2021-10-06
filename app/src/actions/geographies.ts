import { Geography } from '../model/geography';
import { ActionTypes } from './actionTypes';
import { loadGeographies } from '../api';
import { Dispatch } from 'redux'

export interface getGeographiesAction {
  type: ActionTypes.getGeographies;
  payload: Geography[];
}
export interface geographyFiltersAction {
  type: ActionTypes.setGeographyFilters;
  payload: Geography[];
}

export const getGeographies = () => async (dispatch: Dispatch) => {
  const data = await loadGeographies();
  dispatch<getGeographiesAction>({
    type: ActionTypes.getGeographies,
    payload: data
  })
}
export const setGeoFilters = (filters: Geography[]) => (dispatch: Dispatch) => {
  dispatch<geographyFiltersAction>({
    type: ActionTypes.setGeographyFilters,
    payload: filters
  })
}