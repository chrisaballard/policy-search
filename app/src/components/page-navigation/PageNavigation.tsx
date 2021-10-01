import Button from './Button';

const PageNavigation = () => {
  const onClick = () => {}
  return (
    <div className="container">
      <div className="mx-auto lg:w-1/2 flex justify-center my-8">
        <Button text="Previous 20" onClick={onClick}></Button>
        &nbsp; &nbsp;
        <Button text="Next 20" onClick={onClick}></Button>
      </div>
    </div>
    
  )
}
export default PageNavigation;