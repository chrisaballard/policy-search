import Link from 'next/link';
import Navigation from './Navigation';

const Header = ({ pageTitle }) => {
  return (
    <header>
      <div className="container md:flex mt-6 lg:mt-12">
        <div className="w-full flex flex-col justify-center items-center md:justify-start mb-4 md:mb-0 md:w-1/4 px-4 md:pl-0">
          <Link href="/">
            <img className="logo cursor-pointer" src="/images/cpr-logo-primary.svg" alt="Climate Policy Radar Logo" />
          </Link>
          <div className="mt-4">
            <Navigation />
          </div>
        </div>
        <h1 className="text-center md:text-left text-4xl md:text-6xl font-bold transform-uppercase md:pl-8">{pageTitle}</h1>
      </div>
    </header>
  )
}

export default Header;