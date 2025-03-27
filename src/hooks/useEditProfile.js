import React from 'react';
import apiClient from '../constants/api-client';
import {useMutation} from '@tanstack/react-query';
import {useUser} from '../constants/storage';
import {fetchMobile} from './useWallet';

const useEditProfile = () => {
  // const [mobile, setMobile] = useState("");
  // fetchMobile(setMobile);

  const editProfile = useMutation({
    mutationKey: ['Edit user'],
    mutationFn: ({id, data}) =>
      apiClient.put(`player-update/${id}/`, data).then(res => {
        console.log(res.data);
        // refetch();
      }),
  });

  return {editProfile};
};

export default useEditProfile;
