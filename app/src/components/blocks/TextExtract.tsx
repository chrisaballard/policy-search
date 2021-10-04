import Button from "../elements/buttons/Button";

interface TextExtractProps {
  text: string;
  page: number;
}

const TextExtract = ({ text, page }: TextExtractProps): JSX.Element => {
  const handleClick = (): void => {

  }
  return (
    <blockquote className="bg-gray-200 rounded-lg p-4 my-2">
      <div className="text-sm font-bold">Page {page}:</div>
      <p className="mt-2 text-sm text-gray-600" dangerouslySetInnerHTML={{__html: text}} />
      <div className="text-right mt-2">
        <Button onClick={handleClick} size="small" text="Go to page >" />
      </div>
    </blockquote>
  )
}
export default TextExtract;