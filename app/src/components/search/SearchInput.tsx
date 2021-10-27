import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import useBuildQueryString from '../../hooks/useBuildQueryString';
import { useDidUpdateEffect } from '../../hooks/useDidUpdateEffect';

interface SearchInputProps {
  newSearch(queryString: string): void;
  clearResult(): void;
  searchTerms: string;
}
const SearchInput = ({newSearch, clearResult, searchTerms}: SearchInputProps): JSX.Element => {
  const [ searchActivated, setSearchActivated ] = useState(false);
  const [ input, setInput ] = useState(searchTerms);
  const router = useRouter();
  const [ buildQueryString ] = useBuildQueryString();
  
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchLabel = useRef<HTMLLabelElement>(null);

  const handleClick = (e: React.FormEvent<HTMLButtonElement> ): void => {
    e.preventDefault();
    
    if(!searchActivated) {
      setSearchActivated(true);
    }
    else {
      clearResult();
      setInput('');
    }
  }
  const handleChange = () => {
    setInput(searchInput.current.value)
  }
  const newQuery = () => {
    const qStr = buildQueryString(input);
    newSearch(qStr);
  }
 
  useDidUpdateEffect(() => {
    if(!input.length) {
      newQuery();
      searchInput.current.focus();
      return;
    }
    
    // handle change event only after user
    // has stopped typing
    const timeOutId = setTimeout(() => {
      newQuery();
    }, 800);
    return () => clearTimeout(timeOutId);
  }, [input]);

  useDidUpdateEffect(() => {
    if(searchInput.current && searchActivated) {
      searchInput.current.focus();
    }
  }, [searchActivated]);


  return (
    <section>
      <div className="search-area container flex justify-center items-center relative">
        <div className="hidden md:block w-full md:w-1/4 md:pl-0 md:pr-4 flex-shrink-0"></div>
        <form 
          onSubmit={e => { e.preventDefault() }}
          className="w-full relative mt-6 lg:mt-10 h-20 md:h-24 md:flex-grow mx-auto"
        >
          <label 
            ref={searchLabel}
            className={`block pr-16 absolute top-0 left-0 right-0 text-primary-dark-400 text-xl md:text-2xl lg:text-3xl text-center md:text-left md:pl-8 z-10 pointer-events-none transition duration-300 ${searchActivated ? 'opacity-0': 'opacity-100'}`}>
              What are you looking for?
          </label>
          <div 
            className={`md:ml-64 search-input-wrapper transition-all duration-300 ${searchActivated ? 'expanded' : ''}`}>
              <input 
                id="search-input"
                ref={searchInput}
                onChange={handleChange}
                value={input}
                className={`search-input h-full w-full text-xl md:text-3xl text-primary-dark-500 outline-none focus:outline-none`} 
              />
          </div>
          
          <button
            type="button"
            onClick={handleClick} ref={searchButton}
            className={`search-btn outline-none focus:outline-none flex items-center justify-end ${searchActivated ? 'collapsed' : ''}`}>
              <img 
                src="/images/close.svg" 
                alt="Close icon"
                className={`search-btn-close ${input.length ? 'opacity-100': 'opacity-0'}`} />
              <img 
                src="/images/search.svg" 
                alt="Search icon" 
                className={`-mt-2 search-btn-search ${!input.length ? 'opacity-100': 'opacity-0'}`} />
          </button>
        </form>
      </div>
    </section>
  )

}
export default SearchInput;