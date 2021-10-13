
import { Instrument } from '../../../model/instrument';
import { Sector } from '../../../model/sector';
import FilterHeading from './FilterHeading';

interface MultiSelectProps {
  title: string;
  list: Instrument[] | Sector[];
  icon: string;
}
const MultiSelect = ({title, list, icon}: MultiSelectProps): JSX.Element => {
  const expandList = () => {
    console.log('expand list')
  }
  return (
    <section>
      <FilterHeading
        icon={icon}
        title={title}
        onClick={expandList}
      >
        <ul>
          
        </ul>
      </FilterHeading>

    </section>
  )
}
export default MultiSelect;