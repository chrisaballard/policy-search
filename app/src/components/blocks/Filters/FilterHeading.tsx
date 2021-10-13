interface FilterHeadingProps {
  title: string;
  children: JSX.Element | string;
  onClick?(): void;
  icon: string;
}
const FilterHeading = ({ title, children, onClick, icon }: FilterHeadingProps): JSX.Element => {
  return (
    <div onClick={onClick} className="flex items-center flex-wrap my-4 uppercase text-primary-dark py-2 rounded-xl">
      <div className="bg-primary-light rounded-full p-2 flex items-center justify-center" style={{ width: '36px', height: '36px'}}>
        <img src={`/images/icon-${icon}.svg`} style={{ width: '100%'}} />
      </div>
      
      <div className="ml-2">{title}</div>
      <div className="w-full">
        {children}
      </div>
    </div>
    
  )
}

export default FilterHeading