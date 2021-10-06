import { ActionTypes } from './actionTypes';
import { Dispatch } from 'redux';
import { Status } from '../model/status'

export interface SetStatusAction {
  type: ActionTypes.setStatus;
  payload: Status;
}

export const setStatus = (status: Status) => {
  return (dispatch: Dispatch) => {
    dispatch<SetStatusAction>({
      type: ActionTypes.setStatus,
      payload: status
    })
  }
}