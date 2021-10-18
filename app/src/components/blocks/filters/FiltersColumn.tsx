import React from 'react';
import { Filters } from '../../../model/filters';
import { Geography } from "../../../model/geography";
import BySelections from './BySelections';
import ByTextInput from './ByTextInput';
 
interface FiltersProps {
  geographyList: Geography[];
  setProcessing(bool: boolean): void;
  updateFilters(action: string, type: string, name: string): void;
  headingClick(type: string): void;
  filters: Filters;
  removeFilters(): void;
  checkForFilters(): boolean;
}

const FiltersColumn = React.memo(({
  geographyList,
  setProcessing, 
  headingClick,
  updateFilters,
  filters,
  removeFilters,
  checkForFilters
}: FiltersProps) => {
  
  return (
    <div className="w-full md:w-1/4 md:pr-4 flex-shrink-0">
      <div className="flex justify-between border-b pb-2">
        <h2 className="font-bold text-xl">Filter by:</h2>
        {checkForFilters() ?
          <button className="hover:text-primary-light transition duration-300 focus:outline-none" onClick={removeFilters}>Clear Filters</button>
        :
          null
        }
        
      </div>
      

      <ByTextInput
        type="geography"
        list={geographyList}
        filters={filters.geographyFilters}
        setProcessing={setProcessing}
        updateFilters={updateFilters}
      />

      <BySelections
        type="sector"
        clickable={true}
        onClick={() => { headingClick('sector') }}
        filters={filters.sectorFilters}
        updateFilters={updateFilters}
      />

      <hr className="mt-6" />

      <BySelections
        type="instrument"
        clickable={true}
        onClick={() => { headingClick('instrument') }}
        filters={filters.instrumentFilters}
        updateFilters={updateFilters}
      />
      
    </div>
  )
});
export default FiltersColumn;