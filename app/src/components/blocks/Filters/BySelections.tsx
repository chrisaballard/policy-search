import { Instrument } from '../../../model/instrument';
import { Sector } from '../../../model/sector';
import FilterHeading from "./FilterHeading";
import FilterTag from './FilterTag';

interface BySelectionsProps {
  title: string;
  list: Instrument[] | Sector[];
  icon: string;
  clickable?: boolean;
  onClick(): void;
}

const BySelections = ({ title, list, icon, clickable, onClick}: BySelectionsProps) => {
  const handleFilterRemove = () => {

  }
  return (
    <section>
      <FilterHeading
        icon={icon}
        title={title}
        clickable={clickable}
        onClick={onClick}
      >
        <ul>
          {list.map((item) => (
            <FilterTag onClick={handleFilterRemove} key={item.id} text={item.name} />
          ))}
        </ul>
      </FilterHeading>

    </section>
  )
}
export default BySelections;