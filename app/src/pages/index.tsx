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

  const [ searchResult, getResult, clearResult ] = useGetSearchResult();
  const [ geographies, geographyFilters, setGeographies, setGeographyFilters ] = useGetGeographies();
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
      <div className="container md:flex">
      {resultsByDocument.length ?
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
        query={query} 
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
