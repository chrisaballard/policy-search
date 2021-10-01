import { useRef, useEffect } from 'react';
import { setUpLoader } from '../helpers/svg-loader';

const Loader = () => {
  const wrapperRef = useRef();
  useEffect(() => {
    if(wrapperRef?.current) {
      setUpLoader();
    }
  }, [wrapperRef])
  return (
    <>
      <div className="loader-bg" ref={wrapperRef}>
        <div className="content avatar">
          <div className="image-wrapper">
            <div className="flare f-anim1"></div>
            <div className="flare f-anim3"></div>
          </div>
        </div>	
        <svg width='500' height='250' id="radar"></svg>
      </div>
    </>
  )
}

export default Loader;