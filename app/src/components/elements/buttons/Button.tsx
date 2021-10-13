interface ButtonProps {
  onClick(event: React.FormEvent<HTMLButtonElement>): void;
  size?: string;
  children: any;
}

const Button = ({onClick, size, children}: ButtonProps): JSX.Element => {
  return (
    <button onClick={onClick} className={`button focus:outline-primary-dark px-4 py-2 ${size === 'small' ? 'text-sm' : ''}`}>{children}</button>
  )
}

export default Button;