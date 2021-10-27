import { Geography } from '../../../model/geography';
import { Instrument } from '../../../model/instrument';
import { Sector } from '../../../model/sector';
import FilterHeading from "./FilterHeading";
import FilterTag from './FilterTag';

interface BySelectionsProps {
  type: string;
  clickable?: boolean;
  onClick(): void;
  filters: Geography[] | Instrument[] | Sector[];
  updateFilters(action: string, type: string, name: string): void;
}

const BySelections = ({ type, clickable, onClick, filters, updateFilters}: BySelectionsProps) => {

  const handleFilterRemove = (e) => {
    const name = e.currentTarget.parentNode.children[1].textContent;
    updateFilters('remove', type, name);
  }
  return (
    <section>
      <FilterHeading
        type={type}
        clickable={clickable}
        onClick={onClick}
      >
        {filters.length ? 
          <div className="mt-2 mb-8 flex flex-wrap">
            {filters.map((item) => (
              <FilterTag onClick={handleFilterRemove} key={item.id} text={item.name} />
            ))}
          </div>
        : null}
      </FilterHeading>

    </section>
  )
}
export default BySelections;