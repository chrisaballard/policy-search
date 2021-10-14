import { ActionTypes } from './actionTypes';
import { loadInstruments } from '../api';
import { Dispatch } from 'redux';
import { Instrument } from '../model/instrument';

export interface getInstrumentsAction {
  type: ActionTypes.getInstruments;
  payload: Instrument[];
}
export interface instrumentFiltersAction {
  type: ActionTypes.setInstrumentFilters;
  payload: Instrument[];
}

export const getInstruments = () => async (dispatch: Dispatch) => {
  const data = await loadInstruments();
  dispatch<getInstrumentsAction>({
    type: ActionTypes.getInstruments,
    payload: data
  })
}

export const setSectorFilters = (filters: Instrument[]) => (dispatch: Dispatch) => {
  dispatch<instrumentFiltersAction>({
    type: ActionTypes.setInstrumentFilters,
    payload: filters
  })
}