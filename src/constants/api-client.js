import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Create axios instances
export const NodeapiClient = axios.create({
  // baseURL: 'https://bgmbackend.com/nodejs/club',
  baseURL: "http://192.168.1.51:3500/club",
});

const apiClient = axios.create({
  // baseURL: 'https://bgmbackend.com/club',
  baseURL: "http:/192.168.1.51:8000/club",
});

export const adminApiClient = axios.create({
  // baseURL: 'https://bgmbackend.com/dashboard',
  baseURL: "http:/192.168.1.51:8000/dashboard",
});

// Export base URLs
// export const BaseURLCLUB = 'https://bgmbackend.com/club';
export const BaseURLCLUB = 'http:/192.168.1.51:8000/club';
export const BaseURLDASHBOARD = 'http:/192.168.1.51:8000/dashboard';
// export const BaseURLDASHBOARD = 'https://bgmbackend.com/dashboard';
// export const imageApiClient = 'https://bgmbackend.com/';
export const imageApiClient = '';


const setAuthHeader = async(config) => {
  const tokenData = await AsyncStorage.getItem('token');
  const token = tokenData ? JSON.parse(tokenData).tokenvalue : null;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["User-Type"] = "Player";
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
  }
  return config;
};


// 401 Error Handler
const handle401Error = async (error) => {
  const navigation = useNavigation();
  if (error.response && error.response.status === 401) {
    try {
      // Remove authentication-related data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('mobileNumber');
      
      // You might want to navigate to login screen or trigger a logout process
      // This depends on your navigation setup in React Native
      // For example:
      navigation.navigate('Login');
      
      // Or if using a global state management:
      // dispatch(logoutAction())
    } catch (storageError) {
      console.error('Error during logout process:', storageError);
    }
  }
  return Promise.reject(error);
};

// Request cancellation setup
const requestMap = new Map();

const setupAxiosInterceptors = () => {
  const axiosClients = [apiClient, NodeapiClient, adminApiClient];
  
  axiosClients.forEach(client => {
    // Request interceptor for adding auth and managing cancellations
    client.interceptors.request.use(async (config) => {
      // Set auth headers
      config = await setAuthHeader(config);
      
      // Request cancellation logic
      // const requestKey = `${config.method}:${config.url}`;
      // if (requestMap.has(requestKey)) {
      //   requestMap.get(requestKey).abort();
      // }
      
      // const controller = new AbortController();
      // config.signal = controller.signal;
      
      // requestMap.set(requestKey, controller);
      
      return config;
    });
    
    // Response interceptor
    // client.interceptors.response.use(
    //   (response) => {
    //     // Remove request from map on successful response
    //     const requestKey = `${response.config.method}:${response.config.url}`;
    //     requestMap.delete(requestKey);
    //     return response;
    //   },
    //   (error) => {
    //     // Handle 401 errors
    //     handle401Error(error);
        
    //     // Handle request cancellation
    //     if (axios.isCancel(error)) {
    //       // console.log("Canceled API:", error?.config?.url);
    //     } else {
    //       const requestKey = `${error.config.method}:${error.config.url}`;
    //       requestMap.delete(requestKey);
    //     }
        
    //     return Promise.reject(error);
    //   }
    // );
  });
  
  // console.log("Axios interceptors setup complete");
};

// Call setup interceptors
setupAxiosInterceptors();

// Function to remove auth token
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export default apiClient;