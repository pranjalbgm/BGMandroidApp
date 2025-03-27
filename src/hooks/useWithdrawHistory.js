import {useMutation} from '@tanstack/react-query';
import {useUser} from '../constants/storage';
import apiClient from '../constants/api-client';

const postMobileNumber = mobileNumber =>
  apiClient.post('withdraw-history/', mobileNumber);

const useWithdrawHistory = () => {
  const {mobileNumber} = useUser();

  return useMutation({
    mutationKey: ['WithdrawHistory'],
    mutationFn: () => postMobileNumber({mobile: mobileNumber}),
  });
};

export default useWithdrawHistory;
