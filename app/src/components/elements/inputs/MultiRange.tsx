import { useEffect } from 'react';

interface MultiRangeProps {
  min: string;
  max: string;
}
const MultiRange = ({min, max}) => {
  useEffect(() => {
    addEventListener('input', e => {
      let _t = e.target;
      _t.parentNode.style.setProperty(`--${_t.id}`, +_t.value)
    }, false)
  })
  return (
    <div 
      className='multi-range-wrap'
      role='group'
      aria-labelledby='multi-lbl'
      style={{ 
        '--a': min,
        '--b': max,
        '--min': min,
        '--max': max
       }}>
    <div id='multi-lbl'>Multi thumb slider:</div>
    <label className='sr-only' htmlFor='a'>Value A:</label>
    <input id='a' type='range' min={min} defaultValue={min} max={max} />
    <output htmlFor='a' style={{'--c': 'var(--a)'}}></output>
    <label className='sr-only' htmlFor='b'>Value B:</label>
    <input id='b' type='range' min={min} defaultValue={max} max={max}/>
    <output htmlFor='b' style={{'--c': 'var(--b)'}}></output>
  </div>
  )
}
export default MultiRange;