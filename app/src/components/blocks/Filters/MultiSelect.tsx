
import { Instrument } from '../../../model/instrument';
import { Sector } from '../../../model/sector';
import Checkbox from '../../forms/Checkbox';
import FilterHeading from './FilterHeading';
import FilterTag from './FilterTag';

interface MultiSelectProps {
  title: string;
  list: Instrument[] | Sector[];
}
const MultiSelect = ({title, list}: MultiSelectProps): JSX.Element => {

  return (
    <section>
      {console.log(list)}
      <h2 className="text-2xl mb-8 capitalize">{title}</h2>
      <ul className="md:flex md:flex-wrap">
      {list.length && list.map((item) => (
        <li key={item.id} className="md:w-1/2 flex my-2 cursor-pointer">
          <Checkbox name={item.name} checked={false} />
          <label className="cursor-pointer text-sm">{item.name}</label>
        </li>
      ))}
    </ul>

    </section>
  )
}
export default MultiSelect;