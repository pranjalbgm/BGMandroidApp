import apiClient from '../constants/api-client';
import {useQuery} from '@tanstack/react-query';
import {useUser} from '../constants/storage';

const fetchWalletAmount = mobileNumber =>
  apiClient.get(`player-wallet/${mobileNumber}/`).then(res => res.data);

const useWalletAmount = () => {
  const {mobileNumber} = useUser();

  const {
    data: walletAmount,
    error,
    isLoding,
  } = useQuery({
    queryKey: ['Wallet Amount'],
    queryFn: () => fetchWalletAmount(mobileNumber),
  });
  return {walletAmount, error, isLoding};
};

export default useWalletAmount;
