import { ActionTypes } from './actionTypes';
import { loadInstruments } from '../api';
import { Dispatch } from 'redux';
import { Sector } from '../model/sector';

export interface getInstrumentsAction {
  type: ActionTypes.getInstruments;
  payload: Sector[];
}

export const getInstruments = () => async (dispatch: Dispatch) => {
  const data = await loadInstruments();
  dispatch<getInstrumentsAction>({
    type: ActionTypes.getInstruments,
    payload: data
  })
}