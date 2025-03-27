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

// export const usePlayerData = () => {
//   return useMutation({
//     mutationKey: ['PlayerData'],
//     mutationFn: async ({mobile}) => {
   
//       try {
//         if(mobile){
//           const response = await apiClient.get(`player-profile/${mobile}/`);

//           console.log("API Response:", response.data);
//           return response.data;
//         }
//         else{

//         }
//       } catch (error) {
//         console.error("Error in usePlayerData:", error);
//         // console.log(error)
//         throw error;
//       }
//     }
//  ,
//     onSuccess: data => {
//       // console.log("Mutation successful!", data);
//     },
//     onError: error => {
//       // console.error("Mutation failed!", error);
//     },
//   });
// };


export const usePlayerData = () => {
  return useMutation({
    mutationKey: ['PlayerData'],
    mutationFn: async ({ mobile }) => {
      const controller = new AbortController();
      try {
        if (mobile) {
          const response = await apiClient.get(`player-profile/${mobile}/`, {
            signal: controller.signal,
          });
          return response.data;
        }
      } catch (error) {
        if (error.name === 'CanceledError') {
          console.warn("Request was canceled:", error.message);
          return; // Ignore canceled requests
        }
        throw error;
      }
    },
  });
};


export const usePlayerDataFetch = (mobile) => {
  return useQuery({
    queryKey: ["PlayerData", mobile], 
    queryFn: async () => {
      if (!mobile) {
        return null;
      }
      try {
        const response = await apiClient.get(`player-profile/${mobile}/`);
        return response.data;
      } catch (error) {
        console.error("Error in usePlayerData:", error);
        throw error; 
      }
    },
    onSuccess: (data) => {
      console.log("Player data fetched successfully!", data);
    },
    onError: (error) => {
      console.error("Error fetching player data!", error);
    },
    enabled: !!mobile, 
  });
};

