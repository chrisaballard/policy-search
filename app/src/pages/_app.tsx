import Head from 'next/head'
import { AppProps } from 'next/app'
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useStore } from '../store';
import '../styles/main.scss'
import '../styles/flag-icon.css'

function MyApp({ Component, pageProps }: AppProps) {

  const store = useStore(pageProps);

  // For later when using Cypress:
  // useEffect(() => {
  //   if (window?.Cypress) {
  //     window.store = store;
  //   }
  // }, [store])

  return (
    <Provider store={store}>
      <Head>
        <title>Policy Search</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp