import React from 'react';
import {NodeapiClient} from '../constants/api-client';
import {useQuery} from '@tanstack/react-query';

const fetchGamePosting = () =>
  NodeapiClient.get('game-posting-chats/').then(res => res?.data);

const useGamePosting = () => {
  const {
    data: gamePosting,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['GamePosting'],
    queryFn: () => fetchGamePosting(),
  });
  return {gamePosting, error, isLoading, refetch};
};

export default useGamePosting;

export const useGamePostSeen = () => {
  return useMutation({
    mutationKey: ['GamePostSeen'],
    mutationFn: mobileNumber =>
      apiClient
        .post('game-post-seen/', {mobile: mobileNumber})
        .then(res => res.data)
        .catch(err => console.log(err)),
  });
};
