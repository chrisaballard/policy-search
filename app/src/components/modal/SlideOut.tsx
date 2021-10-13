const SlideOut = ({ active, onClick, children}) => {
  return (
    <div className={`absolute top-0 left-0 w-full transition duration-300 z-50 transform ${active ? 'translate-x-0': 'translate-x-full'}`}>
      <div className={`absolute top-0 right-0 min-h-screen w-full md:w-1/2 lg:w-2/3 md:mt-8 md:rounded-tl-xl bg-white p-8 pt-20`}>
        <button onClick={onClick} className="absolute top-0 right-0 mt-8 mr-8" style={{ width: '30px', height: '30px'}}>
          <img src="/images/close.svg" alt="Close" />
        </button>
        {children}
      </div>
    </div>
    
  )
}

export default SlideOut;