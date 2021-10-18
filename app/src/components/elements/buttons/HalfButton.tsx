interface HalfButtonProps {
  children: string | JSX.Element;
  active: boolean;
  side: string;
  onClick(): void;
}

const HalfButton = ({ children, active, side, onClick }: HalfButtonProps) => {
  const cssClasses = `button-half px-4 ${active ? 'bg-primary' : 'focus:outline-none pointer-events-none bg-primary-dark-300 hover:bg-primary-dark-300'} ${side === 'left' ? 'rounded-l-lg border-r border-white' : 'rounded-r-lg'}`
  return (
    <button
      onClick={onClick}
      style={{height: '36px'}}
      className={cssClasses}
    >
      {children}
    </button>
  )
}

export default HalfButton;