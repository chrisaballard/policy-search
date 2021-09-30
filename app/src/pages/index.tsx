import axios from 'axios';
import { useState, useEffect } from 'react';
import { getPolicies } from '../api';
import Link from 'next/link';
import Layout from '../components/Layout'
import SearchArea from '../components/SearchArea';
import Head from 'next/head';

export default function Home() {
  const [ policies, setPolicies ] = useState([])
  const handleChange = async (query) => {
    if(query.trim().length === 0) return;
    const list = await getPolicies();
    console.log(list)
    setPolicies(list);
  }
  return (
    <Layout>
      <Head>
        <title>Policy Search</title>
      </Head>
      <SearchArea handleChange={handleChange} />
    </Layout>
  )
}
