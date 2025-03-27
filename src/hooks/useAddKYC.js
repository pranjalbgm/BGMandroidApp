import {useMutation} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

const useAddKYC = () => {
  return useMutation({
    mutationKey: ['Edit User'],
    mutationFn: ({id, data}) =>
      apiClient.put(`player-update/${id}/`, data).then(res => res.data),
  });
};

export default useAddKYC;

export const useVerifyAadhaar = () => {
  return useMutation({
    mutationKey: ['Verify Aadhaar'],
    mutationFn: data =>
      apiClient.post('aadhar-verify/', data).then(res => {
        // console.log('API Response:', res.data); // Log the response data
        return res.data; // Ensure the data is returned
      }),
    onError: error => {
      console.error('Aadhaar verification failed:', error.response || error);
    },
  });
};

export const useResetVerifyAadhaar = () => {
  return useMutation({
    mutationKey: ['Reset Aadhaar'],
    mutationFn: data =>
      apiClient.put('aadhar-verify/', data).then(res => res.data),
  });
};

export const useVerifyPan = () => {
  return useMutation({
    mutationKey: ['Verify Pan'],
    mutationFn: data =>
      apiClient.post('pan-verify/', data).then(res => res.data),
  });
};

export const useResetVerifyPan = () => {
  return useMutation({
    mutationKey: ['Reset Pan'],
    mutationFn: data =>
      apiClient.put('pan-verify/', data).then(res => res.data),
  });
};
