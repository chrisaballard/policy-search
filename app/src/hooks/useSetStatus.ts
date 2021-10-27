import { useSelector, useDispatch } from 'react-redux';
import { setStatus } from '../actions';
import { State } from '../store/initialState'

const useSetStatus = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { status } = state;

  const setProcessing = (processing) => {
    const data = {
      processing
    }
    dispatch(setStatus(data));
  }
  
  return setProcessing;
}
export default useSetStatus;