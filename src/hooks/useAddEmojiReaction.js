import { useMutation } from "@tanstack/react-query";
 
import Toast from 'react-native-simple-toast';
import { NodeapiClient } from "../constants/api-client";

const addEmojiReactionApi = (reactionData) => {
  return NodeapiClient.post("game-posting-chats/add-emoji-reaction", reactionData);
};

const useAddEmojiReaction = () => {
  return useMutation({
    mutationKey: ["Add Emoji Reaction"],
    mutationFn: (reactionData) => addEmojiReactionApi(reactionData),
    onSuccess: (data) => {
      Toast.show("Reaction Added Successfully", Toast.LONG);
    },
    onError: (error) => {
    Toast.show(error?.response?.data?.error, Toast.LONG);
      console.error("Error adding emoji reaction: ", error.response?.data.error);
    },
  });
};

export default useAddEmojiReaction;
