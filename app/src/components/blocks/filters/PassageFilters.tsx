import BySelections from "./BySelections";
import StaticFilter from "./StaticFilter";

const PassageFilters = ({onClick, filters, updateFilters}) => {
  return (
    <div className="mt-4 divide-y divide-dotted">
      <div>
        <BySelections 
          type="sector"
          onClick={() => { onClick('sector')}}
          filters={filters.sectorFilters}
          updateFilters={updateFilters}
          title="Sector"
        />
      </div>
      <div className="pt-4">
        <BySelections 
          type="instrument"
          onClick={() => { onClick('instrument')}}
          filters={filters.instrumentFilters}
          updateFilters={updateFilters}
          title="Instrument"
        />
      </div>
      <div className="pt-4">
        <StaticFilter title="Targets" />
      </div>
      <div className="pt-4">
        <StaticFilter title="Targets" />
      </div>
      <div className="pt-4">
        <StaticFilter title="Technologies" />
      </div>
      <div className="pt-4">
        <StaticFilter title="Core needs" />
      </div>
      <div className="pt-4">
        <StaticFilter title="Enablers" />
      </div>
    </div>
  )
}
export default PassageFilters;