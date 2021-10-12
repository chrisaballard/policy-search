import React from 'react';
import { Geography } from "../../../model/geography";
import ByGeography from "./ByGeography";
import MultiSelect from './MultiSelect';

interface FiltersProps {
  geographies: Geography[];
  newSearch(searchQuery: string): void;
  setProcessing(bool: boolean): void;
  geographyFilters: Geography[];
  setGeographyFilters(filters: Geography[]): void;
}

const Filters = React.memo(({
  geographies, 
  newSearch, 
  setProcessing, 
  geographyFilters,
  setGeographyFilters
}: FiltersProps) => {
  
  return (
    <div className="w-full md:w-1/4 md:pr-4 flex-shrink-0">
      <h2 className="font-bold mb-4 border-b pb-2">Filter by:</h2>
      <ByGeography 
        geographies={geographies}
        newSearch={newSearch}
        setProcessing={setProcessing}
        geographyFilters={geographyFilters}
        setGeographyFilters={setGeographyFilters}
      />

      <MultiSelect title="Instrument" list={[]} />

      <MultiSelect title="Sector" list={[]} />
      
    </div>
  )
});
export default Filters;