import { useDispatch } from 'react-redux';
import { getGeographies } from '../actions';

const useGeographies = () => {
  const dispatch = useDispatch();

  const setGeographies = () => {
    dispatch(getGeographies());
  }
  
  return setGeographies;
}
export default useGeographies;