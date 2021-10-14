import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/layouts/MainLayout'
import Head from 'next/head';
import { SearchInput, SearchResults, SearchNavigation } from '../components/search';
import FiltersColumn from '../components/blocks/filters/FiltersColumn';
import Overlay from '../components/Overlay';
import { API_BASE_URL, PER_PAGE } from '../constants';
import useGetSearchResult from '../hooks/useSetSearchResult';
import useGeographies from '../hooks/useGeographies';
import useSectors from '../hooks/useSectors';
import useInstruments from '../hooks/useInstruments';
import useSetStatus from '../hooks/useSetStatus';
import useBuildQueryString from '../hooks/useBuildQueryString';
import { useDidUpdateEffect } from '../hooks/useDidUpdateEffect';
import { getParameterByName } from '../helpers/queryString';
import SlideOut from '../components/modal/SlideOut';
import MultiSelect from '../components/blocks/filters/MultiSelect';
import useFilters from '../hooks/useFilters';

const Home = React.memo((): JSX.Element => {
  const [ endOfList, setEndOfList ] = useState(false);
  const [ slideOutActive, setSlideOutActive ] = useState(false);
  // active filters on slide-out widget
  const [ activeSelect, setActiveSelect ] = useState({
    type: '',
    list: [],
  });
  // next number to start on when paging through
  const [ next, setNext ] = useState(0);

  const containerRef = useRef();
  
  // hooks
  const [ searchResult, getResult, clearResult ] = useGetSearchResult();
  const [ geographies, geographyFilters, setGeographies, setGeographyFilters ] = useGeographies();
  const [ filters, updateFilters ] = useFilters();
  const [ sectors, setSectors ] = useSectors();
  const [ instruments, setInstruments ] = useInstruments();
  const [ status, setProcessing ] = useSetStatus();
  const [ buildQueryString ] = useBuildQueryString();

  // destructure
  const { processing } = status;
  const { searchQuery, metadata, resultsByDocument } = searchResult;

  // query=xxx
  const [ searchQueryString, setSearchQueryString ] = useState(`query=${searchQuery}`);

  const updateNext = () => {
    const nextStart = document.getElementsByClassName('search-result').length;
    setNext(nextStart);
  }
  const loadResults = (queryString: string): void => {
    getResult(queryString);
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
    const qStr = buildQueryString();
    loadResults(`${qStr}&start=${next}`);
  }

  const toggleSlideOut = (type) => {
    setSlideOutActive(true);
    // which kind of filter
    // (need a better way of doing this for when we might have more types of selectable filters)
    let list;
    if(type === 'sector') {
      list = sectors;
    }
    else if (type === 'instrument') {
      list = instruments;
    }
    setActiveSelect({
      type,
      list
    })
    
  }

  useEffect(() => {
    if(!geographies.length) setGeographies();
    if(!sectors.length) setSectors();
    if(!instruments.length) setInstruments();
  }, []);
  
  useEffect(() => {
    updateNext();
    checkIfEnd();
  }, [searchResult])

  useEffect(() => {
    if(containerRef.current) {
      updateNext();
    }
  }, [containerRef])

  useDidUpdateEffect(() => {
    setNext(PER_PAGE);
  }, [geographyFilters])

  return (
    <>
    <Head>
      <title>Policy Search</title>
    </Head>
    <SlideOut
        active={slideOutActive}
        onClick={() => { setSlideOutActive(false)}}
      >
        <MultiSelect
            title={activeSelect.type}
            list={activeSelect.list}
            activeFilters={filters[`${activeSelect.type}Filters`]}
            updateFilters={updateFilters}
          />
    </SlideOut>
    <Overlay
      active={slideOutActive}
    />
    <MainLayout>
      <SearchInput 
        newSearch={newSearch}
        setProcessing={setProcessing}
        processing={processing}
        searchTerms={searchQuery}
      />
      <div ref={containerRef} className="container md:flex">
      <FiltersColumn
        geographies={geographies}
        newSearch={newSearch}
        setProcessing={setProcessing}
        geographyFilters={geographyFilters}
        setGeographyFilters={setGeographyFilters}
        updateFilters={updateFilters}
        filters={filters}
        headingClick={toggleSlideOut}
      />
      {/* {searchQuery ?
          <Filters 
            geographies={geographies}
            newSearch={newSearch}
            setProcessing={setProcessing}
            geographyFilters={geographyFilters}
            setGeographyFilters={setGeographyFilters}
          />
          : null
        } */}
        <SearchResults 
          policies={resultsByDocument} 
          searchQueryString={searchQueryString}
          searchTerms={searchQuery}
          processing={processing}
          geographies={geographies}
        />
      </div>
      
      {resultsByDocument.length && !endOfList ?
      <SearchNavigation onClick={handleNavigation} />
      : null
      }
      
      
    </MainLayout>
    </>
  )
});

export default Home;
