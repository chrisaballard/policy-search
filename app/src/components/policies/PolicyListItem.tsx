import { useState, useEffect } from "react";
import { Policy } from "../../model/policy";
import { Geography } from "../../model/geography";
import { DownloadPDF, TextIcon } from '../elements/images/SVG';
import Link from 'next/link'

interface PolicyItemProps {
  policy: Policy;
  geographyList: Geography[];
}

const PolicyListItem = ({ policy, geographyList }: PolicyItemProps) => {
  return (
    <div className="font-bold grid grid-cols-8 md:grid-cols-6 gap-x-4 py-2">
      <div className="col-span-5 md:col-span-4 flex items-center">
        <div className="mr-4">
          <div style={{ width: '28px', height: '21px' }} className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
        </div>
        <div className="leading-tight">{policy.policyName}</div>
      </div>
      <div className="text-center text-primary-light">2019</div>
      <div>
        <div className="flex">
          <Link href={`/policy/${policy.policyId}?page=1`}>
            <a href={``} className="text-primary hover:text-primary-light transition duration-300 flex flex-col justify-center items-center">
              <span className="sr-only">Read text</span>
              <TextIcon height="20" width="20" />
              <span className="font-normal text-xs text-primary-dark-500">Text</span>
            </a>
          </Link> 
          <a href={policy.url} target="_blank" rel="noopener noreferrer" className="ml-4 text-primary hover:text-primary-light transition duration-300 flex flex-col justify-center items-center">
            <span className="sr-only">Download PDF</span>
            <DownloadPDF height="20" width="20" />
            <span className="font-normal text-xs text-primary-dark-500">PDF</span>
          </a>
        </div>
      </div>
    </div>
  )
}
export default PolicyListItem;