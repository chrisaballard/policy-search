import { YearRange } from "../../../model/yearRange";
import MultiRange from "../../elements/inputs/MultiRange";
import Range from "../../elements/inputs/Range";
import FilterHeading from "./FilterHeading";

interface ByRangeProps {
  type: string;
  clickable?: boolean;
  filters: YearRange;
  replaceFiltersObj(type: string, obj: Object): void;
}
const ByRange = ({ type, clickable, filters, replaceFiltersObj}: ByRangeProps) => {
  return (
    <FilterHeading
      type={type}
      clickable={clickable}
    >
      <div className="mt-2">
        <MultiRange 
          min="1947"
          max="2021"
          replaceFiltersObj={replaceFiltersObj}
        />
      </div>
    </FilterHeading>
  )
}
export default ByRange;