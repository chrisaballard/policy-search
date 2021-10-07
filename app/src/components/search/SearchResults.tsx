import { getParameterByName } from "../../helpers/queryString";
import { Geography } from "../../model/geography";
import { ResultByDocument } from "../../model/resultByDocument";
import Filters from "../blocks/Filters/Filters";
import SearchResultItem from "./SearchResultItem";
import { API_BASE_URL } from '../../constants';

interface SearchResultsProps {
  policies: ResultByDocument[];
  geographies: Geography[];
  searchQuery: string;
  processing: boolean;
}
const SearchResults = ({
  policies,
  searchQuery,
  processing,
  geographies,
}: SearchResultsProps) => {
  const extractSearchTerms = () => {
    return getParameterByName('query', `${API_BASE_URL}/policies/search?${searchQuery}`)
  }
  const renderMessage = () => {
    if(!policies.length) {
      return (
      <div className="text-red-500 text-2xl">
        There are no results for your query, please try a different search.
      </div>
      )
    }
    return (
      <div className="text-2xl  mt-6 md:mt-0">
        Results for <span className="font-bold text-gray-500">"{extractSearchTerms()}"</span>:
      </div>
    )
  }
  return (
    <section className="w-full">
        <div className="md:pl-4">
          {searchQuery.length ?
            <div className="mt-4">
              {searchQuery.length && !processing ? renderMessage() : null}
            </div>
            : null
          }
          {policies.length ?
            <>
              <div className="font-bold md:text-lg text-gray-500 grid grid-cols-7 md:grid-cols-5 gap-x-4 mt-8 border-gray-500 border-t border-b py-2">
                <div className="col-span-5 md:col-span-4">Policy</div>
                <div className="text-center">Country</div>
              </div>
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
            </>
          :
          null}
          
          
        </div>
    </section>
  )
}
export default SearchResults;