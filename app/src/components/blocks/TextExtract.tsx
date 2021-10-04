import { useState, useEffect } from 'react';
import Button from "../elements/buttons/Button";

interface TextExtractProps {
  texts: string[];
  page: number;
}

const TextExtract = ({ texts, page }: TextExtractProps): JSX.Element => {
  const [ textsSummary, setTextsSummary ] = useState([]);
  const handleClick = (): void => {

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
    <blockquote className="bg-gray-200 rounded-lg p-4 my-2">
      <div className="text-sm font-bold">Page {page}:</div>
        {textsSummary.map((text) => (
          <p className="mt-4 text-sm text-gray-600" dangerouslySetInnerHTML={{__html: text}} />
        ))}
        {texts.length > 3 ? 
          <p className="text-sm mt-4 text-gray-400 italic">Showing first {textsSummary.length} of {texts.length} sentence matches on this page.</p>
          :
          <p className="text-sm mt-4 text-gray-400 italic">{textsSummary.length} sentence match{`${textsSummary.length > 1 ? 'es' : ''}`} on this page.</p>
        }
        
      <div className="text-right mt-2">
        <Button onClick={handleClick} size="small" text="Go to page >" />
      </div>
    </blockquote>
  )
}
export default TextExtract;