import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getData} from '../constants/storage';
import apiClient from '../constants/api-client';
import {useEffect, useState} from 'react';

export const fetchMobile = setMobile => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getData('user');
      if (user) {
        setMobile(user?.mobile); // Set mobile number
        resolve(user?.mobile); // Resolve with mobile number
      } else {
        console.error('Mobile number is missing in user data.');
        setMobile(null); // Set mobile to null if it's undefined
        resolve(null); // Resolve with null when no user data is found
      }
    } catch (error) {
      reject(error); // Reject on error
    }
  });
};

const fetchWalletAmount = mobile =>
  apiClient.get(`player-wallet/${mobile}/`).then(res => res.data);

const useWallet = () => {
  const [mobile, setMobile] = useState(null);

  useEffect(()=> {
    fetchMobile(setMobile);
  },[])
  // useEffect(() => {
  //   const getUserMobile = async () => {
  //     await fetchMobile(setMobile);
  //   };
  //   getUserMobile();
  // }, []);

  const {
    data: wallet,
    error,
    isLoading,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ['walletAmount', mobile],
    queryFn: () => fetchWalletAmount(mobile),
    enabled: !!mobile,
  });

  return {wallet, error, isLoading, refetchWallet};
};

export default useWallet;
