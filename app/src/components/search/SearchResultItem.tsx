import { Policy } from "../../model/policy";

interface SearchResultItemProps {
  policy: Policy
}
const SearchResultItem = ({policy}: SearchResultItemProps) => {
  return (
    <div>
      <a
        className="text-gray-600 hover:text-black underline transition duration-300"
        href={policy.url}
        target="_blank" 
        rel="noopener noreferrer">
          {policy.policyName}
      </a>
    </div>
  )
}

export default SearchResultItem;