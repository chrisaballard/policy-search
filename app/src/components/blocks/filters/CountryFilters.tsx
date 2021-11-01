import { useState } from 'react';
import { CheckListIcon } from '../../elements/images/SVG';
import Circle from '../Circle';
import ByTextInput from './ByTextInput';
import StaticFilter from './StaticFilter';

const CountryFilters = ({ list, filters, updateFilters }) => {
  return (
    <div>
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