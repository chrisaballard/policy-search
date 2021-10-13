interface OverlayProps {
  active: boolean;
  children?: JSX.Element | string;
}

const Overlay = ({active, children}: OverlayProps): JSX.Element => {
  return (
    <div className={`bg-black fixed inset-0 z-40 transition-all duration-700 ${active ? 'bg-opacity-50 visible' : 'bg-opacity-0 invisible'}`}>
      {children}
    </div>
  )
}

export default Overlay;