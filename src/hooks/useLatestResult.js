import {useQuery} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

const fetchLatestResult = () =>
  apiClient.get('latest-result/').then(res => res.data);

const useLatestResult = () => {
  const {
    data: latestResult,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['Latest Result'],
    queryFn: () => fetchLatestResult(),
  });

  return {latestResult, error, isLoading};
};

export default useLatestResult;
