import React, {useState} from 'react';
import apiClient, {adminApiClient} from '../constants/api-client';
import {useMutation, useQuery} from '@tanstack/react-query';
import {fetchMobile} from './useWallet';

const fetchBonusReport = params =>
  adminApiClient
    .get('bonus-list/', {params})
    .then(res => res.data.sort((a, b) => b.created_at - a.created_at));

const useBonusReport = ({market = ''} = {}) => {
  const [mobile, setMobile] = useState('');

  fetchMobile(setMobile);

  const params = {
    ...(market && {market}),
    mobile,
  };

  const {
    data: bonusReport,
    error,
    isLoding,
    refetch,
  } = useQuery({
    queryKey: ['BonusReport', params],
    queryFn: () => fetchBonusReport(params),
  });
  return {bonusReport, error, isLoding, refetch};
};

export default useBonusReport;
