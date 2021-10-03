import { useState, useEffect } from 'react';
import { getPolicies } from '../api';
import { Policy } from '../model/policy';
import Layout from '../components/Layout'
import Head from 'next/head';
import { SearchArea, SearchResults, SearchNavigation } from '../components/search';
import Loader from '../components/Loader';
import { PER_PAGE } from '../constants';


export default function Home(): JSX.Element {
  const [ policies, setPolicies ] = useState([]);
  const [ query, setQuery ] = useState('');
  const [ first, setFirst ] = useState(1)
  const [ processing, setProcessing ] = useState(false);

  const loadPolicies = async (start?: number): Promise<void> => {
    const data = await getPolicies(start);
    const list = data.policies;
    setProcessing(false);
    setPolicies(updateList(list, start));
    setFirst(PER_PAGE + first);
  }
  const updateList = (list: Policy[], start?: number): Policy[] => {
    if(start) {
      return [...policies, ...list]
    }
    return list;
  }
  const handleChange = async (): Promise<void> => {
    if(query.trim().length === 0) return;
    setPolicies([]);
    setQuery(query);
    setFirst(0)
    loadPolicies();
  }
  const handleNavigation = (): void => {
    loadPolicies(first);
  }
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
      />

      {policies.length ?
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
