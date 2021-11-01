import { Geography } from "../../model/geography";
import { ResultByDocument } from "../../model/resultByDocument";
import SearchResultItem from "./SearchResultItem";
import { Policy } from '../../model/policy';
import Button from "../elements/buttons/Button";

interface SearchResultsProps {
  policies: ResultByDocument[] | Policy[];
  geographyList: Geography[];
  processing: boolean;
  searchTerms: string;
  checkForFilters(): boolean;
}
const SearchResults = ({
  policies,
  processing,
  geographyList,
  searchTerms,
  checkForFilters,
}: SearchResultsProps) => {

  const renderMessage = () => {
    if(searchTerms?.length && policies.length) {
      return (
        <div className="text-2xl  mt-6 md:mt-0 pr-4">
          Results for <span className="font-bold">"{searchTerms}"</span>:
          <br/>
          <p className="mt-2 italic text-base leading-tight text-primary-dark-600">We're also showing results containing terms related to your query.</p>
        </div>
      )
    }
    if(!policies.length && searchTerms?.length || !policies.length && checkForFilters()) {
      return (
      <div className="text-red-500 text-2xl">
        There are no results for your query, please try a different search.
      </div>
      )
    }
    else {
      return (
        <div className="text-center md:text-left text-2xl mt-6 md:mt-0">
          Latest Policies:
        </div>
      )
    }
  }
  return (
    <section className="w-full">
        <div className="pt-8 md:pt-0 md:pl-4">
          <div className="md:flex justify-between items-center">
            {!processing ?
              renderMessage()
            :
            null}
            {!processing && policies.length ?
            <div className="mt-4 flex justify-center lg:w-1/4 flex-shrink-0">
              <Button>Download results</Button>
            </div>
            :
            null }
          </div>
        
          
            {policies.length ? 
              <>
                <div className="font-bold grid grid-cols-8 md:grid-cols-9 gap-x-6 mt-8 border-primary border-t border-b py-2">
                  <div className="col-span-1 hidden md:block">Country</div>
                  <div className="col-span-5 sm:col-span-6 md:col-span-5 md:pl-2">Policy</div>
                  <div className="text-center hidden md:block md:col-span-2">Year</div>
                  <div className="text-center col-span-3 sm:col-span-2 md:col-span-1">More</div>
                </div>
                <ul className="mt-2">
                  {policies.map((policy, index) => (
                    <li 
                      className="search-result border-b border-gray-300 border-dotted last:border-none py-6"
                      key={`${index}-${policy.policyId}`}
                      id={`${index}-${policy.policyId}`}
                    >
                      <SearchResultItem policy={policy} geographyList={geographyList} texts={policy.resultsByPage} />
                    </li>
                  ))}
                </ul>
              </>
            :
              null
            }
            
        </div>
    </section>
    
  )
}
export default SearchResults;