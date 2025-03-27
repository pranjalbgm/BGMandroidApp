import React from 'react';
import apiClient from '../constants/api-client';
import {useQuery} from '@tanstack/react-query';

const fetchLoginContent = () =>
  apiClient.get('login-content/').then(res => res?.data);
const useLoginContent = () => {
  const {
    data: loginContent,
    error,
    isLoding,
  } = useQuery({
    queryKey: ['loginContent'],
    queryFn: () => fetchLoginContent(),
  });
  return {loginContent, error, isLoding};
};

export default useLoginContent;
