import { useSelector, useDispatch } from 'react-redux';
import { getGeographies, setGeoFilters } from '../actions';
import { State } from '../store/initialState';
import { Geography } from '../model/geography';

const useGetGeographies = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { geographies, filters: {geographyFilters} } = state;

  const setGeographies = () => {
    dispatch(getGeographies());
  }

  const setGeographyFilters = (filters: Geography[]) => {
    dispatch(setGeoFilters(filters))
  }
  
  return [geographies, geographyFilters, setGeographies, setGeographyFilters] as const;
}
export default useGetGeographies;