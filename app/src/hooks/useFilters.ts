import { useSelector, useDispatch } from 'react-redux';
import { setFilters, clearFilters } from '../actions/filters';
import { YearRange } from '../model/yearRange';
import { State } from '../store/initialState';

const useFilters = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { filters } = state;

  const updateFilters = (action: string, type: string, name: string, key: string = 'name'): void => {
    const list = state[`${type}List`];
    const activeFilters = filters[`${type}Filters`];
    let newFilters = [];
    if(action === 'add') {
      const obj = activeFilters.find((item) => item[key] === name);
      if(!obj) {
        const newItem = list.find((item) => item[key] === name);
        newFilters = [...activeFilters, newItem];
      }
    }
    else if(action === 'replace') {
      const newItem = list.find((item) => item[key] === name);
      newFilters = [...activeFilters, newItem];
    }
    else {
      // remove
      newFilters = activeFilters.filter((item) => item[key] !== name);
    }
    dispatch(setFilters({...filters, [`${type}Filters`]: newFilters}))
  }

  const replaceFiltersObj = (type: string, obj: YearRange) => {
    dispatch(setFilters({...filters, [`${type}Filters`]: obj}))
  }

  const removeFilters = () => {
    dispatch(clearFilters());
  }

  const checkForFilters = () => {
    for (const [key, value] of Object.entries(filters)) {
      if(filters[key].length) return true;
    }
    return false;
  }

  return [ removeFilters, updateFilters, checkForFilters, replaceFiltersObj ] as const;
}

export default useFilters;