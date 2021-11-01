import { useState } from 'react';
import ByTextInput from './ByTextInput';
import StaticFilter from './StaticFilter';

const CountryFilters = ({ list, filters, updateFilters }) => {
  return (
    <div className="mt-4">
      <label className="text-sm block mt-2">Geography</label>
      <ByTextInput
        list={list}
        filters={filters}
        updateFilters={updateFilters}
        type="geography"
      />
      <StaticFilter title="Income group" />
      <StaticFilter title="Political groupings" />
      
    </div>
    
  )
}
export default CountryFilters;