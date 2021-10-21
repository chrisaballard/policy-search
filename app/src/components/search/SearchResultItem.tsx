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
    getCountryName();
  }, [])
  return (
    <div className="font-bold grid grid-cols-8 md:grid-cols-6 gap-x-4 md:py-2">
      <div className="col-span-5 sm:col-span-6 md:col-span-4 flex items-center">
        <div className="mr-4">
          <div style={{ width: '28px', height: '21px' }} className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
        </div>
        <div className="leading-tight">
          {policy.policyName}
          <div className="md:hidden w-full mt-2 font-normal text-primary-dark-500">2021</div>
        </div>
        
      </div>
      <div className="hidden md:block text-center font-normal text-primary-dark-500">2021</div>
      <div className="col-span-3 sm:col-span-2 md:col-span-1">
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
          <a href={`policy.url`} target="_blank" rel="noopener noreferrer" className="ml-4 flex flex-col justify-center items-center">
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
    
  )
}

export default SearchResultItem;