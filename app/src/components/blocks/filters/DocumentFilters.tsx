import ByRange from "./ByRange";
import StaticFilter from "./StaticFilter";


const DocumentFilters = ({ filters, replaceFiltersObj }) => {
  return (
    <div className="mt-4 divide-y divide-dotted">
      <div>
        <ByRange
          type="year"
          filters={filters.yearFilters}
          replaceFiltersObj={replaceFiltersObj}
          title="Year"
        />
      </div>
      <div className="pt-4">
        <StaticFilter title="Document Type" />
      </div>
      <div className="pt-4">
        <StaticFilter title="Language" />
      </div>
      <div className="pt-4">
        <StaticFilter title="Type (law, policy, action plan, NDC)" />
      </div>
    </div>
  )
}
export default DocumentFilters;