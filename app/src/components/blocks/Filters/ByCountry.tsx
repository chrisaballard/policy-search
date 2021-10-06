import React, { useState, useEffect } from 'react';
import { Geography } from "../../../model/geography";
import useCountryFilters from '../../../hooks/useCountryFilters';
import FilterTag from './FilterTag';

interface ByCountryProps {
  geographies: Geography[];
  newSearch(queryString: string): void;
  setProcessing(bool: boolean): void;
  setQuery(query: string): void;
  query: string;
  geographyFilters: Geography[];
  setGeographyFilters(filters: Geography[]): void;
}

const ByCountry = ({
  geographies, 
  newSearch, 
  geographyFilters,
  setGeographyFilters
}: ByCountryProps) => {
  const [ value, setValue ] = useState('');
  const [ filterList, setFilterList ] = useState([]); // list of geographies to filter by
  const [ list, suggest ] = useCountryFilters(geographies);
  
  const handleChange = (): void => {
    suggest(value)
  }
  const handleFilterSelect = (event: React.FormEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLButtonElement).innerText;
    const newList = list.filter((item) => item.name === value)
    setFilterList([...filterList, ...newList]);
    // setGeographyFilters([...geographyFilters, ...newList])
    setValue('')
    
  }
  const buildQueryString = (): string => {
    const query = document.getElementById('search-input').value;
    let string = `query=${query}`;
    filterList.forEach((item) => {
      string += `&geography=${item.code}`
    })
    return string;
  }
  const handleFilterRemove = (event: React.FormEvent<HTMLButtonElement>) => {
    const value = (event.currentTarget as HTMLButtonElement).nextSibling.textContent;
    const newList = geographyFilters.filter((item) => item.name !== value);
    setFilterList(newList);
  }
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      handleChange()
      console.log('?')
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [value]);

  useEffect(() => {
    if(filterList.length) {
      const queryString = buildQueryString();
      newSearch(queryString)
      console.log('new search?')
    }
  }, [filterList]);


  return (
    <section>
      <div className="border-b pb-2 mb-4 uppercase">Country</div>
      <div className="relative">
        <input
          className="h-12 w-full border rounded focus:outline-none px-2"
          type="text"
          value={value}
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
        {filterList.length ? 
        <div>
          {filterList.map((item) => (
            <FilterTag onClick={handleFilterRemove} key={item.code} text={item.name} />
          ))}
        </div>
        :
        null}
        
      </div>
    </section>
  )
}

export default ByCountry;