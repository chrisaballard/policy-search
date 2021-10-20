import { useState, useEffect } from "react";
import { Geography } from '../../model/geography';
import TextExtract from "../blocks/TextExtract";
import { getCountryNameFromCode } from '../../helpers/geography';
import { ResultByPage } from "../../model/resultByPage";
import { ResultByDocument } from "../../model/resultByDocument";

interface SearchResultItemProps {
  policy: ResultByDocument;
  geographyList: Geography[];
  texts: ResultByPage[];
}

const SearchResultItem = ({policy, geographyList, texts}: SearchResultItemProps): JSX.Element => {
  const [ showExtracts, setShowExtracts ] = useState(false);
  const [ country, setCountry ] = useState('');
  const toggleExtracts = () => {
    setShowExtracts(!showExtracts);
  }
  const getCountryName = () => {
    if (policy.countryCode === 'EUE') {
      setCountry('European Union');
      return;
    }
    const name = getCountryNameFromCode(policy.countryCode, geographyList);
    setCountry(name);
  }
  
  useEffect(() => {
    getCountryName();
  }, [])
  return (
    <div>
      <div className="grid grid-cols-7 md:grid-cols-5 gap-x-4">
        <div className="col-span-5 md:col-span-4 pr-6">
          <h3 className="font-bold">{policy.policyName}</h3>
          
        </div>
        <div className="relative">
            <div className="absolute top-0 left-0 flex flex-col items-center w-full">
              <div className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
              <span className="text-xs text-center text-gray-500 mt-2">{country}</span>
            </div>
        </div>
      </div>
      <div className="text-sm mt-2 text-primary-dark-500">
      {texts.length > 0 ?
        <>
          <button
            onClick={toggleExtracts}
            className="font-bold focus:outline-none text-primary-light hover:text-primary transition duration-300"
          >
            {texts.length} page match{`${texts.length > 1 ? 'es' : ''}`} 
          </button> in this policy.
        </>
        : 
          <span className="">{texts.length} page matches.</span> 
        }
      </div>

      <div className={`${!showExtracts ? 'hidden' : ''}`}>
        {texts.map((item, index) => (
          <TextExtract
            key={`${index}_${item.pageNumber}`}
            texts={item.text}
            page={item.pageNumber}
            id={policy.policyId}
          />
        ))}
      </div>
    </div>
    
  )
}

export default SearchResultItem;