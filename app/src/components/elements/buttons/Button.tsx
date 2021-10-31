interface ButtonProps {
  onClick?(event: React.FormEvent<HTMLButtonElement>): void;
  size?: string;
  children: any;
  color?: string;
}

const Button = ({onClick, size, children, color}: ButtonProps): JSX.Element => {
  return (
    <button onClick={onClick} className={`button focus:outline-dottedblue px-4 py-2 ${color ? color : 'bg-primary'} ${size === 'small' ? 'text-sm' : ''}`}>{children}</button>
  )
}

export default Button;