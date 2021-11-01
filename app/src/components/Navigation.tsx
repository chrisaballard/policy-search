import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {

  const router = useRouter();

  return (
    <div className="flex">
      <Link href="/">
        <a className={`hover:text-primary-light transition duration-300 ${router.pathname === '/' ? 'font-bold no-underline pointer-events-none' : 'underline'}`}>
          Search
        </a>
      </Link>
      <Link href="/overview">
        <a className={`ml-4 hover:text-primary-light transition duration-300 ${router.pathname === '/overview' ? 'font-bold no-underline pointer-events-none' : 'underline'}`}>
          Overview
        </a>
      </Link>
    </div>
  )
}
export default Navigation;