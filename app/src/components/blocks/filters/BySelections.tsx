import { Geography } from '../../../model/geography';
import { Instrument } from '../../../model/instrument';
import { Sector } from '../../../model/sector';
import { CheckListIcon } from '../../elements/images/SVG';
import Circle from '../Circle';
import FilterHeading from "./FilterHeading";
import FilterTag from './FilterTag';

interface BySelectionsProps {
  type: string;
  onClick(): void;
  filters: Geography[] | Instrument[] | Sector[];
  updateFilters(action: string, type: string, name: string): void;
  title: string;
}

const BySelections = ({ type, onClick, filters, updateFilters, title}: BySelectionsProps) => {

  const handleFilterRemove = (e) => {
    const name = e.currentTarget.parentNode.children[1].textContent;
    updateFilters('remove', type, name);
  }
  return (
    <div className="mb-4">
      <button onClick={onClick} className="focus:outline-none flex justify-between items-center w-full transition duration-300 hover:opacity-50">
        <label className="text-left text-sm block pointer-events-none">{title}</label>
        <div className="w-1/6 flex-shrink-0">
          <Circle bgClass="bg-white" textClass="text-primary" outlineClass="border-primary" padding="1">
            <CheckListIcon height="10" width="10" />
          </Circle>
        </div>
      </button>
        {filters.length ? 
          <div className="mt-2 mb-4 flex flex-wrap">
            {filters.map((item) => (
              <FilterTag onClick={handleFilterRemove} key={item.id} text={item.name} />
            ))}
          </div>
        : null}
    </div>
  )
}
export default BySelections;