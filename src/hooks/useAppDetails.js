import React from 'react';
import apiClient from '../constants/api-client';
import {useQuery} from '@tanstack/react-query';

const fetchAppDetails = () =>
  apiClient.get('app-detail/').then(res => res?.data);

const useAppDetails = () => {
  const {
    data: details,
    error,
    isLoding,
  } = useQuery({
    queryKey: ['Details'],
    queryFn: () => fetchAppDetails(),
  });

  return {details, error, isLoding};
};

export default useAppDetails;
