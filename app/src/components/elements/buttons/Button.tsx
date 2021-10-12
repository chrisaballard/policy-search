interface ButtonProps {
  onClick(event: React.FormEvent<HTMLButtonElement>): void;
  size?: string;
  children: any;
}

const Button = ({onClick, size, children}: ButtonProps): JSX.Element => {
  return (
    <button onClick={onClick} className={`focus:outline-black bg-black text-white hover:bg-gray-700 transition duration-300 rounded-lg px-4 py-2 ${size === 'small' ? 'text-sm' : ''}`}>{children}</button>
  )
}

export default Button;