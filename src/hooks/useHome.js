import {useMutation, useQuery} from '@tanstack/react-query';
import apiClient, {adminApiClient} from '../constants/api-client';
import {fetchMobile} from './useWallet';

const fetchHome = () => apiClient.get('home/').then(res => res.data);

const useHome = () => {
  const {
    data: home,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['Home'],
    queryFn: () => fetchHome(),
  });

  return {home, error, isLoading, refetch};
};

export default useHome;

export const useGameSettings = () => {
  return useQuery({
    queryKey: ['Game Settings'],
    queryFn: () =>
      adminApiClient.get('game-setting-list/').then(res => res.data),
  });
};

// export const usePlayerData = () => {
//   return useMutation({
//     mutationKey: ["PlayerData"],
//     mutationFn: ({ mobile }) =>
//       apiClient.post(`player-profile/`, { mobile }).then((res) => res.data),
//   });
// };

export const usePlayerData = () => {
  return useMutation({
    mutationKey: ['PlayerData'],
    mutationFn: async ({mobile}) => {
   
      try {
        if(mobile){
          const response = await apiClient.get(`player-profile/${mobile}/`);
          // console.log("API Response:", response.data);
          return response.data;
        }
        else{

        }
      } catch (error) {
        console.error("Error in usePlayerData:", error);
        // console.log(error)
        throw error;
      }
    }
 ,
    onSuccess: data => {
      // console.log("Mutation successful!", data);
    },
    onError: error => {
      // console.error("Mutation failed!", error);
    },
  });
};


export const usePlayerDataFetch = (mobile) => {
  return useQuery({
    queryKey: ["PlayerData", mobile], // Unique query key per mobile
    queryFn: async () => {
      try {
        console.log("mobile value ------------))))",mobile)
        if(mobile){
          const response = await apiClient.get(`player-profile/${mobile}/`);

          console.log("API Response:", response.data);
          return response.data;
        }
      } catch (error) {
        console.error("Error in usePlayerData:", error);
        throw error;
      }
    },
    onSuccess: data => {
      console.log("Mutation successful!", data);
    },
    onError: error => {
      console.error("Mutation failed!", error);
    },
    enabled: !!mobile,
  });
};
