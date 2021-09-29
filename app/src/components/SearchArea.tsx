import React, { useState, useRef, useEffect } from 'react';

interface SearchAreaProps {
  onChange(e: React.FormEvent<HTMLInputElement>): void;
}
const SearchArea = ({onChange}: SearchAreaProps): JSX.Element => {
  const [ searchOpen, setSearchOpen ] = useState(false);
  
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchLabel = useRef<HTMLLabelElement>(null);

  const handleClick = (e: React.FormEvent<HTMLInputElement> ): void => {
    e.preventDefault();
    setSearchOpen(!searchOpen);
  }
  useEffect(() => {
    if(searchInput.current && !searchOpen) {
      searchInput.current.value = '';
    }
      setTimeout(() => {
        if(searchInput.current && searchOpen) {
          searchInput.current.focus();
        }
      }, 800);
  }, [searchOpen])
  return (
    <div className="pt-16 search-area flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold text-black transform-uppercase">Policy Search</h1>
      <form className="absolute top-0 mt-56 h-48 w-1/2 mx-auto">
        <label 
          ref={searchLabel}
          className={`block absolute top-0 left-0 right-0 text-gray-400 text-2xl text-center z-10 pointer-events-none transition duration-300 ${searchOpen ? 'opacity-0': 'opacity-100'}`}>
            What are you looking for?
        </label>
        <div 
          className={`search-input-wrapper transition-all duration-300 ${searchOpen ? 'expanded' : ''}`}>
            <input 
              ref={searchInput}
              onChange={onChange}
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