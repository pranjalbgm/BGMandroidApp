import { useMutation } from "@tanstack/react-query";
import {  NodeapiClient } from "../constants/api-client"; 
import Toast from 'react-native-simple-toast';

const addCustomReactionApi = (reactionData) => {
  return NodeapiClient.post("game-posting-chats/add-custom-reaction", reactionData);
};

const useAddCustomReaction = () => {
  return useMutation({
    mutationKey: ["Add Custom Reaction"],
    mutationFn: (reactionData) => addCustomReactionApi(reactionData),
    onSuccess: (data) => {
     
      Toast.show("custom Reaction Added Successfully", Toast.LONG);
    },
    onError: (error) => {
    Toast.show(error?.response?.data?.error, Toast.LONG);
      console.error("Error adding custom reaction: ", error.response?.data.error);
    },
  });
};

export default useAddCustomReaction;