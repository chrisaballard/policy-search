import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../components/layouts/MainLayout'
import Head from 'next/head';
import { SearchInput, SearchResults, SearchNavigation } from '../components/search';
import Filters from '../components/blocks/Filters/Filters';
import { API_BASE_URL, PER_PAGE } from '../constants';
import useGetSearchResult from '../hooks/useSetSearchResult';
import useGetGeographies from '../hooks/useGetGeographies';
import useSetStatus from '../hooks/useSetStatus';
import { getParameterByName } from '../helpers/queryString';

const Home = React.memo((): JSX.Element => {
  const [ endOfList, setEndOfList ] = useState(false);
  // query=xxx
  const [ searchQueryString, setSearchQueryString ] = useState('');
  // next number to start on when paging through
  const [ next, setNext ] = useState(0);

  // hooks
  const [ searchResult, getResult, clearResult ] = useGetSearchResult();
  const [ geographies, geographyFilters, setGeographies, setGeographyFilters ] = useGetGeographies();
  const [ status, setProcessing ] = useSetStatus();
  const { processing } = status;
  const { searchQuery, metadata, resultsByDocument } = searchResult;

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
    
    setSearchQueryString(queryString);
    setNext(0);
    if (resultsByDocument.length) {
      clearResult();
    }
    loadResults(queryString);
  }
  const handleNavigation = (): void => {
    setProcessing(true);
    loadResults(`${searchQueryString}&start=${next}`);
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
    <MainLayout>
      <Head>
        <title>Policy Search</title>
      </Head>
      <SearchInput 
        newSearch={newSearch}
        setProcessing={setProcessing}
        processing={processing}
        searchTerms={searchQuery}
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
          searchQuery={searchQueryString} 
          processing={processing}
          geographies={geographies}
        />
      </div>
      
      {resultsByDocument.length && !endOfList ?
      <SearchNavigation onClick={handleNavigation} />
      : null
      }
      
      
    </MainLayout>
  )
});

export default Home;
