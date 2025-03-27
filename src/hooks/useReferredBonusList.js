import {useQuery} from '@tanstack/react-query';

const fetchData = async (parentMobile, childMobile) => {
  const response = await fetch(
    `https://admin.thebgmgame.com/dashboard/refered-bonus-list/?parent_mobile=${parentMobile}&child_mobile=${childMobile}`,
  );
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  const data = await response.json();
  return data.results; // Return the data from 'results' directly
};

// Custom hook for referring bonus data
const useReferredBonusList = (parent_mobile, child_mobile) => {
  return useQuery({
    queryKey: ['referredBonusList', parent_mobile, child_mobile], // The query key must be unique
    queryFn: () => fetchData(parent_mobile, child_mobile), // Function to fetch data
    onSuccess: data => {
      // Log the data when the query is successful
      console.log('Data received:', data);
    },
    onError: error => {
      // Log any error that occurs
      console.error('Error fetching bonus list:', error);
    },
  });
};

export default useReferredBonusList;
