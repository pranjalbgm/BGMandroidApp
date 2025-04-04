import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchMobile } from "./useWallet";
import { adminApiClient } from "../constants/api-client";
import { usePlayerDataFetch } from "./useHome";


export const useNewBankVerify = () => {
 const [mobileNumber, setMobileNumber] = useState(null);

   const {refetch} = usePlayerDataFetch(mobileNumber);
 
     useEffect(() => {
        const initializeMobile = async () => {
          const fetchedMobile = await fetchMobile(setMobileNumber);
          if (fetchedMobile && mobileNumber) {
            // playerInfo.mutate({ mobile: fetchedMobile });
            refetch
          }
        };
        initializeMobile();
      }, []);
    

  return useQuery({
    queryKey: ["getNewBank", mobileNumber], // Unique query key per mobile
    queryFn: async () => {
      if (!mobileNumber) return null; // Prevent API call if mobileNumber is not available
      try {
        const response = await adminApiClient.get("change-bank-account-requests/", {
          params: { mobile: mobileNumber }, // Send mobile in query params
        });
        console.log("Bank API Response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error in useNewBankVerify:", error);
        throw error;
      }
    },
    enabled: !!mobileNumber, // Ensure the query runs only if mobileNumber is valid
  });
};
