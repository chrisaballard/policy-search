interface FilterHeadingProps {
  title: string;
  children: JSX.Element | string;
  onClick?(): void;
  icon: string;
  clickable?:boolean;
}
const FilterHeading = ({ title, children, onClick, icon, clickable }: FilterHeadingProps): JSX.Element => {
  return (
    <div onClick={onClick} className={`flex items-center flex-wrap my-4 uppercase text-primary-dark py-2 rounded-xl ${clickable ? 'cursor-pointer hover:text-primary-light transition duration-300' : 'pointer-events-none'}`}>
      <div className="bg-primary-light rounded-full p-2 flex items-center justify-center" style={{ width: '36px', height: '36px'}}>
        <img src={`/images/icon-${icon}.svg`} style={{ width: '100%'}} />
      </div>
      
      <div className="ml-4">{title}</div>
      <div className="w-full">
        {children}
      </div>
    </div>
    
  )
}

export default FilterHeading