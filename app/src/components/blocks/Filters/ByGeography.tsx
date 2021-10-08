import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../constants';
import { Geography } from "../../../model/geography";
import useGeographyFilters from '../../../hooks/useGeographyFilters';
import useBuildQueryString from '../../../hooks/useBuildQueryString';
import { getParameterByName } from '../../../helpers/queryString';
import FilterTag from './FilterTag';

interface ByGeographyProps {
  geographies: Geography[];
  newSearch(queryString: string): void;
  setProcessing(bool: boolean): void;
  geographyFilters: Geography[];
  setGeographyFilters(filters: Geography[]): void;
}

const ByGeography = ({
  geographies, 
  newSearch, 
  setProcessing,
  geographyFilters,
  setGeographyFilters,
}: ByGeographyProps) => {
  // input value
  const [ value, setValue ] = useState('');

  // checks if all filters have been removed to trigger a new search
  const [ filtersRemoved, setFiltersRemoved ] = useState(false);

  // list of suggested geographies based on user input
  const [ list, suggest ] = useGeographyFilters(geographies); 

  const [ buildQueryString ] = useBuildQueryString();
  
  const handleChange = (): void => {
    suggest(value)
  }

  const handleFilterSelect = (event: React.FormEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLButtonElement).innerText;
    const newList = list.filter((item) => item.name === value)
    setGeographyFilters([...geographyFilters, ...newList])
    setFiltersRemoved(false)
  }
  const handleFilterRemove = (event: React.FormEvent<HTMLButtonElement>) => {
    const value = (event.currentTarget as HTMLButtonElement).nextSibling.textContent;
    const newList = geographyFilters.filter((item) => item.name !== value);
    setGeographyFilters(newList);
    setFiltersRemoved(true)
  }

  const applyFilters = () => {
    const queryString = buildQueryString(document.getElementById('search-input').value);
    setProcessing(true);
    newSearch(queryString);
    setValue('');
  }
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      handleChange()
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [value]);

  useEffect(() => {
    
    if(geographyFilters.length || filtersRemoved) {
      applyFilters();
    }

  }, [geographyFilters, filtersRemoved]);


  return (
    <section>
      <div className="mb-4 uppercase">Geography</div>
      <div className="relative">
        <input
          className="h-12 w-full border rounded focus:outline-none px-2 text-gray-500"
          type="text"
          value={value}
          placeholder='start typing...'
          onChange={(event: React.FormEvent<HTMLInputElement>): void => setValue((event.target as HTMLInputElement).value)}
        />
        {list.length ?
          <ul className="absolute top-0 left-0 w-full mt-10 bg-white border-l border-r border-b rounded z-10">
            {list.map((item) => (
              <li key={item.code} className="">
                <button 
                  type="button"
                  onClick={handleFilterSelect}
                  className="block text-left w-full p-2 focus:outline-dotted hover:bg-gray-100">{item.name}</button>
              </li>
            ))}
          </ul>
        :
        null
        }
        {geographyFilters.length ? 
        <div>
          {geographyFilters.map((item) => (
            <FilterTag onClick={handleFilterRemove} key={item.code} text={item.name} />
          ))}
        </div>
        :
        null}
        
      </div>
    </section>
  )
}

export default ByGeography;