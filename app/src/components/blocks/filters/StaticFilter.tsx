// This is just for demo purposes and has no function
import { CheckListIcon } from '../../elements/images/SVG';
import Circle from '../Circle';

const StaticFilter = ({title}) => {
  return (
    <button className="focus:outline-none flex justify-between items-center w-full transition duration-300 hover:opacity-50">
        <label className="text-sm block mt-2 pointer-events-none">{title}</label>
        <div>
          <Circle bgClass="bg-primary" textClass="text-white" padding="1">
            <CheckListIcon height="10" width="10" color="white" />
          </Circle>
        </div>
      </button>
  )
  
}
export default StaticFilter;