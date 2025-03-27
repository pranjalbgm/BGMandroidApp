import React from 'react';
import apiClient from '../constants/api-client';
import {useQuery} from '@tanstack/react-query';

const fetchHelp = () => apiClient.get('help-list/').then(res => res?.data);
const useHelp = () => {
  const {
    data: help,
    error,
    isLoding,
  } = useQuery({
    queryKey: ['help'],
    queryFn: () => fetchHelp(),
  });
  return {help, error, isLoding};
};

export default useHelp;
