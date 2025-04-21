import {useMutation} from '@tanstack/react-query';
import { NodeapiClient } from '../constants/api-client';


interface PostMobileParams {
  mobile?: string;
  email?: string;
}

interface IOtpVerify {
  mobile: string;
  otp: string;
  mpin: string;
}
export const usePostMobile = () => {
  return useMutation({
    mutationKey: ['postMobile'],
    mutationFn: ({mobile, email}: PostMobileParams) => {
      return NodeapiClient.post('signup/', {mobile, email})
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
