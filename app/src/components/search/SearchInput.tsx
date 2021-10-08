import React, { useState, useRef, useEffect } from 'react';
import { Geography } from '../../model/geography';
import useBuildQueryString from '../../hooks/useBuildQueryString';

interface SearchInputProps {
  newSearch(queryString: string): void;
  setProcessing(boolean: boolean): void;
  processing: boolean;
  searchTerms: string;
}
const SearchInput = ({newSearch, setProcessing, processing, searchTerms}: SearchInputProps): JSX.Element => {
  const [ searchOpen, setSearchOpen ] = useState(false);
  const [ input, setInput ] = useState('');

  const [ buildQueryString ] = useBuildQueryString();
  
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchLabel = useRef<HTMLLabelElement>(null);

  const handleClick = (e: React.FormEvent<HTMLButtonElement> ): void => {
    e.preventDefault();
    setSearchOpen(!searchOpen);
  }
  const handleChange = () => {
    // setSearchTerms(searchInput.current.value)
    setInput(searchInput.current.value)
  }
 
  useEffect(() => {
    if(input && !processing) setProcessing(true);
    // handle change event only after user
    // has stopped typing
    const timeOutId = setTimeout(() => {
      const str = buildQueryString(input);
      newSearch(str);
      // newSearch(`query=${searchTerms}`);
    }, 800);
    return () => clearTimeout(timeOutId);
  }, [input]);

  useEffect(() => {
    // toggle open/close of search field
      setTimeout(() => {
        if(searchInput.current && searchOpen) {
          searchInput.current.focus();
        }
      }, 800);
  }, [searchOpen]);

  useEffect(() => {
    // setInput(searchTerms)
  }, [])

  return (
    <section>
      <div className="search-area container flex flex-col justify-center items-center relative">
        <h1 className="text-4xl md:text-6xl font-bold text-black transform-uppercase text-center">Policy Search</h1>
        <form 
          onSubmit={e => { e.preventDefault() }}
          className="w-full relative mt-8 md:mt-16 h-24 md:w-2/3 lg:w-1/2 mx-auto"
        >
          <label 
            ref={searchLabel}
            className={`block pr-16 absolute top-0 left-0 right-0 text-gray-400 text-2xl text-center z-10 pointer-events-none transition duration-300 ${searchOpen ? 'opacity-0': 'opacity-100'}`}>
              What are you looking for?
          </label>
          <div 
            className={`search-input-wrapper transition-all duration-300 ${searchOpen ? 'expanded' : ''}`}>
              <input 
                id="search-input"
                ref={searchInput}
                onChange={handleChange}
                value={input}
                className={`search-input h-full w-full text-3xl text-gray-500 outline-none focus:outline-none`} 
              />
          </div>
          
          <button
            type="button"
            onClick={handleClick} ref={searchButton}
            className={`search-btn outline-none focus:outline-none flex items-center justify-end ${searchOpen ? 'collapsed' : ''}`}>
              <img 
                src="/images/close.svg" 
                alt="Close icon"
                className={`search-btn-close ${searchOpen ? 'opacity-100': 'opacity-0'}`} />
              <img 
                src="/images/search.svg" 
                alt="Search icon" 
                className={`search-btn-search ${searchOpen ? 'opacity-0': 'opacity-100'}`} />
          </button>
        </form>
      </div>
    </section>
  )

}
export default SearchInput;