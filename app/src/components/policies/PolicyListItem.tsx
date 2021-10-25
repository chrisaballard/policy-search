import { useState, useEffect } from "react";
import { Policy } from "../../model/policy";
import { Geography } from "../../model/geography";
import { PDFIcon, TextIcon } from '../elements/images/SVG';
import { getCountryNameFromCode } from '../../helpers/geography';
import Link from 'next/link'
import Circle from "../blocks/Circle";

interface PolicyItemProps {
  policy: Policy;
  geographyList: Geography[];
}

const PolicyListItem = ({ policy, geographyList }: PolicyItemProps) => {
  const [ country, setCountry ] = useState('');
  
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
    <div className="font-bold grid grid-cols-8 md:grid-cols-9 gap-x-4 md:py-2">
      <div className="col-span-1 mr-4 hidden md:block">
        <div className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
        <div className="font-normal text-xs text-primary-dark-500 mt-2 leading-tight">{country}</div>
      </div>
      <div className="col-span-5 sm:col-span-6 md:col-span-5 flex items-start">
        <div className="leading-tight">
          {policy.policyName}
          <div className="md:hidden w-full mt-2 font-normal text-primary-dark-500">2021</div>
        </div>
        
      </div>
      <div className="hidden md:block text-center font-normal text-primary-dark-500 md:col-span-2">2021</div>
      <div className="col-span-3 sm:col-span-2 md:col-span-1">
        <div className="md:hidden mb-6 flex flex-col justify-self-end items-end">
          <div className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
          <div className="font-normal text-xs text-right text-primary-dark-500 mt-2 leading-tight">{country}</div>
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
  )
}
export default PolicyListItem;