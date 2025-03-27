import {useMutation} from '@tanstack/react-query';
import apiClient, { NodeapiClient } from '../constants/api-client';

interface IOtpVerify {
  mobile: string;
  otp: string;
  mpin: number;
}

export const usePostMobile = () => {
  return useMutation({
    mutationKey: ['postMobile'],
    mutationFn: (params: {mobile: string; refered_by?: string; email?: string}) => {
   
     
      
      const requestBody = {
        mobile: params.mobile,
        ...(params.refered_by && {refered_by: params.refered_by}),
        email: params.email,
      };
      console.log("from add login page",requestBody)

      return NodeapiClient.post('signup/', requestBody).then(res => {
        console.log("sdf", res.data);  
        return res.data;  
    });
    
    },
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationKey: ['postLoginInfo'],
    mutationFn: ({mobile, otp, mpin}: IOtpVerify) =>
      NodeapiClient.post('/verify-otp/', {mobile, otp, mpin}).then(res => res.data),
  });
};
