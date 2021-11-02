import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useGetPolicyPage from '../../hooks/useGetPolicyPage';
import useGetPolicies from '../../hooks/useGetPolicies';
import useSetStatus from '../../hooks/useSetStatus';
import useGeographies from '../../hooks/useGeographies';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/elements/buttons/Button';
import Head from 'next/head';
import Link from 'next/link';
import Loader from '../../components/Loader';
import { State } from '../../store/initialState';
import HalfButton from '../../components/elements/buttons/HalfButton';
import { DownloadPDFIcon } from '../../components/elements/images/SVG';
import { getCountryNameFromCode } from '../../helpers/geography';
import { useDidUpdateEffect } from '../../hooks/useDidUpdateEffect';

const Policy = () => {
  const inputRef = useRef<HTMLInputElement>();
  const router = useRouter();
  const [ pageInput, setPageInput ] = useState('');
  const [ country, setCountry ] = useState('')
  const [ policyPage, getPage, clearPage ] = useGetPolicyPage();
  const [ pageText, setPageText ] = useState('')
  const [ policy, policy_db, getPolicy, getPolicies ] = useGetPolicies();
  const setProcessing = useSetStatus();
  const setGeographies = useGeographies();

  const { pid, page } = router.query;
  const state = useSelector((state: State ) => state)
  const { searchResult: { searchQuery }, status: { processing }, geographyList } = state;


  const loadPolicyPage = () => {
    setProcessing(true);
    getPolicy(pid);
    getPage(pid, page);
  }
  const getCountryName = () => {
    if (policy.countryCode === 'EUE') {
      setCountry('European Union');
      return;
    }
    const name = getCountryNameFromCode(policy.countryCode, geographyList);
    setCountry(name);
  }

  const changePageNumber = (action: string): void => {
    let p = parseInt(page as string);
    if(action === 'prev') {
      p -= 1;
    }
    if(action === 'next') {
      p += 1;
    }
    loadNewPage(p);
  }

  const handleInputChange = (): void => {
    let n: number;
    if(inputRef.current) {
      n = parseInt(inputRef.current.value);
    }
    
    if(n > policyPage.documentMetadata.pageCount) {
      n = policyPage.documentMetadata.pageCount;
    }
    setPageInput(n.toString());
  }

  const handlePageChange = (e: React.FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    
    if(pageInput) {
      loadNewPage(pageInput)
    }
  }

  const loadNewPage = (page: number | string) => {
    router.push(`/policy/${pid}/?page=${page}`);
    setPageInput('');
  }

  useEffect(() => {
    if(router.query.pid) {
      loadPolicyPage();
    }
  }, [router]);

  useEffect(() => {
    if(policyPage.pageText) {
      setPageText(policyPage.pageText.join(','));
    }
  }, [policyPage]);

  useEffect(() => {
    if(!geographyList.length) setGeographies();
  }, []);

  useDidUpdateEffect(() => {
    if(geographyList.length && policy.countryCode.length) {
      getCountryName();
    }
  }, [geographyList, policy])

  return (
    <MainLayout pageTitle="Full Policy Text">
      <Head>
        <title>Climate Policy Document: {policy.policyName}</title>
      </Head>
      <section className="mt-8 flex flex-col flex-grow">
        <div className="container flex-grow flex flex-col justify-start">
          <div className="mb-4 flex flex-wrap md:flex-no-wrap justify-between items-end">
            <div className="w-full text-center mb-2 md:w-auto md:mb-0 md:text-left">
              <Link href='/'>
                <a className="hover:text-primary-light transition duration-300">
                  &laquo; Back to search
                </a>
              </Link>
            </div>
            
            <div className="mt-2 md:mt-0">
              <form className="flex items-end">
                <span>Go to page:</span>
                <input 
                  ref={inputRef}
                  type="number"
                  min="0"
                  max={`${policyPage.documentMetadata.pageCount}`}
                  onChange={handleInputChange}
                  value={pageInput}
                  style={{height: '36px', width: '40px'}}
                  className="border-b border-black outline-none focus:outline-none mx-2 appearance-none"
                />
                <Button size="small" onClick={handlePageChange}>Go</Button>
              </form>
            </div>

            <div>
              <HalfButton 
                side='left' 
                onClick={ () => { changePageNumber('prev') }} 
                active={parseInt(page as string) > 1}
              >
                &laquo;
              </HalfButton>
              <HalfButton 
                side='right' 
                onClick={ () => { changePageNumber('next') }} 
                active={parseInt(page as string) < policyPage.documentMetadata.pageCount}
              >
                &raquo;
              </HalfButton>
            </div>
          </div>

          {processing ?
            <Loader />
          :
          <div className="flex-grow bg-primary-dark-200 rounded-2xl p-4 md:p-8 md:my-8">
            <div className="flex justify-between">
              <h1 className="text-2xl md:text-4xl leading-relaxed">{policy.policyName}</h1>
              <a href={`${policy.url}#page=${page}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 text-primary-light">
                <span className="sr-only">Download PDF</span>
                <DownloadPDFIcon
                  height="40"
                  width="40"
                />
              </a>
            </div>
            
            <div className="my-8 text-primary-light flex flex-wrap justify-between items-end">
              <div>
                {policy.policyDate?.length ?
                  <span className="text-primary-dark-500"><span className="font-bold text-primary">Policy date:</span> {policy.policyDate}</span>
                :
                null}
              </div>
              <div className="text-primary-dark-500">
                Page <span className="font-bold">{page}</span> of <span>{policyPage.documentMetadata.pageCount}</span>
              </div>
            </div>

            <div className="flex justify-start items-center">
              <div className={`rounded border border-black flag-icon-background flag-icon-${policy.countryCode.toLowerCase()}`} />
              <div className="ml-2">{country}</div>
            </div>

            {pageText.length ? 
            <div className="mt-6 text-primary-dark-600" dangerouslySetInnerHTML={{__html: pageText}} />
            : 
            <div className="my-12 text-primary-dark-600">
              <p>This page has been intentionally left blank.</p>
            </div>
            }
            
          </div>
          }
          
          
        </div>
      </section>
      
    </MainLayout>
  )

}

export default Policy;