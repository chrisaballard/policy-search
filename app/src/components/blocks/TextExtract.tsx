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

      <div className="flex justify-between items-center mt-4">
        <div>
          <button className="hover:text-primary-light focus:outline-none" onClick={() => { setVoteState('yes')}}>
            <UpvoteIcon width="20" height="20" color={`${voteState === 'yes' ? '#1f93ff' : 'currentColor'}`}  />
          </button>
          <button className="hover:text-primary-light ml-2 focus:outline-none" onClick={() => { setVoteState('no')}}>
            <DownvoteIcon width="20" height="20" color={`${voteState === 'no' ? '#1f93ff' : 'currentColor'}`} />
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