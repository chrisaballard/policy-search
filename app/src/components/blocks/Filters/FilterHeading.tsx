interface FilterHeadingProps {
  title: string;
  children: JSX.Element | string;
  onClick?(): void;
  icon: string;
  clickable?:boolean;
}
const FilterHeading = ({ title, children, onClick, icon, clickable }: FilterHeadingProps): JSX.Element => {
  return (
    <div className="mt-6">
      <div className={`flex items-center justify-start uppercase text-primary-dark ${clickable ? 'cursor-pointer hover:text-primary-light transition duration-300' : 'pointer-events-none'}`} onClick={onClick}>
        <div className="bg-primary-light rounded-full p-2 flex items-center justify-center" style={{ width: '36px', height: '36px'}}>
          <img src={`/images/icon-${icon}.svg`} style={{ width: '100%'}} />
        </div>
        <div className="ml-4 flex-grow">{title}</div>
        {clickable ? 
          <div className="">+</div>
        :
        null}
        
      </div>
      
      <div className="w-full">
        {children}
      </div>
    </div>
    
  )
}

export default FilterHeading