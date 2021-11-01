import ByRange from "./ByRange";
import StaticFilter from "./StaticFilter";


const DocumentFilters = ({ filters, replaceFiltersObj }) => {
  return (
    <div className="mt-4">
      
      <ByRange
        type="year"
        filters={filters.yearFilters}
        replaceFiltersObj={replaceFiltersObj}
        title="Year"
      />
      <StaticFilter title="Document Type" />
      <StaticFilter title="Language" />
      <StaticFilter title="Type (law, policy, action plan, NDC)" />
    </div>
  )
}
export default DocumentFilters;