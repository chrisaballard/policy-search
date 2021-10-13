import React from 'react';
import { Geography } from "../../../model/geography";
import ByGeography from "./ByGeography";
import BySelections from './BySelections';
import MultiSelect from './MultiSelect';
 
interface FiltersProps {
  geographies: Geography[];
  newSearch(searchQuery: string): void;
  setProcessing(bool: boolean): void;
  geographyFilters: Geography[];
  setGeographyFilters(filters: Geography[]): void;
  headingClick(type: string): void;
}

const Filters = React.memo(({
  geographies, 
  newSearch, 
  setProcessing, 
  geographyFilters,
  setGeographyFilters,
  headingClick
}: FiltersProps) => {
  
  const onClick = (type) => {
    headingClick(type)
  }
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

      <BySelections
        title="Sectors"
        list={[]}
        icon="sector"
        clickable={true}
        onClick={() => { headingClick('sectors') }}
      />

      <BySelections
        title="Instruments"
        list={[]}
        icon="instrument"
        clickable={true}
        onClick={() => { headingClick('instruments') }}
      />
      
    </div>
  )
});
export default Filters;