interface FilterHeadingProps {
  title: string;
  children: JSX.Element | string;
  onClick?(): void;
}
const FilterHeading = ({ title, children, onClick }: FilterHeadingProps): JSX.Element => {
  return (
    <div onClick={onClick} className="my-4 uppercase bg-gray-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-200 transition duration-300">
      <div className="">{title}</div>
      {children}
    </div>
    
  )
}

export default FilterHeading