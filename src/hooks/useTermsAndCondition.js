import {useQuery} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

const fetchTermsAndCondition = () =>
  apiClient.get('terms-condition/').then(res => res.data);

const useTermsAndCondition = () => {
  const {
    data: TermsAndCondition,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['TermsAndCondition'],
    queryFn: () => fetchTermsAndCondition(),
  });

  return {TermsAndCondition, error, isLoading};
};

export default useTermsAndCondition;
