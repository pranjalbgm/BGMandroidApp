import {useQuery} from '@tanstack/react-query';
import {useState, useEffect} from 'react';
import {fetchMobile} from './useWallet';
import apiClient, {adminApiClient} from '../constants/api-client';

const postMobileNumber = params =>
  adminApiClient
    .get('bet-details/', {params})
    .then(res => {
      // console.log('API Response Success:', res.data); // Log the successful API response
      return res.data || {}; // Return the full response, so we can access both results and pagination data
    })
    .catch(error => {
      // console.error('API Response Error:', error); // Log any API errors
      throw error; // Rethrow the error to let react-query handle it
    });

const useMyPlayHistory = ({
  market = '',
  date = "2024-12-14",
  initialPage = 1,
  pageSize = 10,
} = {}) => {
  const [mobile, setMobile] = useState(null);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const initializeMobile = async () => {
      const fetchedMobile = await fetchMobile(setMobile);
      if (fetchedMobile && mobile) {
        // playerInfo.mutate({ mobile: fetchedMobile });
        refetch()
      }
    };
    initializeMobile();
  }, []);

  const params = {
    ...(market && {market}),
    ...(date && {date}),
    mobile,
    page,
    page_size: pageSize, // Add pagination parameters
  };

  console.log("params----------------------------",params)

  const {
    data: myPlayHistory,
    error,
    isLoading,
    isPreviousData,
    refetch,
  } = useQuery({
    queryKey: ['MyPlayHistory', params],
    queryFn: () => postMobileNumber(params),
    keepPreviousData: true, // Keep previous data while loading the next page
    onSuccess: data => {
      console.log('Query Success:', data); // Log successful query data
    },
    onError: error => {
      console.error('Query Error:', error); // Log query errors
    },
  });

  const nextPage = () => {
    if (myPlayHistory?.next) {
      setPage(prev => prev + 1); // Increment page number
    }
  };

  const prevPage = () => {
    if (myPlayHistory?.previous) {
      setPage(prev => prev - 1); // Decrement page number
    }
  };

  const isNextDisabled = !myPlayHistory?.next;
  const isPrevDisabled = !myPlayHistory?.previous;

  return {
    myPlayHistory: myPlayHistory?.results || [], // Extract results
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

export default useMyPlayHistory;
