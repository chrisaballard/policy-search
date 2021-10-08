import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PolicyPage } from '../../model/policyPage';
import useGetPolicyPage from '../../hooks/useGetPolicyPage';
import useGetPolicies from '../../hooks/useGetPolicies';
import useSetStatus from '../../hooks/useSetStatus';
import MainLayout from '../../components/layouts/MainLayout'
import Head from 'next/head';
import Link from 'next/link';
import Loader from '../../components/Loader';

// interface PolicyPageProps {
//   page: PolicyPage
// }
const Policy = () => {
  const router = useRouter();
  const { pid, page } = router.query;

  const [ policyPage, getPage, clearPage ] = useGetPolicyPage();
  const [ policy, getPolicy ] = useGetPolicies();
  const [ status, setProcessing ] = useSetStatus();
  const { processing } = status;

  const loadPolicyPage = () => {
    setProcessing(true);
    getPolicy(pid);
    getPage(pid, page);
  }

  useEffect(() => {
    if(router.query.pid) {
      loadPolicyPage();
    }
  }, [router]);

  return (
    <MainLayout>
      <Head>
        <title>{policy.policyName}</title>
      </Head>
      <section>
        <div className="container">
          <div className="mb-4">
            <Link href='/'>
              <a className="text-gray-500 hover:text-black transition duration-300">
                &laquo; Back to search
              </a>
            </Link>
          </div>

          {processing ?
            <Loader />
          :
          <div className="border border-gray-300 p-8 mb-8 shadow-lg">
            <h1 className="text-4xl">{policy.policyName}</h1>
            <div className="my-4 text-gray-400">Page <span className="text-black font-bold">{page}</span> of <span>{policyPage.documentMetadata.pageCount}</span></div>
            <div className="mt-6">
              {policyPage.pageText}
            </div>
          </div>
          }
          
          
        </div>
      </section>
      
    </MainLayout>
  )

}

export default Policy;