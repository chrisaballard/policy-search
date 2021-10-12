
import { Instrument } from '../../../model/instrument';
import { Sector } from '../../../model/sector';
import FilterHeading from './FilterHeading';

interface MultiSelectProps {
  title: string;
  list: Instrument[] | Sector[];
}
const MultiSelect = ({title, list}: MultiSelectProps): JSX.Element => {
  const expandList = () => {
    console.log('expand list')
  }
  return (
    <section>
      <FilterHeading title={title} onClick={expandList}>
        Some list
      </FilterHeading>

    </section>
  )
}
export default MultiSelect;