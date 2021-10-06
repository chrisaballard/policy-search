import { Geography } from "../../model/geography";
import { ResultByDocument } from "../../model/resultByDocument";
import Filters from "../blocks/Filters/Filters";
import SearchResultItem from "./SearchResultItem";

interface SearchResultsProps {
  policies: ResultByDocument[];
  geographies: Geography[];
  query: string;
  processing: boolean;
}
const SearchResults = ({
  policies,
  query,
  processing,
  geographies,
}: SearchResultsProps) => {
  const renderMessage = () => {
    if(!policies.length) {
      return (
      <div className="text-red-500 text-2xl text-center">
        There are no results for your query, please try a different search.
      </div>
      )
    }
    return (
      <div className="text-2xl  mt-6 md:mt-0">
        Results for <span className="font-bold text-gray-500">"{query}"</span>:
      </div>
    )
  }
  return (
    <section>
        <div className="w-full md:pl-4">
          {query.length ?
            <div className="mt-4">
              {query.length && !processing ? renderMessage() : null}
            </div>
            : null
          }
          {policies.length ?
            <div className="font-bold md:text-lg text-gray-500 grid grid-cols-6 md:grid-cols-5 gap-x-4 mt-8 border-gray-500 border-t border-b py-2">
              <div className="col-span-5 md:col-span-4">Policy</div>
              <div className="text-center">Country</div>
            </div>
          :
          null}
          
          <ul className="mt-4">
            {policies.map((policy, index) => (
              <li 
                className={`border-b border-gray-300 border-dotted last:border-none py-6 ${index%2 ? '' : ''}`}
                key={`${index}-${policy.policyId}`}
                id={`${index}-${policy.policyId}`}
              >
                <SearchResultItem policy={policy} geographies={geographies} texts={policy.resultsByPage} />
              </li>
          ))}
          </ul>
        </div>
    </section>
  )
}
export default SearchResults;