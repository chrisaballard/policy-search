import Header from "./Header";

interface LayoutProps {
  children
}

const Layout = ({children}: LayoutProps): JSX.Element => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default Layout;