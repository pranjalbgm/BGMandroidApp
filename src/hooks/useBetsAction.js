import {useMutation} from '@tanstack/react-query';
import {adminApiClient} from '../constants/api-client';

const useBetsAction = refetch => {
  return useMutation({
    mutationKey: ['Bets delete'],
    mutationFn: data =>
      adminApiClient.post('bet-delete/', data).then(res => {
        console.log(res.data);
        refetch();
      }),
  });
};
export default useBetsAction;
