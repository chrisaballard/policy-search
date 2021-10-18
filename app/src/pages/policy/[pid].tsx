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

const Policy = () => {
  const inputRef = useRef();
  const router = useRouter();
  const [ pageInput, setPageInput ] = useState('')
  const [ pageText, setPageText ] = useState('')
  const [ policyPage, getPage, clearPage ] = useGetPolicyPage();
  const [ policy, getPolicy ] = useGetPolicies();
  const [ status, setProcessing ] = useSetStatus();
  const { processing } = status;
  const { pid, page } = router.query;
  const state = useSelector((state: State ) => state)
  const { searchResult: { searchQuery } } = state;


  const loadPolicyPage = () => {
    setProcessing(true);
    getPolicy(pid);
    getPage(pid, page);
  }

  const changePageNumber = (action: string): void => {
    let p = parseInt(page);
    if(action === 'prev') {
      p -= 1;
    }
    if(action === 'next') {
      p += 1;
    }
    loadNewPage(p);
  }

  const handleInputChange = (): void => {
    let n = inputRef.current.value;
    if(n > policyPage.documentMetadata.pageCount) {
      n = policyPage.documentMetadata.pageCount;
    }
    setPageInput(n);
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
      highlightText();
    }
  }, [policyPage])

  return (
    <MainLayout>
      <Head>
        <title>Climate Policy Document: {policy.policyName}</title>
      </Head>
      <section>
        <div className="container">
          <div className="mb-4 flex flex-wrap md:flex-no-wrap justify-between items-end">
            <div className="w-full text-center mb-2 md:w-auto md:mb-0 md:text-left">
              <Link href='/'>
                <a className="hover:text-primary transition duration-300">
                  &laquo; Back to search
                </a>
              </Link>
            </div>
            
            <div>
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
            <button
              onClick={() => { changePageNumber('prev') }}
              style={{height: '36px'}}
              className={`bg-black text-white px-4 rounded-l-lg border-r border-white focus:outline-black hover:bg-gray-700 transition duration-300 ${parseInt(page) === 1 ? 'pointer-events-none bg-gray-300 hover:bg-gray-300' : ''}`}
            >
              &laquo;
            </button>
            <button
              onClick={() => { changePageNumber('next') }}
              style={{height: '36px'}}
              className={`button-half px-4 rounded-r-lg focus:outline-primary-dark ${parseInt(page) === policyPage.documentMetadata.pageCount ? 'pointer-events-none bg-gray-300 hover:bg-gray-300' : ''}`}
            >
              &raquo;
            </button>
              
            </div>
          </div>

          {processing ?
            <Loader />
          :
          <div className="bg-gray-100 rounded-2xl p-4 md:p-8 my-8">
            <h1 className="text-2xl md:text-4xl leading-relaxed">{policy.policyName}</h1>
            <div className="my-4 text-gray-400 flex justify-between items-end">
              <a href={`${policy.url}#page=${page}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <span className="sr-only">Download PDF</span>
                <img src="/images/download-pdf.svg" alt="Download PDF" title="Download PDF" style={{ width: '40px'}} />
              </a>
              <div>
                Page <span className="font-bold">{page}</span> of <span>{policyPage.documentMetadata.pageCount}</span>
              </div>
            </div>
            {pageText.length ? 
            <div className="mt-6 text-gray-600" dangerouslySetInnerHTML={{__html: pageText}} />
            : 
            <div className="my-12 text-gray-600">
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