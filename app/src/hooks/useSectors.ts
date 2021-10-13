import { useSelector, useDispatch } from 'react-redux';
import { getSectors } from '../actions';
import { State } from '../store/initialState';

const useSectors = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { sectors } = state;
  const setSectors = () => {
    dispatch(getSectors());
  }

  
  
  return [ sectors, setSectors ] as const;
}
export default useSectors;