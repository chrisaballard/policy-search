import React from 'react';
import { Filters } from '../../../model/filters';
import { Geography } from "../../../model/geography";
import ByGeography from "./ByGeography";
import BySelections from './BySelections';
 
interface FiltersProps {
  geographies: Geography[];
  newSearch(searchQuery: string): void;
  setProcessing(bool: boolean): void;
  geographyFilters: Geography[];
  setGeographyFilters(filters: Geography[]): void;
  updateFilters(action: string, type: string, name: string): void;
  headingClick(type: string): void;
  filters: Filters;
}

const FiltersColumn = React.memo(({
  geographies, 
  newSearch, 
  setProcessing, 
  geographyFilters,
  setGeographyFilters,
  headingClick,
  updateFilters,
  filters
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
        // filters={filters.geographyFilters}
      />

      <BySelections
        title="Sectors"
        icon="sector"
        clickable={true}
        onClick={() => { headingClick('sector') }}
        filters={filters.sectorFilters}
        updateFilters={updateFilters}
      />

      <BySelections
        title="Instruments"
        icon="instrument"
        clickable={true}
        onClick={() => { headingClick('instrument') }}
        filters={filters.instrumentFilters}
        updateFilters={updateFilters}
      />
      
    </div>
  )
});
export default FiltersColumn;