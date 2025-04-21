import { useState } from 'react';
import { NodeapiClient } from '../constants/api-client';
import { storeData } from '../constants/storage';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (mobile: string, mpin: string) => {
    setLoading(true);
    try {
      const response = await NodeapiClient.post('/login', { mobile, mpin });

      if (response?.status === 200) {
        const tokenvalue = response?.data?.jwt_token;
        await storeData({ key: 'user', data: { mobile } });
        await storeData({ key: 'token', data: { tokenvalue } });

        return { success: true, tokenvalue };
      } else {
        const errorMsg = response?.data?.message || 'Invalid credentials.';
        console.warn("Login API responded with error:", errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error: any) {
      console.error('Login Exception:', error);
      return { success: false, message: 'Login failed. Please try again later.' };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
