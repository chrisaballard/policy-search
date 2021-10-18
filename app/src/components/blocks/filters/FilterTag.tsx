interface FilterTagProps {
  text: string;
  onClick(): void;
}

const FilterTag = ({ text, onClick }) => {
  return (
    <div className="relative animate-fadeInOnce bg-primary-dark text-xs capitalize text-white p-2 pr-8 mr-2 mt-2 rounded-xl">
      <button
        className="absolute top-0 right-0 mt-1 mr-1 text-xl px-1 focus:outline-none"
        onClick={onClick}
      >
        <span>&times;</span>
      </button>
      <span>{text}</span>
    </div>
  )
}

export default FilterTag;