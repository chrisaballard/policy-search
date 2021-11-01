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
        <div className="-mt-10 container">
        <iframe style={{overflowX: 'hidden'}} width="100%" height="1256" frameBorder="0" src="http://localhost:8002"></iframe>
        </div>
      </section>
    </MainLayout>
    </>
  )
}

export default Overview;