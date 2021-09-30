import React, { useState, useRef, useEffect } from 'react';

interface SearchAreaProps {
  handleChange(query: string): void;
}
const SearchArea = ({handleChange}: SearchAreaProps): JSX.Element => {
  const [ searchOpen, setSearchOpen ] = useState(false);
  const [ query, setQuery ] = useState('');
  
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchLabel = useRef<HTMLLabelElement>(null);

  const handleClick = (e: React.FormEvent<HTMLButtonElement> ): void => {
    e.preventDefault();
    setSearchOpen(!searchOpen);
  }
  useEffect(() => {
    // handle change event only after user
    // has stopped typing
    const timeOutId = setTimeout(() => {
      handleChange(query)
    }, 800);
    return () => clearTimeout(timeOutId);
  }, [query]);

  useEffect(() => {
    // reset search field when clicking x
    if(searchInput.current && !searchOpen) {
      setQuery('');
    }
    // toggle open/close of search field
      setTimeout(() => {
        if(searchInput.current && searchOpen) {
          searchInput.current.focus();
        }
      }, 800);
  }, [searchOpen])
  return (
    <div className="search-area flex flex-col justify-center items-center relative">
      <h1 className="text-6xl font-bold text-black transform-uppercase">Policy Search</h1>
      <form className="relative mt-16 h-48 w-1/2 mx-auto">
        <label 
          ref={searchLabel}
          className={`block absolute top-0 left-0 right-0 text-gray-400 text-2xl text-center z-10 pointer-events-none transition duration-300 ${searchOpen ? 'opacity-0': 'opacity-100'}`}>
            What are you looking for?
        </label>
        <div 
          className={`search-input-wrapper transition-all duration-300 ${searchOpen ? 'expanded' : ''}`}>
            <input 
              ref={searchInput}
              onChange={(event: React.FormEvent<HTMLInputElement>): void => setQuery(event.target.value)}
              value={query}
              className={`search-input h-full w-full text-xl text-gray-500 outline-none focus:outline-none`} 
            />
        </div>
        
        <button
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
  )

}
export default SearchArea;