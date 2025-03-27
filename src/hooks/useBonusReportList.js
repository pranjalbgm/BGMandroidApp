// import { useQuery } from "@tanstack/react-query";
// import { adminApiClient } from "../constants/api-client";
// import { useUser } from "../constants/UserContext";

// // Function to fetch the bonus data from API
// const fetchBonus = (params) =>
//   adminApiClient.get("refered-bonus-list/", { params }).then((res) => res.data);

// const useReferedBonusList = ({
//   date = "",
//   status = "",
//   gateway = "",
//   mobile = "",
//   searchValue = "",
//   current_date = "",
//   date_type = "",
// } = {}) => {

//   const { mobileNumber } = useUser(); // Get mobile number from context

//   const params = {
//     ...(date && { date }),
//     ...(status && { action: status }),
//     ...(gateway && { gateway }),
//     // Update to use `parent_mobile` instead of `mobile`
//     ...(mobile || mobileNumber ? { parent_mobile: mobile || mobileNumber } : {}),
//     ...(searchValue && { search_query: searchValue }),
//     ...(current_date && date_type === "month" && { year_month: current_date }),
//     ...(current_date && date_type === "today" && { date: current_date }),
//   };

//   // React Query hook to fetch bonus data
//   const { data: bonusOn, error, isLoading, refetch } = useQuery({
//     queryKey: ["referedBonusList", params], // Clean query key
//     queryFn: () => fetchBonus(params),
//   });

//   return { bonusOn, error, isLoading, refetch };
// };

// export default useReferedBonusList;

import {useQuery} from '@tanstack/react-query';
import {adminApiClient} from '../constants/api-client';
import {usePlayerData} from './useHome';
import {useEffect, useState} from 'react';
import {fetchMobile} from './useWallet';

const fetchBonus = params =>
  adminApiClient
    .get('refered-bonus-list/', {params})
    .then(res => res.data.results);

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
    ...(filters.date && {date: filters.date}),
    ...(filters.status && {action: filters.status}),
    ...(filters.gateway && {gateway: filters.gateway}),
    parent_mobile: filters.mobile || mobileNumber,
    ...(filters.searchValue && {search_query: filters.searchValue}),
    ...(filters.current_date &&
      filters.date_type === 'month' && {year_month: filters.current_date}),
    ...(filters.current_date &&
      filters.date_type === 'today' && {date: filters.current_date}),
  };

  const {
    data: bonusOn,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['referedBonusList', params],
    queryFn: () => fetchBonus(params),
  });

  return {bonusOn, error, isLoading, refetch};
};

export default useReferedBonusList;
