import { ActionTypes } from './actionTypes';
import { loadInstruments } from '../api';
import { Dispatch } from 'redux';
import { Instrument } from '../model/instrument';

export interface getInstrumentsAction {
  type: ActionTypes.getInstruments;
  payload: Instrument[];
}

export const getInstruments = () => async (dispatch: Dispatch) => {
  const data = await loadInstruments();
  dispatch<getInstrumentsAction>({
    type: ActionTypes.getInstruments,
    payload: data
  })
}
