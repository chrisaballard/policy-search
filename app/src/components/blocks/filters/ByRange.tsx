import { YearRange } from "../../../model/yearRange";
import MultiRange from "../../elements/inputs/MultiRange";

interface ByRangeProps {
  title: string;
  type: string;
  filters: YearRange;
  replaceFiltersObj(type: string, obj: Object): void;
}
const ByRange = ({ title, type, filters, replaceFiltersObj}: ByRangeProps) => {
  return (
    <div className="mt-2 mb-6">
      <label className="text-sm">{title}</label>
      <MultiRange 
        min="1947"
        max="2021"
        replaceFiltersObj={replaceFiltersObj}
      />
    </div>
  )
}
export default ByRange;