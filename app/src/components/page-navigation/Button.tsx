interface ButtonProps {
  text: string;
  onClick(): void;
}

const Button = ({text, onClick}: ButtonProps) => {
  return (
    <button onClick={onClick} className="bg-gray-200 rounded px-4 py-2">{text}</button>
  )
}

export default Button;