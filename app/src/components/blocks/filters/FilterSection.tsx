import { useState } from 'react';
import FilterHeading from "./FilterHeading"

const FilterSection = ({type, children, title}) => {
  const [ open, setOpen ] = useState(false)
  return (
    <FilterHeading title={title} clickable={true} onClick={() => setOpen(!open)} expanded={open} type={type}>
      <div className={`${open ? 'opacity-1 visible static' : 'opacity-0 invisible absolute'} transition duration-300`}>
        {children}
      </div>
    </FilterHeading>
  )
}
export default FilterSection;