import { Geography } from "../../model/geography";
import { Policies } from "../../model/policies";
import PolicyListItem from "./PolicyListItem";

interface PolicyListProps {
  policy_db: Policies;
  geographyList: Geography[];
  processing: boolean;
}

const PolicyList = ({ policy_db, geographyList, processing }: PolicyListProps) => {
  const { policies } = policy_db;
  return (
    <section className="w-full">
        <div className="pt-8 md:pt-0 md:pl-4">
          <h2 className="text-2xl font-bold leading-tight">Policies</h2>
          
            {policies.length ? 
              <>
                <div className="font-bold grid grid-cols-8 md:grid-cols-9 gap-x-4 mt-8 border-primary border-t border-b py-2">
                  <div className="col-span-1 hidden md:block">Country</div>
                  <div className="col-span-5 sm:col-span-6 md:col-span-5">Policy</div>
                  <div className="text-center hidden md:block md:col-span-2">Year</div>
                  <div className="text-center col-span-3 sm:col-span-2 md:col-span-1">More</div>
                </div>
                <ul className="mt-4">
                  {policies.map((policy, index) => (
                    <li 
                      className="search-result border-b border-gray-300 border-dotted last:border-none py-6"
                      key={`${index}-${policy.policyId}`}
                      id={`${index}-${policy.policyId}`}
                    >
                      <PolicyListItem policy={policy} geographyList={geographyList} />
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
export default PolicyList;