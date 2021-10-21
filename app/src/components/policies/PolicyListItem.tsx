import { Policy } from "../../model/policy";
import { Geography } from "../../model/geography";
import { PDFIcon, TextIcon } from '../elements/images/SVG';
import Link from 'next/link'
import Circle from "../blocks/Circle";

interface PolicyItemProps {
  policy: Policy;
  geographyList: Geography[];
}

const PolicyListItem = ({ policy, geographyList }: PolicyItemProps) => {
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
      <div>
        <div className="flex">
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
              title="Read Text"
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