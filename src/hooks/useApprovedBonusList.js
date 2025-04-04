import { useQuery } from "@tanstack/react-query";
import { adminApiClient, adminApiClientNew } from "../constants/api-client";
import { useEffect, useState } from "react";
import { fetchMobile } from "./useWallet";
import { usePlayerData } from "./useHome";


const fetchBonus = (params) =>
  adminApiClientNew.get("getReferBonus_player_wise/", { params }).then((res) => {
    console.log("this is approved list of bonus ---------------------",res.data)
    return res.data.results});

const useApprovedBonusList = (filters = {}) => {
    const [mobileNumber, setMobileNumber] = useState(null);
      const playerData = usePlayerData();
      useEffect(() => {
        if (!mobileNumber) {
          fetchMobile(setMobileNumber).then(mobile => playerData.mutate({mobile}));
        }
      }, [mobileNumber]);
    
  const params = {
    ...(filters.date && { date: filters.date }),
    ...(filters.status && { action: filters.status }),
    ...(filters.gateway && { gateway: filters.gateway }),
         mobile: filters.mobile || mobileNumber,
    ...(filters.searchValue && { search_query: filters.searchValue }),
    ...(filters.current_date &&
      filters.date_type === "month" && { year_month: filters.current_date }),
    ...(filters.current_date &&
      filters.date_type === "today" && { date: filters.current_date }),
  };

  const { data: bonusOn, error, isLoading, refetch } = useQuery({
    queryKey: ["referedBonusList", params],
    queryFn: () => fetchBonus(params),
  });

  return { bonusOn, error, isLoading, refetch };
};

export default useApprovedBonusList;
