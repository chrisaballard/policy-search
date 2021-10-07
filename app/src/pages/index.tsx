import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout'
import Head from 'next/head';
import { SearchInput, SearchResults, SearchNavigation } from '../components/search';
import Loader from '../components/Loader';
import Filters from '../components/blocks/Filters/Filters';
import { API_BASE_URL, PER_PAGE } from '../constants';
import useGetSearchResult from '../hooks/useSetSearchResult';
import useGetGeographies from '../hooks/useGetGeographies';
import useSetStatus from '../hooks/useSetStatus';
import { getParameterByName } from '../helpers/queryString';

const Home = (): JSX.Element => {

  const [ endOfList, setEndOfList ] = useState(false);
  // query=xxx
  const [ searchQuery, setSearchQuery ] = useState('');
  // next number to start on when paging through
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
    const sq = getParameterByName('query', `${API_BASE_URL}/policies/search?${queryString}`);
    if(sq?.trim().length === 0) return;
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
      {console.log(searchQuery)}
      
      <SearchInput 
        newSearch={newSearch}
        setProcessing={setProcessing}
        processing={processing}
        geographyFilters={geographyFilters}
      />
      <div className="container md:flex">
      {searchQuery ?
          <Filters 
            geographies={geographies}
            newSearch={newSearch}
            setProcessing={setProcessing}
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
