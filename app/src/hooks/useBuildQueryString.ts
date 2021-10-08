import { useSelector } from 'react-redux';
import { State } from '../store/initialState';

const useBuildQueryString = () => {
  const state = useSelector((state: State ) => state)
  const { filters } = state;

  const buildQueryString = (query: string) => {
    let str = `query=${query}`
    // should go through each set of filters when we have them
    // for now, only geography
    if(filters.geographyFilters.length) {
      filters.geographyFilters.forEach((item) => {
        str += `&geography=${item.code}`
      })
    }
    return str;
    
  }

  return [ buildQueryString ] as const;
}


export default useBuildQueryString;
