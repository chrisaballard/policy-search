import axios from 'axios';
import { useState, useEffect } from 'react';
import { getPolicies } from '../lib/api';
import Link from 'next/link';
import Layout from '../components/Layout'
import SearchArea from '../components/SearchArea';
import { Head } from 'next/document';

export default function Home() {

  return (
    <Layout>
      {/* <Head>
        <title>Policy Search</title>
      </Head> */}
      <SearchArea />
    </Layout>
  )
}
