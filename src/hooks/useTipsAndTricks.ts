import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { adminApiClient } from "../constants/api-client";
import { fetchMobile } from "./useWallet";

// Fetch Tips and Tricks
const fetchTipsAndTricks = async () => {
  const response = await adminApiClient.get("get-tips-trick/");
  return response.data;
};

// Update Option Count
const updateOptionCount = async (pk: string, payload: any) => {
  const response = await adminApiClient.put(`update-option-count/${pk}/`, payload);
  return response.data;
};

// Custom Hook for Tips & Tricks
const useTipsAndTricks = () => {
  const [mobile, setMobile] = useState<string>("");

  useEffect(() => {
    const initializeMobile = async () => {
      const fetchedMobile = await fetchMobile(); // Ensure fetchMobile returns the value
      setMobile(fetchedMobile);
    };
    initializeMobile();
  }, []);

  const { data: tipsAndTricks, error, isLoading, refetch } = useQuery({
    queryKey: ["TipsAndTricks"],
    queryFn: fetchTipsAndTricks,
  });

  const { mutate: updateCount, isLoading: isUpdating, error: updateError } = useMutation({
    mutationFn: async ({ pk, optionTitle }: { pk: string; optionTitle: string }) => {
      if (!mobile) throw new Error("Mobile number is missing");

      const payload = { option: [{ title: optionTitle, mobile: [mobile] }] };
      return await updateOptionCount(pk, payload);
    },
    onSuccess: () => {
      refetch(); // Refetch tips and tricks after update
    },
  });

  return {
    tipsAndTricks,
    isError:error,
    isLoading,
    refetch,
    updateCount,
    isUpdating,
    updateError,
  };
};

export default useTipsAndTricks;
