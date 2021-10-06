import { useSelector, useDispatch } from 'react-redux';
import { getGeographies } from '../actions';
import { State } from '../store/initialState'

const useGetGeographies = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { geographies } = state;

  const setGeographies = () => {
    dispatch(getGeographies());
  }
  
  return [geographies, setGeographies] as const;
}
export default useGetGeographies;