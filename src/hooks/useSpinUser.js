import {useQuery} from '@tanstack/react-query';
import {adminApiClient} from '../constants/api-client';
import {useUser} from '../constants/storage';
import {fetchMobile} from './useWallet';
import {useEffect, useState} from 'react';

const fetchSpinUser = params =>
  adminApiClient.get('player-refered-list/', {params}).then(res => res.data);

const useSpinUser = () => {
  const [mobile, setMobile] = useState('');

 useEffect(()=> {
     fetchMobile(setMobile);
   },[])

  const params = {
    mobile,
  };

  const {
    data: spinUser,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [' spin user'],
    queryFn: () => fetchSpinUser(params),
  });

  return {spinUser, error, isLoading, refetch};
};

export default useSpinUser;
