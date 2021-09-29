interface LayoutProps {
  children
}

const Layout = ({children}: LayoutProps): JSX.Element => {
  return (
    <div>
      {children}
    </div>
  )
}

export default Layout;