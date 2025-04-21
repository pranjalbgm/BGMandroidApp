import {useMutation} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

const postMobileNumber = withdrawlBonus =>
  apiClient.post('create-bonus/', withdrawlBonus);

const useCreateBonu = () => {
  return useMutation({
    mutationKey: ['Withdraw Points'],
    mutationFn: amount => postMobileNumber(amount),
    onSuccess: data => console.log(data),
  });
};

export default useCreateBonu;
