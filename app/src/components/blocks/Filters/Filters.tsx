import { Geography } from "../../../model/geography";
import ByCountry from "./ByCountry";

interface FiltersProps {
  geographies: Geography[];
}

const Filters = ({geographies}: FiltersProps) => {
  
  return (
    <div className="w-full md:w-1/4 md:pr-4">
      <h2 className="font-bold mb-4">Filter by:</h2>
      <ByCountry 
        geographies={geographies}
      />
      
    </div>
  )
}
export default Filters;