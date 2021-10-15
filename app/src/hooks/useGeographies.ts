import { useSelector, useDispatch } from 'react-redux';
import { getGeographies, setGeoFilters } from '../actions';
import { State } from '../store/initialState';
import { Geography } from '../model/geography';

const useGeographies = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { filters: {geographyFilters} } = state;

  const setGeographies = () => {
    dispatch(getGeographies());
  }
  
  return setGeographies;
}
export default useGeographies;