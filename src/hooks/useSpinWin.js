import {useMutation} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

const postMobileNumber = data => apiClient.post('create-spin-bonus/', data);

const useSpinWin = () => {
  return useMutation({
    mutationKey: ['Spin Win'],
    mutationFn: data => postMobileNumber(data),
  });
};

export default useSpinWin;
