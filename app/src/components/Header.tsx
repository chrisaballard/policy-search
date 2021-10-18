const Header = () => {
  return (
    <header>
      <div className="container flex justify-center my-6 lg:my-12">
        {/* <div className="text-2xl md:text-3xl text-gray-400 text-center">Climate Policy Radar</div> */}
        <img className="logo" src="/images/cpr-logo-primary.svg" alt="Climate Policy Radar Logo" />
      </div>
    </header>
  )
}

export default Header;