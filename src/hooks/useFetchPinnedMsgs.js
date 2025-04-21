import { useQuery } from "@tanstack/react-query";
import {  NodeapiClient } from "../constants/api-client";

const fetchPinnedMsgsApi = async () => {
  const response = await NodeapiClient.get("/game-posting-chats/get-pinned-msg");
  return response.data;
};

const useFetchPinnedMsgs = () => {
  return useQuery({
    queryKey: ["PinnedMessages"],
    queryFn: fetchPinnedMsgsApi,
  });
};

export default useFetchPinnedMsgs;
