const Loader = () => {
  return (
    <>
      <div className="flex items-start justify-center">
        {/* <img src="/images/loader.svg" style={{ width: '100px'}} /> */}
        <object className="radar" type="image/svg+xml" data="/images/radar-loader.svg" style={{width: '80px'}}></object>
      </div>
      
    </>
  )
}

export default Loader;