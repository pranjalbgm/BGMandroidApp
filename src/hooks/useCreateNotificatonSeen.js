import {useMutation} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

const useCreateNotificatonSeen = () => {
  return useMutation({
    mutationKey: ['NotiFicationSeen'],
    mutationFn: mobileNumber =>
      apiClient
        .post('create-notification-seen/', {mobile: mobileNumber})
        .then(res => res.data)
        .catch(err => console.error(err)),
  });
};

export default useCreateNotificatonSeen;
