import React, { useState, useEffect } from 'react';
import { Geography } from "../../../model/geography";
import useGeographyFilters from '../../../hooks/useGeographyFilters';
import FilterTag from './FilterTag';

interface ByGeographyProps {
  geographies: Geography[];
  newSearch(queryString: string): void;
  setProcessing(bool: boolean): void;
  setQuery(query: string): void;
  query: string;
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
  // list of suggested geographies based on user input
  const [ list, suggest ] = useGeographyFilters(geographies); 
  
  const handleChange = (): void => {
    suggest(value)
  }

  const handleFilterSelect = (event: React.FormEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLButtonElement).innerText;
    const newList = list.filter((item) => item.name === value)
    setGeographyFilters([...geographyFilters, ...newList])
    setValue('')
    
  }
  const buildQueryString = (empty: boolean = false): string => {
    const query = document.getElementById('search-input').value;
    let string = `query=${query}`;
    if(!empty) {
      geographyFilters.forEach((item) => {
        string += `&geography=${item.code}`
      })
    }

    return string;
  }
  const handleFilterRemove = (event: React.FormEvent<HTMLButtonElement>) => {
    const value = (event.currentTarget as HTMLButtonElement).nextSibling.textContent;
    const newList = geographyFilters.filter((item) => item.name !== value);
    setGeographyFilters(newList);
    setProcessing(true)
    if(!newList.length) {
      const queryString = buildQueryString(true);
      newSearch(queryString)
    }
  }
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      handleChange()
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [value]);

  useEffect(() => {
    if(geographyFilters.length) {
      setProcessing(true);
      const queryString = buildQueryString();
      newSearch(queryString)
    }
  }, [geographyFilters]);


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