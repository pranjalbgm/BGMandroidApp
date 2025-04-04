
import { useQuery, useMutation } from "@tanstack/react-query";
import {  NodeapiClient } from "../constants/api-client";
import { useUser } from "../constants/UserContext";
import { fetchMobile } from "./useWallet";
import { useEffect, useState } from "react";

// Fetch MPIN using GET
const fetchMpin = (mobileNumber) =>
  NodeapiClient
    .get("/get-mpin", { params: { mobile: mobileNumber } })
    .then((res) => res.data);

// Change MPIN using POST
const changeMpin = ({ mobile, mpin, reMpin }) =>
  NodeapiClient
    .post("/mpin-change", { mobile, mpin, reMpin })
    .then((res) => res.data);

const useMpin = () => {
   const [mobileNumber,setMobile] = useState("");
 useEffect(() => {
       const initializeMobile = async () => {
         const fetchedMobile = await fetchMobile(setMobile);
         if (fetchedMobile) {
           playerData.refetch(fetchedMobile);
         }
       };
       initializeMobile();
     }, []);

  // Fetch data (GET request)
  const { data: mpinData, error, isLoading, refetch } = useQuery({
    queryKey: ["mpin", mobileNumber],
    queryFn: () => fetchMpin(mobileNumber),
    enabled: !!mobileNumber, // Only fetch if mobileNumber is available
  });

  // Post data (MPIN change)
  const { mutate: changeMpinMutate, isLoading: isChanging, error: changeError } = useMutation({
    mutationFn: changeMpin,
    onSuccess: (data) => {
      console.log("MPIN changed successfully", data);
    },
    onError: (error) => {
      console.error("Error changing MPIN", error);
    }
  });

  return { 
    mpinData, 
    error, 
    isLoading, 
    refetch, 
    changeMpinMutate, 
    isChanging, 
    changeError 
  };
};

export default useMpin;
