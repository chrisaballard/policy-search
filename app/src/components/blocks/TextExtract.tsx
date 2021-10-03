import Button from "../elements/buttons/Button";

interface TextExtractProps {
  name: string;
  text: string;
}

const TextExtract = ({ name, text }: TextExtractProps): JSX.Element => {
  const handleClick = (): void => {

  }
  return (
    <blockquote className="bg-gray-200 rounded-lg p-4 my-2">
      <span className="text-sm text-gray-600" dangerouslySetInnerHTML={{__html: text}} />
      <div className="text-right mt-2">
        <Button onClick={handleClick} size="small" text="Go to page >" />
      </div>
    </blockquote>
  )
}
export default TextExtract;