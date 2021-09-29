import { useState, useRef } from 'react';

interface SearchAreaProps {

}
const SearchArea = (props: SearchAreaProps): JSX.Element => {
  const [ searchOpen, setSearchOpen ] = useState(false);
  
  const searchButton = useRef();
  const searchInput = useRef();

  const handleClick = (e): void => {
    e.preventDefault();
    setSearchOpen(!searchOpen);
  }

  return (
    <div className="pt-12 search-area flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold text-black transform-uppercase">Policy Search</h1>
      <form className="relative h-48 w-1/2 mx-auto ml-1/4">
        <input ref={searchInput} type="text" className={`h-20 bg-white border-b-8 border-black text-3xl focus ${searchOpen ? 'square': ''}`} />
        <button ref={searchButton} onClick={handleClick} className={`search-btn ${searchOpen ? 'close' : ''}`}></button>
      </form>
      
    </div>
  )

}
export default SearchArea;