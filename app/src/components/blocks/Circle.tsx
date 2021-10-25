interface CircleProps {
  children: JSX.Element | String;
  title?: string;
  bgClass: string;
  textClass: string;
}

const Circle = ({children, title = '', bgClass, textClass}: CircleProps) => {
  return (
    <div title={title} className={`inline-block p-2 rounded-full transition duration-300 hover:opacity-70 ${bgClass} ${textClass}`}>
      { children }
    </div>
  )
}

export default Circle;