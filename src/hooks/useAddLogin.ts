import {useMutation} from '@tanstack/react-query';
import { NodeapiClient } from '../constants/api-client';


interface IOtpVerify {
  mobile: string;
  otp: string;
  mpin: number;
}
export const usePostMobile = () => {
  return useMutation({
    mutationKey: ['postMobile'],
    mutationFn: (params: {mobile: string; email?: string}) => {
      return NodeapiClient.post('signup/', params)
        .then(res => {
          console.log("API response:", res.data);  
          return res.data;  
        })
        .catch(error => {
          console.error("API error:", error);
          throw error; 
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
