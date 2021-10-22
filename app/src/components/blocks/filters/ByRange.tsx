import { YearRange } from "../../../model/yearRange";
import Range from "../../elements/inputs/Range";
import FilterHeading from "./FilterHeading";

interface ByRangeProps {
  type: string;
  clickable?: boolean;
  filters: YearRange;
  updateFilters(action: string, type: string, name: string): void;
}
const ByRange = ({ type, clickable, filters, updateFilters}: ByRangeProps) => {
  return (
    <FilterHeading
      type={type}
      clickable={clickable}
    >
      <div className="mt-2">
        <Range />
      </div>
    </FilterHeading>
  )
}
export default ByRange;