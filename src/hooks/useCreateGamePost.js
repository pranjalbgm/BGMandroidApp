import {useMutation} from '@tanstack/react-query';
import apiClient from '../constants/api-client';
import {fetchMobile} from './useWallet';
import {useEffect, useState} from 'react';

// Function to make the API request
const postMobileNumber = data =>
  apiClient.post('create-game-post/', data).then(res => {
    console.log(res.data);
    return res.data;
  });

const useCreateGamePost = () => {
  const [mobile, setMobile] = useState('');

  useEffect(()=> {
      fetchMobile(setMobile);
    },[])
  return useMutation({
    mutationKey: ['Gamepost'],
    mutationFn: () => postMobileNumber(mobile), // Return the promise here,
    onSuccess: data => {
      console.log('onSuccess', data); // The data will now be the response from the API
    },
    onError: error => {
      console.log('onError', error); // Log error if any
    },
  });
};

export default useCreateGamePost;
