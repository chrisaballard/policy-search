import { Policy } from "../../model/policy";

interface SearchResultItemProps {
  policy: Policy
}
const SearchResultItem = ({policy}: SearchResultItemProps): JSX.Element => {
  return (
    <div className="grid grid-cols-6 gap-x-4">
      <a
        className="text-gray-600 hover:text-black underline transition duration-300 col-span-3 pr-6"
        href={policy.url}
        target="_blank" 
        rel="noopener noreferrer">
          {policy.policyName}
      </a>
      <div>
        {policy.policyType}
      </div>
      <div>
        {policy.sourceName}
      </div>
      <div>
        {policy.countryCode}
      </div>
    </div>
  )
}

export default SearchResultItem;