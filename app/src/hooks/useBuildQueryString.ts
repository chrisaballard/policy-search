import { useSelector } from 'react-redux';
import { State } from '../store/initialState';

const useBuildQueryString = () => {
  const state = useSelector((state: State ) => state)
  const { filters, searchResult } = state;
  const { searchQuery } = searchResult;

  const buildQueryString = (query?: string) => {
    let str = query ? `query=${query}` : `query=${searchQuery}`
    // should go through each set of filters when we have them
    // for now, only geography
    if(filters.geographyFilters.length) {
      filters.geographyFilters.forEach((item) => {
        str += `&geography=${item.code}`
      })
    }
    return str;
    
  }

  return buildQueryString;
}


export default useBuildQueryString;
