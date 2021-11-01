import Head from 'next/head';
import MainLayout from '../../components/layouts/MainLayout'

const Overview = () => {
  return (
    <>
    <Head>
      <title>Overview</title>
    </Head>
    <MainLayout pageTitle={'Overview'}>
      <section className="w-full">
        <div className="-mt-10 max-w-screen-lg mx-auto">
        <iframe style={{overflow: 'hidden'}} width="100%" height="1256" frameBorder="0" src="/overview/index.html"></iframe>
        </div>
      </section>
    </MainLayout>
    </>
  )
}

export default Overview;