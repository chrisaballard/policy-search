interface ButtonProps {
  text: string;
  onClick(event: React.FormEvent<HTMLButtonElement>): void;
  size?: string;
}

const Button = ({text, onClick, size}: ButtonProps): JSX.Element => {
  return (
    <button onClick={onClick} className={`focus:outline-black bg-black text-white hover:bg-gray-700 transition duration-300 rounded px-4 py-2 ${size === 'small' ? 'text-sm' : ''}`}>{text}</button>
  )
}

export default Button;