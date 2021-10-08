
import { useMemo, useState } from 'react';
import { Geography } from '../model/geography';

interface FilteredList {
  list: Geography[];
}

const useGeographyFilters = (countries: Geography[]) => {
  const [ list, setList ] = useState([])
  const suggest = (input: string): void => {
    if (!input.length) {
      setList([]);
      return;
    }
    const filteredList = countries.filter((country) => {
      return country.name.toLowerCase().indexOf(input.toLowerCase()) > -1;
    })

    setList(filteredList.slice(0, 10))
  }
  return [ list, suggest ] as const;
}
export default useGeographyFilters;