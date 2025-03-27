import {useQuery} from '@tanstack/react-query';
import apiClient from '../constants/api-client';

const fetchNotification = () =>
  apiClient.get('notification/').then(res => res.data);

const useNotification = () => {
  const {
    data: notifications,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['Notification'],
    queryFn: () => fetchNotification(),
  });

  return {notifications, error, isLoading};
};

export default useNotification;
