import { useMutation } from '@tanstack/react-query';
import apiClient from '../constants/api-client';

// API function
const verifyBankDetails = async (data) => {
  const response = await apiClient.post('bank_verify/', data);
  return response.data;
};

// Custom hook for bank verification
export const useBankVerification = () => {
  const mutation = useMutation({
    mutationFn: verifyBankDetails,
    onSuccess: (data) => {
      console.log(data.msg === "verified" ? '✅ Bank verified successfully' : '⚠️ Verification failed', data);
    },
    onError: (error) => {
      console.error('❌ Error:', error.response?.data?.message || error.message);
    },
  });

  return {
    verifyBank: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
};
