import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/main.scss'
import '../styles/flag-icon.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Policy Search</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp