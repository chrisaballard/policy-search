import Close from "../elements/buttons/Close";

const SlideOut = ({ active, onClick, children}) => {
  return (
    <div className={`absolute top-0 left-0 transition duration-500 z-50 transform w-full ${active ? 'translate-x-0': 'translate-x-full'}`}>
      <div className={`absolute top-0 right-0 min-h-screen w-full md:w-2/3 2xl:w-1/2 md:mt-8 md:rounded-tl-xl bg-white p-4 pt-10 md:p-8`}>
        <div className="absolute top-0 right-0 mt-8 mr-8">
          <Close onClick={onClick} size="30" />
        </div>
        {children}
      </div>
    </div>
    
  )
}

export default SlideOut;