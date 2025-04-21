import {useMutation} from '@tanstack/react-query';
import {useUser} from '../constants/storage';
import apiClient from '../constants/api-client';
import {useEffect, useState} from 'react';
import {fetchMobile} from './useWallet';

const postMobileNumber = withdrawlPoints =>
  apiClient.post('create-withdraw/', withdrawlPoints);

const useWithdrawPoints = () => {
  const [mobile, setMobile] = useState('');

  useEffect(()=> {
      fetchMobile(setMobile);
    },[])

  return useMutation({
    mutationKey: ['Withdraw Points'],
    mutationFn: points => postMobileNumber({mobile, amount: points}),
    onSuccess: data => console.log(data),
  });
};

export default useWithdrawPoints;
