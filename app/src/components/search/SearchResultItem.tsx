import { useState } from "react";
import { Policy } from "../../model/policy";
import TextExtract from "../blocks/TextExtract";

interface SearchResultItemProps {
  policy: Policy
}

// temporary until api is merged

const texts = [
  {
    "pageNumber": 5,
    "policyName": "Iceland’s Climate Action Plan for 2018-2030 and 2020 update",
    "countryCode": "ISL",
    "sourceName": "cclw",
    "text": [
        "Tax incentives for clean <em>cars</em> and fuels 2.",
        "Support for infrastructure for <em>electric</em> <em>cars</em> and other clean vehicles 4.",
        "Building and spatial planning rules changes to support <em>electric</em> <em>cars</em> 5.",
        "Ban on new registration of diesel and gasoline <em>cars</em> after 2030 6.",
        "Rebate system for older polluting <em>cars</em> 7.",
        "Iceland already has in place generous temporary tax incentives for the purchase of <em>electric</em> <em>cars</em> and other clean vehicles.",
        "The government has allocated 210 million ISK in the years 20162018 to support the build-up of charging-stations for <em>electric</em> <em>cars</em>.",
        "Regulations will be reviewed to ensure that new buildings will be designed allowing for infrastructure for charging <em>electric</em> <em>cars</em>.",
        "New registration of diesel and gasoline <em>cars</em> will be unlawful after 2030.",
        "As new clean <em>cars</em> are gradually added to the vehicle fleet, the share of older high-polluting <em>cars</em> of emissions will grow.",
        "A system of rebates for decommissioning high-polluting <em>cars</em> may speed up their phase-out."
    ]
},
{
    "pageNumber": 6,
    "policyName": "Iceland’s Climate Action Plan for 2018-2030 and 2020 update",
    "countryCode": "ISL",
    "sourceName": "cclw",
    "text": [
        "Improved infrastructure for <em>electric</em> and regular bicycles 9.",
        "Clean <em>cars</em> in government and state enterprises B. CLEAN ENERGY TRANSFORMATION IN OTHER SECTORS 12.",
        "The plan will also consider charging stations for <em>electric</em> bikes.",
        "Government offices and state enterprises will be in the forefront of cleaning up transport, by buying <em>electric</em> <em>cars</em> or other non-emitting vehicles for their own use and providing charging stations and other infrastructure for them."
    ]
},
]
const SearchResultItem = ({policy}: SearchResultItemProps): JSX.Element => {
  const [ showExtracts, setShowExtracts ] = useState(false);
  const toggleExtracts = () => {
    setShowExtracts(!showExtracts);
  }
  return (
    <div>
      <div className="grid grid-cols-6 md:grid-cols-5 gap-x-4">
        <div className="col-span-4 md:col-span-3 pr-6">
          <h3 className="font-bold">{policy.policyName}</h3>
          
        </div>
        <div className="hidden md:block">
          {policy.sourceName}
        </div>
        <div className="relative">
            <div className="absolute top-0 left-0">
              <div className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
              <span className="text-xs text-gray-500">{policy.countryCode}</span>
            </div>
        </div>
      </div>
      <div className="text-black text-sm mt-2">
        <button
          onClick={toggleExtracts}
          className="font-bold focus:outline-none text-gray-500 hover:text-black transition duration-300"
        >
          {texts.length} matches 
        </button> in this policy.
      </div>

      <div className={`${!showExtracts ? 'hidden' : ''}`}>
        {texts.map((item) => (
          <TextExtract name={policy.policyName} text={item.text.join(',').replace(/\.\,/g, '. ')} />
        ))}
      </div>
    </div>
    
  )
}

export default SearchResultItem;