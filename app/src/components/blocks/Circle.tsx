interface CircleProps {
  children: JSX.Element | String;
  title?: string;
  bgClass: string;
  textClass: string;
  outlineClass?: string;
  padding?: string;
}

const Circle = ({children, title = '', bgClass, textClass, padding, outlineClass}: CircleProps) => {
  return (
    <div title={title} className={`${outlineClass ? `border ${outlineClass}` : ''} inline-block rounded-full transition duration-300 hover:opacity-70 ${padding ? `p-${padding}` : 'p-2'} ${bgClass} ${textClass}`}>
      { children }
    </div>
  )
}

export default Circle;