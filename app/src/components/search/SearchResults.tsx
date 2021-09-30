import { Policy } from "../../model/policy";
import SearchResultItem from "./SearchResultItem";

interface SearchResultsProps {
  policies: Policy[];
  query: string;
  processing: boolean;
}
const SearchResults = ({policies, query, processing}: SearchResultsProps) => {
  const renderMessage = () => {
    if(!policies.length) {
      return (
      <div className="text-red-500 text-2xl text-center">
        There are no results for your query, please try a different search.
      </div>
      )
    }
    return (
      <div className="text-2xl">
        <span className="text-gray-400">{policies.length}</span> results for <span className="font-bold font-italic">"{query}"</span>
      </div>
    )
  }
  return (
    <section>
      <div className="container">

        {query.length ?
          <div className="mt-4">
            {query.length && !processing ? renderMessage() : null}
          </div>
          : null
        }
        
        <ul className="mt-8">
          {policies.map((policy) => (
            <li className="mb-4" key={policy.policyId}>
              <SearchResultItem policy={policy} />
            </li>
        ))}
        </ul>
      </div>
    </section>
  )
}
export default SearchResults;