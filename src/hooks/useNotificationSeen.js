import React from 'react';
import apiClient from '../constants/api-client';
import {useQuery} from '@tanstack/react-query';
import {useUser} from '../constants/storage';

const fetchNotificationSeen = mobileNumber =>
  apiClient
    .get('notification-seen/', {params: {mobile: mobileNumber}})
    .then(res => res.data);

const useNotificationSeen = () => {
  const {mobileNumber} = useUser();

  const {
    data: notificationSeen,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['Notification Seen'],
    queryFn: () => fetchNotificationSeen(mobileNumber),
  });

  return {notificationSeen, error, isLoading, refetch};
};

export default useNotificationSeen;
