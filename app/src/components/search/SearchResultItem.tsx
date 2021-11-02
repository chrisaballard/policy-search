import { useState, useEffect } from "react";
import { Geography } from '../../model/geography';
import TextExtract from "../blocks/TextExtract";
import { getCountryNameFromCode } from '../../helpers/geography';
import { ResultByPage } from "../../model/resultByPage";
import { ResultByDocument } from "../../model/resultByDocument";
import { PDFIcon, TextIcon } from '../elements/images/SVG';
import Link from 'next/link'
import Circle from "../blocks/Circle";

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
    if(geographyList.length && policy.countryCode.length) {
      getCountryName();
    }
  }, [geographyList, policy])
  return (
    <>
    <div className="font-bold grid grid-cols-8 md:grid-cols-9 gap-x-4 md:py-2">
      <div className="col-span-1 mr-4 hidden md:block">
        <div className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
        <div className="font-normal text-xs text-primary-dark-500 mt-2 leading-tight">{country}</div>
      </div>
      <div className="col-span-5 sm:col-span-6 md:col-span-5 md:pl-2 flex items-start">
        <div className="leading-tight">
          {policy.policyName}
          <div className="md:hidden w-full mt-2 font-normal text-primary-dark-500">{policy?.policyDate?.substr(policy?.policyDate?.length - 4)}</div>

          <div className="font-normal text-sm mt-2 text-primary-dark-400">
          {texts?.length > 0 ?
            <>
              <button
                onClick={toggleExtracts}
                className="focus:outline-none underline text-primary-dark-600 hover:text-primary-light transition duration-300"
              >
                Top {texts.length > 1 ? texts.length : ''} page match{`${texts.length > 1 ? 'es' : ''}`} 
              </button> in this policy.
            </>
            : 
              null
            }
          </div>

        </div>
      </div>
      <div className="hidden md:block text-center font-normal text-primary-dark-500 md:col-span-2">{policy?.policyDate?.substr(policy?.policyDate?.length - 4)}</div>
      <div className="col-span-3 sm:col-span-2 md:col-span-1">
        <div className="md:hidden mb-6 flex flex-col items-end">
          <div className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
          <div className="font-normal text-xs text-primary-dark-500 mt-2 leading-tight">{country}</div>
        </div>
        <div className="flex justify-end">
          <Link href={`/policy/${policy.policyId}?page=1`}>
            <a href={``} className="flex flex-col justify-center items-center">
              <span className="sr-only">Read text</span>
              <Circle
                title="Read Text"
                bgClass="bg-secondary-3"
                textClass="text-white"
              >
                <TextIcon height="16" width="16" />
              </Circle>
            </a>
          </Link> 
          <a href={policy.url} target="_blank" rel="noopener noreferrer" className="ml-4 flex flex-col justify-center items-center">
            <span className="sr-only">View PDF</span>
            <Circle
              title="View PDF"
              bgClass="bg-secondary-4"
              textClass="text-white"
            >
              <PDFIcon height="16" width="16" />
            </Circle>
            
          </a>
        </div>
        
      </div>
      
    </div>
    

    <div className={`${!showExtracts ? 'hidden' : ''}`}>
      {texts?.map((item, index) => (
        <TextExtract
          key={`${index}_${item.pageNumber}`}
          texts={item.text}
          page={item.pageNumber}
          id={policy.policyId}
        />
      ))}
    </div>
    
    </>
  )
}

export default SearchResultItem;