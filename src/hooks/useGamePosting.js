import React from 'react';
import { NodeapiClient } from '../constants/api-client';
import { useQuery, useMutation } from '@tanstack/react-query';

const fetchGamePosting = async () => {
  const response = await NodeapiClient.get('game-posting-chats/');
  return response?.data?.slice(0, 10); // Get only the latest 10 entries
};

const useGamePosting = () => {
  const {
    data: gamePosting,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['GamePosting'],
    queryFn: fetchGamePosting,
  });

  return { gamePosting, error, isLoading, refetch };
};

export default useGamePosting;

export const useGamePostSeen = () => {
  return useMutation({
    mutationKey: ['GamePostSeen'],
    mutationFn: (mobileNumber) =>
      apiClient
        .post('game-post-seen/', { mobile: mobileNumber })
        .then((res) => res.data)
        .catch((err) => console.log(err)),
  });
};
