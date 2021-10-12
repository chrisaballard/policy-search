import Footer from "../Footer";
import Header from "../Header";

interface LayoutProps {
  children
}

const Layout = ({children}: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col justify-start min-h-screen">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      
      <Footer />
    </div>
  )
}

export default Layout;