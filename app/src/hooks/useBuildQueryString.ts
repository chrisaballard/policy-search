import { useSelector } from 'react-redux';
import { State } from '../store/initialState';

const useBuildQueryString = () => {
  const state = useSelector((state: State ) => state)
  const { filters, searchResult } = state;
  const { searchQuery } = searchResult;

  const buildQueryString = (query?: string) => {
    let str = query ? `query=${query}` : `query=`
    // should go through each set of filters when we have them
    // for now, only geography
    if(filters.geographyFilters.length) {
      filters.geographyFilters.forEach((item) => {
        str += `&geography=${item.code}`
      })
    }
    if(filters.sectorFilters.length) {
      filters.sectorFilters.forEach((item) => {
        // TODO: build query string when API ready
      })
    }
    if(filters.instrumentFilters.length) {
      filters.instrumentFilters.forEach((item) => {
        // TODO: build query string when API ready
      })
    }
    return str;
    
  }

  const getSearchInput = (queryString) => {
    // don't run search unless there is a search query
    // only need this temporarily until search api will return all items when query is empty
    const end = queryString.indexOf('&') > - 1 ? queryString.indexOf('&') : queryString.length;
    return queryString.substring(queryString.indexOf('=') + 1, end)
  }

  return [ buildQueryString ] as const;
}


export default useBuildQueryString;
