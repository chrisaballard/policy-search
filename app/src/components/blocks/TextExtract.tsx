import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UpvoteIcon, DownvoteIcon } from '../elements/images/SVG';

interface TextExtractProps {
  texts: string[];
  page: number;
  id: number;
}

const TextExtract = ({ texts, page, id }: TextExtractProps): JSX.Element => {
  const [ textsSummary, setTextsSummary ] = useState([]);
  const [ voteState, setVoteState ] = useState(null);
  const renderSummary = () => {
    if(texts.length > 3) {
      return (
        <span>Showing first {textsSummary.length} of {texts.length} sentence matches on this page.</span>
      )
    }
    return (
      <span>{textsSummary.length} sentence match{`${textsSummary.length > 1 ? 'es' : ''}`} on this page.</span>
    )
  }
  const trimTexts = () => {
    const newArr = [];
    texts.map((text, index) => {
      if(index < 3 && text) {
        newArr.push(text)
      }
    })
    setTextsSummary(newArr)
  }
  useEffect(() => {
    trimTexts();
  }, [])
  return (
    <blockquote className="bg-primary-dark-200 rounded-lg p-4 my-2">
      {textsSummary.map((text, index) => (
        <p className="mt-4 text-sm text-primary-dark-600" key={`txt_${index}`} dangerouslySetInnerHTML={{__html: text}} />
      ))}
        
        <p className="text-sm mt-4 text-primary-dark-400 italic">{renderSummary()}</p>

      <div className="text-right md:text-left md:flex justify-between items-center mt-4">
        <div className="mb-2 md:mb-0">
          <button className="text-primary-dark-500 hover:text-primary focus:outline-none" onClick={() => { setVoteState('yes')}}>
            <UpvoteIcon width="20" height="20" color={`${voteState === 'yes' ? '#3CD1A9' : 'currentColor'}`}  />
          </button>
          <button className="text-primary-dark-500 hover:text-primary ml-2 focus:outline-none" onClick={() => { setVoteState('no')}}>
            <DownvoteIcon width="20" height="20" color={`${voteState === 'no' ? '#F86F5C' : 'currentColor'}`} />
          </button>
          <p className="text-xs">Is this result helpful?</p>
        </div>
        
        
        <Link href={`/policy/${id}?page=${page}`}>
          <a className="button text-sm inline-block py-2 px-6">
            Go to page &raquo;
          </a>
        </Link>
      </div>
    </blockquote>
  )
}
export default TextExtract;