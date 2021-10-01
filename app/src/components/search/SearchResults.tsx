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
        Results for <span className="font-bold text-gray-500">"{query}"</span>:
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
        {policies.length ?
          <div className="grid grid-cols-6 gap-x-4 mt-8">
            <div className="font-bold col-span-3">Policy</div>
            <div className="font-bold">Type</div>
            <div className="font-bold">Source</div>
            <div className="font-bold">Country</div>
          </div>
        :
        null}
        
        <ul className="mt-4">
          {policies.map((policy, index) => (
            <li className={`py-4 px-2 rounded-lg text-gray-500 ${index%2 ? '' : 'bg-gray-100'}`} key={policy.policyId}>
              <SearchResultItem policy={policy} />
            </li>
        ))}
        </ul>
      </div>
    </section>
  )
}
export default SearchResults;