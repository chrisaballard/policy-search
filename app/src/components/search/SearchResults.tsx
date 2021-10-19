import { Geography } from "../../model/geography";
import { ResultByDocument } from "../../model/resultByDocument";
import SearchResultItem from "./SearchResultItem";
import Loader from '../../components/Loader';
import { SearchNavigation } from ".";

interface SearchResultsProps {
  policies: ResultByDocument[];
  geographyList: Geography[];
  processing: boolean;
  searchTerms: string;
  handleNavigation(): void;
  endOfList: boolean;
}
const SearchResults = ({
  policies,
  processing,
  geographyList,
  searchTerms,
  handleNavigation,
  endOfList
}: SearchResultsProps) => {

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
        Results for <span className="font-bold">"{searchTerms}"</span>:
      </div>
    )
  }
  return (
    <section className="w-full">
        <div className="md:pl-4">
          {searchTerms.length ?
            <div className="mt-4">
              {searchTerms.length && !processing ? renderMessage() : null}
            </div>
            : null
          }
          {policies.length ?
            <>
              <div className="font-bold md:text-lg grid grid-cols-7 md:grid-cols-5 gap-x-4 mt-8 border-primary border-t border-b py-2">
                <div className="col-span-5 md:col-span-4">Policy</div>
                <div className="text-center">Country</div>
              </div>
              <ul className="mt-4">
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
          null}
          {processing ? 
            <Loader />
            : null
          }
        </div>
        {!endOfList ?
          <SearchNavigation onClick={handleNavigation} />
          : null
          }
    </section>
  )
}
export default SearchResults;