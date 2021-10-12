interface FilterTagProps {
  text: string;
  onClick(): void;
}

const FilterTag = ({ text, onClick }) => {
  return (
    <div className="bg-gray-100 p-2 relative mt-4">
      <button
        className="absolute top-0 right-0 mt-1 mr-1 text-xl px-1"
        onClick={onClick}
      >
        <span>&times;</span>
      </button>
      <span>{text}</span>
    </div>
  )
}

export default FilterTag;