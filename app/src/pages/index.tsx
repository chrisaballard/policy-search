import axios from 'axios';
import { useState, useEffect } from 'react';
import { getPolicies } from '../api';
import Link from 'next/link';
import Layout from '../components/Layout'
import SearchArea from '../components/SearchArea';
import { Head } from 'next/document';

export default function Home() {
  const [ policies, setPolicies ] = useState([])
  const handleChange = async () => {
    const list = await getPolicies();
    setPolicies(list);
  }
  return (
    <Layout>
      {/* <Head>
        <title>Policy Search</title>
      </Head> */}
      <SearchArea onChange={handleChange} />
    </Layout>
  )
}
