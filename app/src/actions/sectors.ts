import { ActionTypes } from './actionTypes';
import { loadSectors } from '../api';
import { Dispatch } from 'redux';
import { Sector } from '../model/sector';

export interface getSectorsAction {
  type: ActionTypes.getSectors;
  payload: Sector[];
}

export const getSectors = () => async (dispatch: Dispatch) => {
  const data = await loadSectors();
  dispatch<getSectorsAction>({
    type: ActionTypes.getSectors,
    payload: data
  })
}
