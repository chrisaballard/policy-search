import { useEffect } from 'react';

const MultiRange = () => {
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
        '--a': '-30',
        '--b': '20',
        '--min': '-50',
        '--max': '50'
       }}>
    <div id='multi-lbl'>Multi thumb slider:</div>
    <label className='sr-only' htmlFor='a'>Value A:</label>
    <input id='a' type='range' min='-50' defaultValue='-30' max='50'/>
    <output for='a' style={{'--c': 'var(--a)'}}></output>
    <label className='sr-only' htmlFor='b'>Value B:</label>
    <input id='b' type='range' min='-50' defaultValue='20' max='50'/>
    <output for='b' style={{'--c': 'var(--b)'}}></output>
  </div>
  )
}
export default MultiRange;