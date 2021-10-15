import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
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
import { State } from '../store/initialState';

const Home = React.memo((): JSX.Element => {
  const state = useSelector((state: State ) => state)
  const [ slideOutActive, setSlideOutActive ] = useState(false);
  // active filters on slide-out widget
  const [ activeSelect, setActiveSelect ] = useState({
    type: '',
    list: [],
  });
  // next number to start on when paging through
  const [ next, setNext ] = useState(0);

  const containerRef = useRef();
  
  // custom hooks
  const [ searchResult, getResult, clearResult ] = useGetSearchResult();
  const setGeographies = useGeographies();
  const updateFilters = useFilters();
  const setSectors = useSectors();
  const setInstruments = useInstruments();
  const setProcessing = useSetStatus();
  const buildQueryString = useBuildQueryString();

  // destructure
  const { status, filters, geographyList, sectorList, instrumentList } = state;
  const { processing } = status;
  const { searchQuery, metadata, resultsByDocument, endOfList } = searchResult;

  // query=xxx
  const [ searchQueryString, setSearchQueryString ] = useState(`query=${searchQuery}`);

  const updateNext = () => {
    const nextStart = document.getElementsByClassName('search-result').length;
    setNext(nextStart);
  }
  const loadResults = (queryString: string): void => {
    getResult(queryString);
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

  const openSlideOut = (type) => {
    window.scrollTo(0,0);
    setSlideOutActive(true);
    setActiveSelect({
      type,
      list: state[`${type}List`]
    })
    
  }

  useEffect(() => {
    if(!geographyList.length) setGeographies();
    if(!sectorList.length) setSectors();
    if(!instrumentList.length) setInstruments();
  }, []);
  
  useEffect(() => {
    updateNext();
  }, [searchResult])

  useEffect(() => {
    if(containerRef.current) {
      updateNext();
    }
  }, [containerRef])

  useDidUpdateEffect(() => {
    setNext(PER_PAGE);
  }, [filters])

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
      onClick={() => { setSlideOutActive(false)}}
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
        geographyList={geographyList}
        newSearch={newSearch}
        setProcessing={setProcessing}
        updateFilters={updateFilters}
        filters={filters}
        headingClick={openSlideOut}
      />
        <SearchResults 
          policies={resultsByDocument} 
          searchQueryString={searchQueryString}
          searchTerms={searchQuery}
          processing={processing}
          geographyList={geographyList}
        />
      </div>
      
      {!endOfList ?
      <SearchNavigation onClick={handleNavigation} />
      : null
      }
      
      
    </MainLayout>
    </>
  )
});

export default Home;
