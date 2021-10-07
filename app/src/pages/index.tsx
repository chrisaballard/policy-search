import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout'
import Head from 'next/head';
import { SearchInput, SearchResults, SearchNavigation } from '../components/search';
import Loader from '../components/Loader';
import Filters from '../components/blocks/Filters/Filters';
import { PER_PAGE } from '../constants';
import useGetSearchResult from '../hooks/useSetSearchResult';
import useGetGeographies from '../hooks/useGetGeographies';
import useSetStatus from '../hooks/useSetStatus';


const Home = (): JSX.Element => {

  const [ endOfList, setEndOfList ] = useState(false);
  const [ query, setQuery ] = useState('');
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ next, setNext ] = useState(0);

  // hooks
  const [ searchResult, getResult, clearResult ] = useGetSearchResult();
  const [ geographies, geographyFilters, setGeographies, setGeographyFilters ] = useGetGeographies();
  const [ status, setProcessing ] = useSetStatus();
  const { processing } = status;
  const { metadata, resultsByDocument } = searchResult;

  const loadResults = (queryString: string): void => {
    getResult(queryString);
    setNext(PER_PAGE + next);
  }

  const checkIfEnd = () => {
    const end = metadata.numDocsReturned < PER_PAGE;
    setEndOfList(end);
  }
  const newSearch = (queryString) => {
    const sq = document.getElementById('search-input').value;
    if(sq.trim().length === 0) return;
    setSearchQuery(queryString);
    setNext(0);
    if (resultsByDocument.length) {
      clearResult();
    }
    loadResults(queryString);
  }
  const handleNavigation = (): void => {
    setProcessing(true);
    loadResults(`${searchQuery}&start=${next}`);
  }

  useEffect(() => {
    if(!geographies.length) setGeographies();
  }, []);
  useEffect(() => {
    setNext(PER_PAGE);
  }, [geographyFilters])
  useEffect(() => {
    checkIfEnd();
  }, [searchResult])
  return (
    <Layout>
      <Head>
        <title>Policy Search</title>
      </Head>
      <SearchInput 
        newSearch={newSearch}
        query={query}
        setQuery={setQuery}
        setProcessing={setProcessing}
        processing={processing}
      />
      <div className="container md:flex">
      {resultsByDocument.length ||  geographyFilters.length ?
          <Filters 
            geographies={geographies}
            newSearch={newSearch}
            setProcessing={setProcessing}
            setQuery={setQuery}
            query={query}
            geographyFilters={geographyFilters}
            setGeographyFilters={setGeographyFilters}
          />
          : null
        }
      <SearchResults 
        policies={resultsByDocument} 
        searchQuery={searchQuery} 
        processing={processing}
        geographies={geographies}
      />
      </div>
      
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

export default Home;
