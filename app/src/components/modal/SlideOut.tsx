const SlideOut = ({ active, onClick, children}) => {
  return (
    <div className={`absolute z-50 transition duration-300 transform mt-8 w-full md:w-1/2 rounded-l-xl bg-white p-8 ${active ? 'translate-x-full': 'translate-x-full200'}`}>
      <button onClick={onClick} className="absolute top-0 right-0 mt-8 mr-8" style={{ width: '30px', height: '30px'}}>
        <img src="/images/close.svg" alt="Close" />
      </button>
      {children}
    </div>
  )
}

export default SlideOut;