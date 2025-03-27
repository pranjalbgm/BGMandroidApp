import {useMutation, useQuery} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

export const useDepositChat = ({searchValue = '', user = ''} = {}) => {
  const params = {
    ...(searchValue && {search_query: searchValue}),
    ...(user && {mobile: user}),
  };
  const chats = useQuery({
    queryKey: ['Chats', params],
    queryFn: () =>
      apiClient.get('deposit-chat-count-player-list/', {params}).then(res => {
        console.log('this is data while deposit chats', res.data);
        return res.data;
      }),
  });
  const {data: chatScreen, isLoading: isLoadingChatScreen} = useQuery({
    queryKey: ['Chat Screen', params],
    queryFn: () =>
      apiClient.get('deposit-chat-list/', {params}).then(res => {
        return res.data;
      }),
    refetchInterval: 1000,
  });
  const sendMessage = useMutation({
    mutationKey: ['Send Message'],
    mutationFn: info =>
      apiClient
        .post('create-deposit-chat/', info, {
          headers: {'Content-Type': 'multipart/form-data'},
        })
        .then(res => res.data),
  });
  const setSeen = useMutation({
    mutationKey: ['Send Message'],
    mutationFn: id =>
      apiClient
        .put('create-deposit-chat/' + id, {seen: 'True'})
        .then(res => res.data),
  });
  return {chats, chatScreen, sendMessage, setSeen, isLoadingChatScreen};
};

export const useWithdrawChat = ({searchValue = '', user = ''} = {}) => {
  const params = {
    ...(searchValue && {search_query: searchValue}),
    ...(user && {mobile: user}),
  };
  const chats = useQuery({
    queryKey: ['Chats', params],
    queryFn: () =>
      apiClient
        .get('withdraw-chat-count-player-list/', {params})
        .then(res => res.data),
  });
  const {data: chatScreen, isLoading: isLoadingChatScreen} = useQuery({
    queryKey: ['Chat Screen', params],
    queryFn: () =>
      apiClient.get('withdraw-chat-list/', {params}).then(res => {
        // console.log("this is data while withdraw chats list",res)
        return res.data;
      }),
    refetchInterval: 1000,
  });
  const sendMessage = useMutation({
    mutationKey: ['Send Message'],
    mutationFn: info =>
      apiClient
        .post('create-withdraw-chat/', info, {
          headers: {'Content-Type': 'multipart/form-data'},
        })
        .then(res => {
          console.log('this is data while withdraw chats', res.data);
          return res.data;
        }),
  });
  const setSeen = useMutation({
    mutationKey: ['Send Message'],
    mutationFn: id =>
      apiClient
        .put('create-withdraw-chat/' + id, {seen: 'True'})
        .then(res => res.data),
  });
  return {chats, chatScreen, sendMessage, setSeen, isLoadingChatScreen};
};
