import React from 'react';
import apiClient from '../constants/api-client';
import {useQuery} from '@tanstack/react-query';

const fetchResultHistory = () =>
  apiClient.get('result-history/').then(res => res?.data);
const useResultHistory = () => {
  const {
    data: resultHistory,
    error,
    isLoding,
  } = useQuery({
    queryKey: ['Result History'],
    queryFn: () => fetchResultHistory(),
  });
  return {resultHistory, error, isLoding};
};

export default useResultHistory;
