import { useState, useEffect } from 'react';
import { getPolicies } from '../api';
import Link from 'next/link';
import Layout from '../components/Layout'
import Head from 'next/head';
import { SearchArea, SearchResults } from '../components/search';
import Loader from '../components/Loader';

export default function Home() {
  const [ policies, setPolicies ] = useState([]);
  const [ query, setQuery ] = useState('');
  const [ processing, setProcessing ] = useState(false);

  const handleChange = async () => {
    if(query.trim().length === 0) return;
    const list = await getPolicies();
    setProcessing(false);
    setPolicies(list);
    setQuery(query);
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
      {/* <Loader /> */}
    </Layout>
  )
}
