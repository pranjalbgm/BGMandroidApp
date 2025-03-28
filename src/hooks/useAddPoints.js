import {useMutation, useQuery} from '@tanstack/react-query';
import apiClient from '../constants/api-client';
import {useState} from 'react';
import {fetchMobile} from './useWallet';

// const postMobileNumber = (data) =>
//   apiClient.post("create-deposits/", data).then((res) => res.data).catch(err => console.log(err.response));

const postMobileNumber = async data => {
  try {
    const response = await apiClient.post('create-deposits/', data);
    console.log("API Response: -----------------------", response.data);
    return response.data; // Return only the data part
  } catch (error) {
    if (error.response) {
      // Server responded with a status outside the 2xx range
      // console.error("API Error Response: ", error.response.data);
      throw error.response.data; // Throw response data for mutation's `onError`
    } else if (error.request) {
      // Request was made but no response received
      // console.error("API Request Error: ", error.request);
      throw new Error('No response from server.');
    } else {
      // Something else went wrong
      // console.error("Unexpected Error: ", error.message);
      throw new Error(error.message);
    }
  }
};

const useAddPoints = () => {
  const [mobile, setMobile] = useState('');

  fetchMobile(setMobile);

  return useMutation({
    mutationKey: ['AddPoints'],
    mutationFn: data => postMobileNumber({mobile, ...data}),
    onSuccess: data => console.log('on success ---------->', data),
    onError: error => console.log('on error ---------->', error),
  });
};

export default useAddPoints;

export const useMidSetting = () => {
  const {
    data: midSettings,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['MidSetting'],
    queryFn: () => apiClient.get('manual/').then(res => res.data),
  });

  return {midSettings, error, isLoading, refetch};
};

export const useMidSettingManualAccount = () => {
  const {
    data: midSettingsManualAccount,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['MidSettingManualAccount'],
    queryFn: () => apiClient.get('manual-account/').then(res => res.data),
  });

  return {midSettingsManualAccount, error, isLoading, refetch};
};

export const useMidSettingUpiGateway = () => {
  const {
    data: midSettingsUpiGateway,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['MidSettingUpiGateway'],
    queryFn: () => apiClient.get('upi-gateway-id/').then(res => res.data),
  });

  return {midSettingsUpiGateway, error, isLoading, refetch};
};

export const useFrontSettings = () => {
  const {
    data: forntSettings,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['Front Settings'],
    queryFn: () => apiClient.get('front/').then(res => res.data),
  });

  return {forntSettings, error, isLoading, refetch};
};

export const useMidSettingManualMerchantAccount = () => {
  const {
    data: midSettingsManualMerchantAccount = [], // Default to an empty array
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['MidSettingManualMerchantAccount'],
    queryFn: () => apiClient.get('manual-merchant-id/').then(res => res.data),
  });

  return { midSettingsManualMerchantAccount, error, isLoading, refetch };
};

