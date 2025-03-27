import {useQuery} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

const fetchMarkets = () =>
  apiClient
    .get('all-market/')
    .then(res =>
      res.data.sort((a, b) => a.market_position - b.market_position),
    );

const useMarkets = () => {
  const {
    data: markets,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['Markets'],
    queryFn: () => fetchMarkets(),
    onError: () => console.log('market data1 ------->', error),
    onSuccess: () => console.log('on success market ', markets, isLoading),
  });
  // console.log('market data ------->', markets, isLoading);
  return {markets, error, isLoading};
};

export default useMarkets;
