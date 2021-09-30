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
      <div className="bg" ref={wrapperRef}>
        <div className="content avatar">
          <div className="image-wrapper">
            <div className="image"></div>
            <div className="flare f-anim1"></div>
            <div className="flare f-anim2"></div>
            <div className="flare f-anim3"></div>
          </div>
        </div>	
        <svg width='1000' height='500' id="radar"></svg>
      </div>
      <div className="content">
        <div>
          
        </div>
      </div>
    </>
  )
}

export default Loader;