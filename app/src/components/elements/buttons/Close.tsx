
interface CloseProps {
  onClick(event: React.FormEvent<HTMLButtonElement>): void;
}

const Close = ({ onClick }) => {
  return (
    <button
      className="px-2"
      onClick={onClick}
    >
      <img 
        src="/images/close.svg" 
        alt="Close icon"
        className="page-close"
     />
    </button>
  )
}
export default Close;