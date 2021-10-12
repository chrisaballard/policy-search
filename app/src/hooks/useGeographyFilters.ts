
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Geography } from '../model/geography';
import { State } from '../store/initialState';

interface FilterProps {
  list: Geography[];
  suggest(): void;
}

const useGeographyFilters = (countries: Geography[]) => {
  const [ list, setList ] = useState([]);
  const state = useSelector((state: State ) => state)
  const { filters: {geographyFilters} } = state;

  const isDuplicate = (name) => {
    const result = geographyFilters.filter(item => item.name === name)
    return result.length;
  }
  const suggest = (input: string): void => {
    if (!input.length) {
      setList([]);
      return;
    }
    
    const filteredList = countries.filter((country) => {

      return country.name.toLowerCase().indexOf(input.toLowerCase()) > -1 && !isDuplicate(country.name);
    })

    setList(filteredList.slice(0, 10))
  }
  return [ list, suggest ] as const;
}
export default useGeographyFilters;