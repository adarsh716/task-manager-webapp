"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');  

    if (token) {
      router.push('/tasks/view');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
    </>
  );
};

export default Home;
