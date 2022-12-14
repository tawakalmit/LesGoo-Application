import React from 'react';
import { useState, useEffect } from 'react';
import Navbarback from '../../components/navbarback';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function JoinGroup() {
  const [join, setJoin] = useState({
    group_id: '',
    latitude: null,
    longitude: null,
  });

  const token = getCookie('usr_token');
  const group_id = getCookie('usr_group_id');

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('login');
    }
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setJoin((state) => ({
        ...state,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  }, []);

  const handleChangeGroupId = (e) => {
    setJoin((state) => ({ ...state, group_id: e.target.value }));
  };

  const handleSubmitJoin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/group/join`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(join),
        }
      );
      const data = await response.json();
      if (response.status < 300) {
        setCookie('usr_group_id', join.group_id);
        router.push(`/group/${join.group_id}`);
      } else if (response.status >= 300) {
        throw data.message;
      }
    } catch (error) {
      console.log('error:', error);
      alert(error);
    }
  };

  return (
    <div className='bg-[#ecf0f1] border-0 h-screen md:h-screen w-[425px] mx-auto border-2 border-[#2c3e50] pb-10'>
      <Head>
        <title>LesGoo | Join Group</title>
        <link rel='icon' href='/icon.png' />
      </Head>
      <Navbarback title={'Join Group'} />
      <form onSubmit={handleSubmitJoin} className='w-10/12 mx-auto mt-5'>
        <input
          onChange={handleChangeGroupId}
          id='input-groupid'
          type='text'
          placeholder=' Enter Group ID'
          className='w-full pl-2 bg-[#D9D9D9] h-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400'
        />
        <div className='flex justify-end'>
          <button
            type='submit'
            id='btn-join'
            className='w-16 h-7 bg-[#1abc9c] rounded-full text-white mt-3'
          >
            Join
          </button>
        </div>
      </form>
    </div>
  );
}
