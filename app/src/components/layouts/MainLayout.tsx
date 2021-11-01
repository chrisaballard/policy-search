import Footer from "../Footer";
import Header from "../Header";

interface LayoutProps {
  children,
  pageTitle: string
}

const Layout = ({children, pageTitle}: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col justify-start min-h-screen">
      <Header pageTitle={pageTitle} />
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      
      <Footer />
    </div>
  )
}

export default Layout;