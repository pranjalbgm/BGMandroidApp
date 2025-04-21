import { useMutation } from "@tanstack/react-query";

import {  NodeapiClient } from "../constants/api-client";

const addPinMsgApi = ({ message, username }) => {
  return NodeapiClient.post("game-posting-chats/add-pin-msg", { message, username });
};

const useAddPinMsg = () => {
  return useMutation({
    mutationKey: ["Add Pin Msg"],
    mutationFn: addPinMsgApi,
    // onSuccess: () => {
    //   toast.success("Pin Msg Added Successfully");
    // },
    // onError: (error) => {
    //   toast.error(error?.response?.data?.error || "Failed to add pin message");
    // },
  });
};

export default useAddPinMsg;
