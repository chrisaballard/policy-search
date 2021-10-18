import React from 'react';
import { Filters } from '../../../model/filters';
import { Geography } from "../../../model/geography";
import BySelections from './BySelections';
import ByTextInput from './ByTextInput';
 
interface FiltersProps {
  geographyList: Geography[];
  newSearch(searchQuery: string): void;
  setProcessing(bool: boolean): void;
  updateFilters(action: string, type: string, name: string): void;
  headingClick(type: string): void;
  filters: Filters;
}

const FiltersColumn = React.memo(({
  geographyList,
  newSearch, 
  setProcessing, 
  headingClick,
  updateFilters,
  filters
}: FiltersProps) => {
  
  return (
    <div className="w-full md:w-1/4 md:pr-4 flex-shrink-0">
      <h2 className="font-bold mb-4 border-b pb-2">Filter by:</h2>

      <ByTextInput
        type="geography"
        list={geographyList}
        filters={filters.geographyFilters}
        newSearch={newSearch}
        setProcessing={setProcessing}
        updateFilters={updateFilters}
      />

      <BySelections
        type="sector"
        clickable={true}
        onClick={() => { headingClick('sector') }}
        filters={filters.sectorFilters}
        newSearch={newSearch}
        updateFilters={updateFilters}
      />

      <hr className="mt-6" />

      <BySelections
        type="instrument"
        clickable={true}
        onClick={() => { headingClick('instrument') }}
        filters={filters.instrumentFilters}
        newSearch={newSearch}
        updateFilters={updateFilters}
      />
      
    </div>
  )
});
export default FiltersColumn;