import BySelections from "./BySelections";
import StaticFilter from "./StaticFilter";

const PassageFilters = ({onClick, filters, updateFilters}) => {
  return (
    <div className="mt-4">
      <BySelections 
        type="sector"
        onClick={() => { onClick('sector')}}
        filters={filters.sectorFilters}
        updateFilters={updateFilters}
        title="Sector"
      />
      <BySelections 
        type="instrument"
        onClick={() => { onClick('instrument')}}
        filters={filters.instrumentFilters}
        updateFilters={updateFilters}
        title="Instrument"
      />
      <StaticFilter title="Targets" />
      <StaticFilter title="Technologies" />
      <StaticFilter title="Core needs" />
      <StaticFilter title="Enablers" />
    </div>
  )
}
export default PassageFilters;