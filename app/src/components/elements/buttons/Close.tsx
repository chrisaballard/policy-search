
interface CloseProps {
  onClick(event: React.FormEvent<HTMLButtonElement>): void;
  size?: string;
}

const Close = ({ onClick, size = '20' }) => {
  return (
    <button
      onClick={onClick}
      style={{
        height: `${size}px`,
        width: `${size}px`
      }}
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