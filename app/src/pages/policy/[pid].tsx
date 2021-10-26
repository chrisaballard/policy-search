import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { STOP_WORDS } from '../../constants';
import useGetPolicyPage from '../../hooks/useGetPolicyPage';
import useGetPolicies from '../../hooks/useGetPolicies';
import useSetStatus from '../../hooks/useSetStatus';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/elements/buttons/Button';
import Head from 'next/head';
import Link from 'next/link';
import Loader from '../../components/Loader';
import { State } from '../../store/initialState';
import HalfButton from '../../components/elements/buttons/HalfButton';
import { DownloadPDFIcon } from '../../components/elements/images/SVG';

const Policy = () => {
  const inputRef = useRef<HTMLInputElement>();
  const router = useRouter();
  const [ pageInput, setPageInput ] = useState('')
  const [ pageText, setPageText ] = useState('')
  const [ policyPage, getPage, clearPage ] = useGetPolicyPage();
  const [ policy, policy_db, getPolicy, getPolicies ] = useGetPolicies();
  const setProcessing = useSetStatus();

  const { pid, page } = router.query;
  const state = useSelector((state: State ) => state)
  const { searchResult: { searchQuery }, status: { processing } } = state;


  const loadPolicyPage = () => {
    setProcessing(true);
    getPolicy(pid);
    getPage(pid, page);
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

  const highlightText = () => {
    const queryArr = searchQuery.split(' ');
    const newPageTextArray = [];

    // loop through each sentence in pageText array
    policyPage.pageText.forEach((sentence) => {
      const newWordsArray = [];
      let newSentence = '';
      // make array of each word in sentence
      const wordsArray = sentence.split(' ');
      // loop through each word in sentence
      wordsArray.forEach((word) => {
        let newWord = word;
        queryArr.forEach((term) => {
          const cleanTerm = term.trim().toLowerCase();
          // ignore stop words
          if (STOP_WORDS.indexOf(cleanTerm) > -1) return;
          // remove trailing periods, commas or spaces from word for more accurate comparison
          const cleanWord = word.replace(/\,/g, '').replace(/\./g, '').trim().toLowerCase();
          if (cleanWord === term.trim().toLowerCase()) {
            newWord = `<em>${word}</em>`
          }
        });
        newWordsArray.push(newWord);
      });
      // make new sentence from new words array
      newSentence = newWordsArray.join(' ');
      // add new sentence to new pageText array
      newPageTextArray.push(newSentence);
    });
    setPageText(newPageTextArray.join(' '));
  }

  useEffect(() => {
    if(router.query.pid) {
      loadPolicyPage();
    }
  }, [router]);

  useEffect(() => {
    if(policyPage.pageText) {
      // highlightText();
    }
  }, [policyPage])

  return (
    <MainLayout>
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
            
            <div className="my-4 text-primary-light flex justify-between items-end">
              <div>
                {/* country flag, country name */}
              </div>
              <div className="text-primary-dark-500">
                Page <span className="font-bold">{page}</span> of <span>{policyPage.documentMetadata.pageCount}</span>
              </div>
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