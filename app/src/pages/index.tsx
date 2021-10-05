import { useState, useEffect } from 'react';
import { loadGeographies, getPolicies, searchQuery } from '../api';
import { Policy } from '../model/policy';
import Layout from '../components/Layout'
import Head from 'next/head';
import { SearchArea, SearchResults, SearchNavigation } from '../components/search';
import Loader from '../components/Loader';
import { PER_PAGE } from '../constants';


export default function Home(): JSX.Element {
  const [ policies, setPolicies ] = useState([]);
  const [ endOfList, setEndOfList ] = useState(false);
  const [ query, setQuery ] = useState('');
  const [ next, setNext ] = useState(0);
  const [ processing, setProcessing ] = useState(false);
  const [ geographies, setGeographies ] = useState([]);

  const loadResults = async (query: string, start: number = 0): Promise<void> => {
    const data = await searchQuery(query, start);
    const list = data.resultsByDocument;
    setProcessing(false);
    setPolicies(updateList(list, start));
    setNext(PER_PAGE + start);
    checkIfEnd(data.metadata);
  }
  const updateList = (list: Policy[], start?: number): Policy[] => {
    if(start) {
      return [...policies, ...list]
    }
    return list;
  }
  const checkIfEnd = (metadata) => {
    const end = metadata.numDocsReturned < PER_PAGE;
    setEndOfList(end);
  }
  const handleChange = async (): Promise<void> => {
    if(query.trim().length === 0) return;
    setPolicies([]);
    setQuery(query);
    setNext(0);
    loadResults(query);
  }
  const handleNavigation = (): void => {
    loadResults(query, next);
  }
  const getGeographies = async () => {
    const geos = await loadGeographies();
    setGeographies(geos);
  }
  useEffect(() => {
    getGeographies();
  }, [])
  return (
    <Layout>
      <Head>
        <title>Policy Search</title>
      </Head>
      <SearchArea 
        handleChange={handleChange}
        query={query}
        setQuery={setQuery}
        setProcessing={setProcessing}
      />
      <SearchResults 
        policies={policies} 
        query={query} 
        processing={processing}
        geographies={geographies}
      />

      {policies.length && !endOfList ?
      <SearchNavigation onClick={handleNavigation} />
      : null
      }
      {processing ? 
        <Loader />
        : null
      }
      
    </Layout>
  )
}
