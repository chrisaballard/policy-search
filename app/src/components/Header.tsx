import Link from 'next/link';

const Header = ({ pageTitle }) => {
  return (
    <header>
      {/* <div className="container flex justify-center my-6 lg:my-12">
        <img className="logo" src="/images/cpr-logo-primary.svg" alt="Climate Policy Radar Logo" />
      </div> */}
      <div className="container md:flex mt-6 lg:mt-12">
        <div className="w-full flex justify-center md:justify-start mb-4 md:mb-0 md:w-1/4 px-4 md:pl-0">
          <Link href="/">
            <img className="logo cursor-pointer" src="/images/cpr-logo-primary.svg" alt="Climate Policy Radar Logo" />
          </Link>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold transform-uppercase text-center md:pl-8 mx-auto">{pageTitle}</h1>
      </div>
    </header>
  )
}

export default Header;