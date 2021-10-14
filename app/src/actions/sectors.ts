import { ActionTypes } from './actionTypes';
import { loadSectors } from '../api';
import { Dispatch } from 'redux';
import { Sector } from '../model/sector';

export interface getSectorsAction {
  type: ActionTypes.getSectors;
  payload: Sector[];
}
export interface sectorFiltersAction {
  type: ActionTypes.setSectorFilters;
  payload: Sector[];
}

export const getSectors = () => async (dispatch: Dispatch) => {
  const data = await loadSectors();
  dispatch<getSectorsAction>({
    type: ActionTypes.getSectors,
    payload: data
  })
}

export const setSectorFilters = (filters: Sector[]) => (dispatch: Dispatch) => {
  dispatch<sectorFiltersAction>({
    type: ActionTypes.setSectorFilters,
    payload: filters
  })
}