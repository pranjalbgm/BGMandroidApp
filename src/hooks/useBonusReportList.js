
import {useQuery} from '@tanstack/react-query';
import {adminApiClient, adminApiClientNew} from '../constants/api-client';
import {usePlayerData} from './useHome';
import {useEffect, useState} from 'react';
import {fetchMobile} from './useWallet';

const fetchBonus = params =>
  adminApiClientNew
    .get('refered-bonus-list/', {params})
    .then(res => {
      console.log("----->>>>>>>>>>>>>>>>",res)
      return res.data.results});

const useReferedBonusList = (filters = {}) => {
  const [mobileNumber, setMobileNumber] = useState(null);
  const playerData = usePlayerData();
  useEffect(() => {
    if (!mobileNumber) {
      fetchMobile(setMobileNumber).then(mobile => playerData.mutate({mobile}));
    }
    console.log("this is refer bonus report ----------------------------true")
  }, [mobileNumber]);

  const params = {
    ...(filters.date && { date: filters.date }),
    ...(filters.status && { action: filters.status }),
    ...(filters.gateway && { gateway: filters.gateway }),
    ...(filters.searchValue && { search_query: filters.searchValue }),
    ...(filters.current_date &&
      filters.date_type === 'month' && { year_month: filters.current_date }),
    ...(filters.current_date &&
      filters.date_type === 'today' && { date: filters.current_date }),
    // action: filters.status,
  };
  
  if (filters.user_mobile && filters.parent_mobile) {
    params.parent_mobile = filters.parent_mobile;
    params.child_mobile = filters.user_mobile; // Assuming user_mobile is child_mobile
  } else if (filters.user_mobile) {
    params.user_mobile = filters.user_mobile;
  } else if (filters.parent_mobile) {
    params.parent_mobile = filters.parent_mobile;
  }
  
  console.log("params before sending to API:", params);
  
  const {
    data: bonusOn,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['referedBonusList', params],
    queryFn: () => fetchBonus(params),
  });
console.log("---------------",bonusOn)
  return {bonusOn, error, isLoading, refetch};
};

export default useReferedBonusList;
