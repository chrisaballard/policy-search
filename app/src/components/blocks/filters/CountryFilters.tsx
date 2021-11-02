import { useState } from 'react';
import ByTextInput from './ByTextInput';
import StaticFilter from './StaticFilter';

const CountryFilters = ({ list, filters, updateFilters }) => {
  return (
    <div className="mt-4 divide-y divide-dotted">
      <div>
        <ByTextInput
          title="Geography"
          list={list}
          filters={filters}
          updateFilters={updateFilters}
          type="geography"
        />
      </div>
      <div className="pt-4">
        <StaticFilter title="Income group" />
      </div>
      <div className="pt-4">
        <StaticFilter title="Political groupings" />
      </div>
    </div>
    
  )
}
export default CountryFilters;