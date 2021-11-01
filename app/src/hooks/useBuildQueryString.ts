import { useSelector } from 'react-redux';
import { PER_PAGE } from '../constants';
import { State } from '../store/initialState';

const useBuildQueryString = () => {
  const state = useSelector((state: State ) => state)
  const { filters, searchResult } = state;
  const { searchQuery } = searchResult;

  const buildQueryString = (query?: string) => {
    let str = query ? `query=${query}` : ``

    if(filters.geographyFilters.length) {
      filters.geographyFilters.forEach((item, index) => {
        str += `${str.length ? '&': ''}geography=${item.code}`
      })
    }
    if(filters.sectorFilters.length) {
      filters.sectorFilters.forEach((item) => {
        str += `${str.length ? '&': ''}sector=${item.name}`
      })
    }
    if(filters.instrumentFilters.length) {
      filters.instrumentFilters.forEach((item) => {
        str += `${str.length ? '&': ''}instrument=${item.name}`
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
