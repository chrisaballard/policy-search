import Button from '../elements/buttons/Button';
interface SearchNavigationProps {
  onClick(event: React.FormEvent<HTMLButtonElement>): void;
}
const SearchNavigation = ({ onClick }: SearchNavigationProps) => {

  return (
    <div className="container">
      <div className="mx-auto lg:w-1/2 flex justify-center my-8">
        <Button onClick={onClick}>Load More</Button>
      </div>
    </div>
    
  )
}
export default SearchNavigation;