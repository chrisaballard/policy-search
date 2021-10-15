
import { Instrument } from '../../../model/instrument';
import { Sector } from '../../../model/sector';
import useBuildQueryString from '../../../hooks/useBuildQueryString';
import Checkbox from '../../elements/inputs/Checkbox';

interface MultiSelectProps {
  title: string;
  // full list of filters
  list: Instrument[] | Sector[];
  // active filters
  activeFilters: Instrument[] | Sector[];
  updateFilters(action: string, type: string, name: string): void;
  newSearch(queryString: string): void;
}
const MultiSelect = ({title, list, activeFilters, updateFilters}: MultiSelectProps): JSX.Element => {

  const buildQueryString = useBuildQueryString();
  
  // need to compare and see if item is in filters
  const isInFilters = (name: string) => {
    return activeFilters.filter(item => item.name === name).length > 0;
  }
  // update filters on change
  const handleChange = (name: string, isChecked: boolean): void => {
    const action = isChecked ? 'add' : 'remove';
    updateFilters(action, title, name);
  }

  return (
    <section>
      <h2 className="text-2xl mb-8 capitalize border-b pb-6">{`${title}s`}</h2>
      <ul className="md:flex md:flex-wrap">
      {list.length && list.map((item) => (
        <li key={item.id} className="md:w-1/2 flex my-4 cursor-pointer">
          <Checkbox name={item.name} checked={isInFilters(item.name)} onChange={handleChange} />
          <label htmlFor={item.name} className="cursor-pointer text-sm">{item.name}</label>
        </li>
      ))}
    </ul>

    </section>
  )
}
export default MultiSelect;