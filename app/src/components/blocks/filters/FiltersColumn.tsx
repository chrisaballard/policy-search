import React, { useState } from 'react';
import { Filters } from '../../../model/filters';
import { Geography } from "../../../model/geography";
import Close from '../../elements/buttons/Close';
import { FiltersIcon } from '../../elements/images/SVG';
import Circle from '../Circle';
import ByRange from './ByRange';
import BySelections from './BySelections';
import ByTextInput from './ByTextInput';
import CountryFilters from './CountryFilters';
import Country from './CountryFilters';
import DocumentFilters from './DocumentFilters';
import Document from './DocumentFilters';
import FilterSection from './FilterSection';
import PassageFilters from './PassageFilters';
import Passage from './PassageFilters';
 
interface FiltersProps {
  geographyList: Geography[];
  updateFilters(action: string, type: string, name: string): void;
  headingClick(type: string): void;
  filters: Filters;
  removeFilters(): void;
  checkForFilters(): boolean;
  replaceFiltersObj(type: string, obj: Object): void;
}

const FiltersColumn = React.memo(({
  geographyList,
  headingClick,
  updateFilters,
  filters,
  removeFilters,
  checkForFilters,
  replaceFiltersObj,
}: FiltersProps) => {
  const [ visible, setVisible ] = useState(false);
  const renderButton = () => {
    // Show/hide filters toggle for mobile view
    if(visible) {
      return (
        <div className="flex items-center justify-center h-8">
          <Close onClick={ () => { setVisible(false)}} />
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center">
        <Circle title="Show Filters" bgClass="bg-primary-light" textClass="text-white">
          <button onClick={() => { setVisible(!visible)}} className="block mx-auto pointer-events-auto" title="Filter">
            <FiltersIcon height="30" width="30" />
          </button>
        </Circle>
      </div>
    )
  }
  return (
    <>
      <div className="absolute top-0 left-0 w-full md:hidden z-30 pointer-events-none">
        {renderButton()}
      </div>
      <div className={`${visible ? 'translate-x-0' : 'transform -translate-x-full -ml-12'} md:ml-0 left-0 top-0 absolute z-20 bg-white min-h-screen md:min-h-auto px-4 md:static transition duration-300 md:translate-x-0 w-full md:w-1/4 md:pl-0 md:pr-4 flex-shrink-0`}>
        <div className="flex justify-between border-b pb-2">
          <h2 className="font-bold text-xl">Filter by:</h2>
          {checkForFilters() ?
            <button className="hover:text-primary-light transition duration-300 focus:outline-none" onClick={removeFilters}>Clear Filters</button>
          :
            null
          }
          
        </div>
        
        <FilterSection
          type="country"
          title="Country"
        >
          <CountryFilters 
            list={geographyList}
            filters={filters.geographyFilters}
            updateFilters={updateFilters}
          />
        </FilterSection>

        <hr className="mt-6" />

        <FilterSection
          type="document"
          title="Document Level"
        >
          <DocumentFilters />
        </FilterSection>

        <hr className="mt-6" />

        <FilterSection
          type="passage"
          title="Passage Level"
        >
          <PassageFilters />
        </FilterSection>


        {/* <ByTextInput
          type="geography"
          list={geographyList}
          filters={filters.geographyFilters}
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

        <hr className="mt-6" />

        <ByRange
          type="years"
          clickable={false}
          filters={filters.yearFilters}
          replaceFiltersObj={replaceFiltersObj}
        /> */}
        
      </div>
    </>
  )
});
export default FiltersColumn;