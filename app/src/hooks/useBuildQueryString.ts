import { useSelector } from 'react-redux';
import { PER_PAGE } from '../constants';
import { State } from '../store/initialState';

const useBuildQueryString = () => {
  const state = useSelector((state: State ) => state)
  const { filters, searchResult } = state;
  const { searchQuery } = searchResult;

  const buildQueryString = (query?: string) => {
    let str = query ? `query=${query}&` : ``
    // should go through each set of filters when we have them
    // for now, only geography
    if(filters.geographyFilters.length) {
      filters.geographyFilters.forEach((item, index) => {
        str += `${index > 0 ? '&' : ''}geography=${item.code}`
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

    // years
    str += `${str.length ? '&': ''}year_start=${filters.yearFilters.min}&year_end=${filters.yearFilters.max}`
    return str;
    
  }

  const getSearchInput = (queryString) => {
    const end = queryString.indexOf('&') > - 1 ? queryString.indexOf('&') : queryString.length;
    return queryString.substring(queryString.indexOf('=') + 1, end)
  }

  return [ buildQueryString ] as const;
}


export default useBuildQueryString;
