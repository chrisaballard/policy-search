import { useState, useEffect } from 'react';
import Layout from '../components/Layout'
import Head from 'next/head';
import { SearchInput, SearchResults, SearchNavigation } from '../components/search';
import Loader from '../components/Loader';
import { PER_PAGE } from '../constants';
import useGetSearchResult from '../hooks/useSetSearchResult';
import useGetGeographies from '../hooks/useGetGeographies';
import useSetStatus from '../hooks/useSetStatus';


export default function Home(): JSX.Element {

  const [ endOfList, setEndOfList ] = useState(false);
  const [ query, setQuery ] = useState('');
  const [ next, setNext ] = useState(0);

  const [ searchResult, getResult, clearResult ] = useGetSearchResult();
  const [ geographies, setGeographies ] = useGetGeographies();
  const [ status, setProcessing ] = useSetStatus();
  const { processing } = status;
  const { metadata, resultsByDocument } = searchResult;

  const loadResults = (queryString: string): void => {
    getResult(queryString);
    setNext(PER_PAGE + next);
    checkIfEnd();
  }

  const checkIfEnd = () => {
    const end = metadata.numDocsReturned < PER_PAGE;
    setEndOfList(end);
  }
  const newSearch = () => {
    if(query.trim().length === 0) return;
    setQuery(query);
    setNext(0);
    if (resultsByDocument.length) {
      clearResult();
    }
    
    loadResults(`query=${query}`);
  }
  const handleNavigation = (): void => {
    setProcessing(true);
    loadResults(`query=${query}&start=${next}`);
  }

  useEffect(() => {
    setGeographies();
  }, [])
  return (
    <Layout>
      <Head>
        <title>Policy Search</title>
      </Head>
      {console.log(searchResult)}
      <SearchInput 
        newSearch={newSearch}
        query={query}
        setQuery={setQuery}
        setProcessing={setProcessing}
      />
      <SearchResults 
        policies={resultsByDocument} 
        query={query} 
        processing={processing}
        geographies={geographies}
        loadResults={loadResults}
        newSearch={newSearch}
        setProcessing={setProcessing}
        setQuery={setQuery}
      />
      {processing ? 
        <Loader />
        : null
      }

      {resultsByDocument.length && !endOfList ?
      <SearchNavigation onClick={handleNavigation} />
      : null
      }
      
      
    </Layout>
  )
}
