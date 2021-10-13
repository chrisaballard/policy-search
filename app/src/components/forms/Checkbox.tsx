import { useState } from 'react';

const Checkbox = ({ name, checked }) => {

  const svgStyle = {
    display: 'block',
    fill: 'none',
    height: '16px',
    width: '16px',
    stroke: 'currentcolor',
    strokeWidth: '4',
    overflow: 'visible'
  }
  return (
    <div className="mr-8">
      <span className="relative inline-block cursor-pointer">
        <input className="absolute opacity-0 cursor-pointer" type="checkbox" value={name} checked={checked} />
        <span className={`inline-block border text-center align-top overflow-hidden rounded ${checked ? 'border-primary-light bg-primary-light text-white' : 'border-primary-dark bg-white'}`} style={{ height: '24px', width: '24px'}}>
          <span className="flex items-center justify-center w-full h-full text-white">
            {checked ?
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={ svgStyle }><path fill="none" d="m4 16.5 8 8 16-16"></path></svg>
            : null}
          </span>
        </span>
      </span>
    </div>
  )
}
export default Checkbox;