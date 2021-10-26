import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../components/layouts/MainLayout'
import Head from 'next/head';
import { SearchInput, SearchNavigation, SearchResults } from '../components/search';
import FiltersColumn from '../components/blocks/filters/FiltersColumn';
import Overlay from '../components/Overlay';
import { PER_PAGE } from '../constants';
import useGetSearchResult from '../hooks/useSetSearchResult';
import useGeographies from '../hooks/useGeographies';
import useSectors from '../hooks/useSectors';
import useInstruments from '../hooks/useInstruments';
import useSetStatus from '../hooks/useSetStatus';
import useBuildQueryString from '../hooks/useBuildQueryString';
import useGetPolicies from '../hooks/useGetPolicies';
import { useDidUpdateEffect } from '../hooks/useDidUpdateEffect';
import SlideOut from '../components/modal/SlideOut';
import MultiSelect from '../components/blocks/filters/MultiSelect';
import useFilters from '../hooks/useFilters';
import { State } from '../store/initialState';
import PolicyList from '../components/policies/PolicyList';
import Loader from '../components/Loader';

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
  const [ removeFilters, updateFilters, checkForFilters ] = useFilters();
  const setSectors = useSectors();
  const setInstruments = useInstruments();
  const [ policy, policy_db, getPolicy, getPolicies ] = useGetPolicies();
  const setProcessing = useSetStatus();
  const [ buildQueryString ] = useBuildQueryString();

  // destructure from state
  const { status, filters, geographyList, sectorList, instrumentList } = state;
  const { processing } = status;
  const { searchQuery, metadata, resultsByDocument, endOfList } = searchResult;

  const updateNext = () => {
    const nextStart = document.getElementsByClassName('search-result').length;
    setNext(nextStart);
  }
  const loadResults = (queryString: string): void => {
    getResult(queryString);
  }

  const newSearch = (queryString) => {
    setProcessing(true);
    // reset current search results
    clearResult();
    // reset next page
    setNext(PER_PAGE);
    // load results
    loadResults(queryString);
  }
  const handleNavigation = (): void => {
    setProcessing(true);
    const qStr = buildQueryString(searchQuery);
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

  const renderContent = () => {
    if(resultsByDocument.length || searchQuery) {
      return (
        <SearchResults 
          policies={resultsByDocument} 
          searchTerms={searchQuery}
          processing={processing}
          geographyList={geographyList}
          handleNavigation={handleNavigation}
          endOfList={endOfList}
        />
      )
    }
    if(policy_db.policies.length && !processing) {
      return (
        <PolicyList
          policy_db={policy_db}
          geographyList={geographyList}
          processing={processing}
        />
      )
    }
    
  }

  useEffect(() => {
    if(!geographyList.length) setGeographies();
    if(!sectorList.length) setSectors();
    if(!instrumentList.length) setInstruments();
  }, []);

  useDidUpdateEffect(() => {
    if(geographyList.length && !policy_db?.policies.length) {
      // getPolicies();
      newSearch('');
    }
  }, [geographyList])
  
  useDidUpdateEffect(() => {
    updateNext();
  }, [searchResult])

  useDidUpdateEffect(() => {
    setNext(PER_PAGE);
    const queryString = buildQueryString(searchQuery);
    newSearch(queryString);
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
        clearResult={clearResult}
        searchTerms={searchQuery}
      />
      <div ref={containerRef} className="relative container md:flex w-full">
        <FiltersColumn
          geographyList={geographyList}
          updateFilters={updateFilters}
          removeFilters={removeFilters}
          filters={filters}
          headingClick={openSlideOut}
          checkForFilters={checkForFilters}
        />
        <section className="w-full">
          <div className="pt-8 md:pt-0 md:pl-4">
            <SearchResults 
              policies={resultsByDocument} 
              searchTerms={searchQuery}
              processing={processing}
              geographyList={geographyList}
              handleNavigation={handleNavigation}
              endOfList={endOfList}
            />
            {processing ? 
              <Loader />
              : null
            }
            {!endOfList ?
              <SearchNavigation onClick={handleNavigation} />
              : null
            }
          </div>
        </section>
      </div>
    </MainLayout>
    </>
  )
});

export default Home;
