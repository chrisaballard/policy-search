import { useSelector, useDispatch } from 'react-redux';
import { getInstruments } from '../actions';
import { State } from '../store/initialState';

const useInstruments = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { instrumentList } = state;
  const setInstruments = () => {
    dispatch(getInstruments());
  }

  return setInstruments;
}
export default useInstruments;