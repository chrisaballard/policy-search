// This is just for demo purposes and has no function
import { CheckListIcon } from '../../elements/images/SVG';
import Circle from '../Circle';

const StaticFilter = ({title}) => {
  return (
    <button className="mb-4 focus:outline-none flex justify-between items-center w-full transition duration-300 hover:opacity-50">
      <label className="text-left text-sm block pointer-events-none">{title}</label>
      <div className="w-1/6 flex-shrink-0">
        <Circle bgClass="bg-white" textClass="text-primary" outlineClass="border-primary" padding="1">
          <CheckListIcon height="10" width="10" />
        </Circle>
      </div>
    </button>
  )
  
}
export default StaticFilter;