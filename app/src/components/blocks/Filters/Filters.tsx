import { Geography } from "../../../model/geography";
import ByCountry from "./ByCountry";

interface FiltersProps {
  geographies: Geography[];
  newSearch(searchQuery: string): void;
  setProcessing(bool: boolean): void;
  setQuery(query: string): void;
  query: string;
  geographyFilters: Geography[];
  setGeographyFilters(filters: Geography[]): void;
}

const Filters = ({
  geographies, 
  newSearch, 
  setProcessing, 
  setQuery, 
  query,
  geographyFilters,
  setGeographyFilters
}: FiltersProps) => {
  
  return (
    <div className="w-full md:w-1/4 md:pr-4">
      <h2 className="font-bold mb-4">Filter by:</h2>
      <ByCountry 
        geographies={geographies}
        newSearch={newSearch}
        setProcessing={setProcessing}
        setQuery={setQuery}
        query={query}
        geographyFilters={geographyFilters}
        setGeographyFilters={setGeographyFilters}
      />
      
    </div>
  )
}
export default Filters;