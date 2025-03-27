import React, { useState, useEffect } from 'react';
import apiClient from '../constants/api-client';
import { useQuery } from '@tanstack/react-query';
import { fetchMobile } from './useWallet';

const fetchPlayerDetails = mobileNumber => 
  apiClient.get(`player-bonus/${mobileNumber}/`)
    .then(res => {
      console.log('✅ Success:', res.data);
      return res.data;
    })
    .catch(err => {
      console.error('❌ API Error:', err);
      throw err;
    });

const usePlayerProfile = () => {
  const [mobile, setMobile] = useState('');

  // Fetch mobile number once component mounts
  useEffect(() => {
    fetchMobile(setMobile);
    console.log("this is useplayerProfile ----------------------------true")
  }, []);

  const {
    data: playerDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['Player Details', mobile],  // Added mobile to trigger refetch when it updates
    queryFn: () => fetchPlayerDetails(mobile),
    enabled: !!mobile, // Prevents fetching until mobile is set
  });

  if (error) {
    console.error('❌ Query Error:', error);
  }
  if (playerDetails) {
    console.log('✅ Player Details Fetched:', playerDetails);
  }

  return { playerDetails, error, isLoading };
};

export default usePlayerProfile;
