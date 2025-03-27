import React from 'react';
import apiClient, {adminApiClient} from '../constants/api-client';
import {useQuery} from '@tanstack/react-query';

const fetchDecemberMonthResult = params =>
  adminApiClient
    .get('result-list/', {params})
    .then(res => res.data)
    .catch(error => {
      console.error('Error fetching December month results:', error); // Log the error
      throw error; // Rethrow the error so that useQuery can catch it
    });

const useDecemberMonthResult = ({date = ''} = {}) => {
  const params = {
    ...(date && {year_month: date}),
  };

  const {
    data: resultData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['December Month Results', params],
    queryFn: () => fetchDecemberMonthResult(params),
    onSuccess: data => {
      console.log('Fetched data in query:', data);
    },
    onError: err => {
      console.error('Error in useQuery:', err); // Log error if the query fails
    },
  });

  // If the data structure is nested in "results", we access it like this
  const result = resultData?.results || [];

  // Check for errors in the hook's error property
  if (error) {
    console.error(
      'Error fetching December month results (from useQuery):',
      error,
    );
  }

  return {result, error, isLoading};
};

export default useDecemberMonthResult;
