import { useSelector, useDispatch } from 'react-redux';
import { setFilters } from '../actions/filters';
import { State } from '../store/initialState';

const useFilters = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State ) => state)
  const { filters } = state;

  const updateFilters = (action: string, type: string, name: string): void => {
    const list = state[`${type}s`];
    const activeFilters = filters[`${type}Filters`];
    let newFilters = [];
    if(action === 'add') {
      const obj = activeFilters.find((item) => item.name === name);
      if(!obj) {
        const newItem = list.find((item) => item.name === name);
        newFilters = [...activeFilters, newItem];
      }
    }
    else {
      newFilters = activeFilters.filter((item) => item.name !== name);
    }
    dispatch(setFilters({...filters, [`${type}Filters`]: newFilters}))
  }

  return [filters, updateFilters ] as const;
}

export default useFilters;