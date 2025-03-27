import {useQuery} from '@tanstack/react-query';
import {useState, useEffect} from 'react';
import {adminApiClient} from '../constants/api-client';
import {fetchMobile} from './useWallet';

const useTransactionHistory = ({initialPage = 1, pageSize = 10}) => {
  const [mobile, setMobile] = useState(null);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    if(!mobile){
      fetchMobile(setMobile); // Fetch mobile number if needed
    }
    console.log("this is usedeposit history ----------------------------true")
  }, [mobile]);

  const params = {
    mobile,
    page,
    page_size: pageSize,
  };

  const {
    data: transactionHistory,
    error,
    isLoading,
    isPreviousData,
    refetch,
  } = useQuery({
    queryKey: ['TransactionHistory', params],
    queryFn: () =>
      adminApiClient.get('transaction-list/', {params}).then(res => res.data),
    enabled: !!mobile, // Only fetch data when mobile number is available
    keepPreviousData: true, // Keep previous data while loading the next page
  });

  const nextPage = () => {
    if (transactionHistory?.next) {
      setPage(prev => prev + 1); // Increment page number
    }
  };

  const prevPage = () => {
    if (transactionHistory?.previous) {
      setPage(prev => prev - 1); // Decrement page number
    }
  };

  const isNextDisabled = !transactionHistory?.next;
  const isPrevDisabled = !transactionHistory?.previous;

  return {
    transactions: transactionHistory?.results || [], // Extract the results array
    error,
    isLoading,
    refetch,
    nextPage,
    prevPage,
    isNextDisabled,
    isPrevDisabled,
    currentPage: page,
  };
};

export default useTransactionHistory;
