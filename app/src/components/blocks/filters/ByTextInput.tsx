import React, { useState, useEffect, useRef } from 'react';
import useSuggestList from '../../../hooks/useSuggestList';
import { useDidUpdateEffect } from '../../../hooks/useDidUpdateEffect';
import useListSelect from '../../../hooks/useListSelect';
import FilterTag from './FilterTag';
import FilterHeading from './FilterHeading';

interface ByTextInputProps {
  type: string;
  // full list of available filters
  list: any[]; // need generic type
  filters: any[];
  setProcessing(bool: boolean): void;
  updateFilters(action: string, type: string, name: string): void;
}

const ByTextInput = React.memo(({
  type,
  list,
  filters,
  updateFilters
}: ByTextInputProps) => {
  // input value
  const [ value, setValue ] = useState('');

  // checks if all filters have been removed to trigger a new search
  const [ filtersRemoved, setFiltersRemoved ] = useState(false);

  // list of suggested available filter values based on user input
  const [ suggestList, suggest ] = useSuggestList(list, type); 

  const [ navigateList, clearSelected ] = useListSelect('filter-list', suggestList.length)

  const listRef = useRef(null);
  
  const handleChange = (): void => {
    suggest(value)
  }

  const handleFilterSelect = (event: React.FormEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLButtonElement).innerText;
    updateFilters('add', type, value)
    setFiltersRemoved(false);
    clearSelected();
  }
  const handleFilterRemove = (event: React.FormEvent<HTMLButtonElement>) => {
    const value = (event.currentTarget as HTMLButtonElement).nextSibling.textContent;
    updateFilters('remove', type, value);
    setFiltersRemoved(true);
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      handleChange()
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [value]);

  useEffect(() => {
    if(suggestList.length) {
      window.addEventListener('keydown', navigateList);
    }
    else {
      window.removeEventListener('keydown', navigateList);
    }

    return () => {
      window.removeEventListener('keydown', navigateList);
    }
    
  }, [suggestList])

  useDidUpdateEffect(() => {
    if(filters.length || filtersRemoved) {
      setValue('');
    }
  }, [filters, filtersRemoved])
  
  return (
    <section>
      <FilterHeading type={type}>
      <div className="relative my-2 mt-4">
        <input
          className="h-12 w-full rounded-lg bg-primary-dark-200 focus:outline-none px-2 text-primary-dark-600 placeholder-primary-dark-400"
          type="text"
          value={value}
          placeholder='Start typing...'
          onChange={(event: React.FormEvent<HTMLInputElement>): void => setValue((event.target as HTMLInputElement).value)}
        />
        {suggestList.length ?
          <ul ref={listRef} id="filter-list" className="absolute top-0 left-0 w-full mt-10 bg-white border-l border-r border-b rounded-b-lg z-10">
            {suggestList.map((item) => (
              <li key={item.code}>
                <button 
                  type="button"
                  onClick={handleFilterSelect}
                  className="block text-left w-full p-2 focus:outline-dotted hover:bg-primary-dark-200">{item.name}</button>
              </li>
            ))}
          </ul>
        :
        null
        }
        {filters.length ? 
        <div className="mt-2 mb-8 flex flex-wrap">
          {filters.map((item) => (
            <FilterTag onClick={handleFilterRemove} key={item.code} text={item.name} />
          ))}
        </div>
        :
        null}
        
      </div>
      </FilterHeading>
    </section>
  )
});

export default ByTextInput;