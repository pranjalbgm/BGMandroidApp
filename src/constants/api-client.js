import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { io } from "socket.io-client";


const BASE_URL = {
  "url": "http://192.168.1.47:3500/",
  // "url": 'https://bgmbackend.com/'
} 

const socket = io(BASE_URL.url, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});
socket.on('connect', () => {
  console.log('Socket connected: ', socket.id);
});
socket.on('connect_error', (error) => {
  console.error('Socket connection error: ', error);
});
export { socket };

// Create axios instances
export const NodeapiClient = axios.create({
  // baseURL: 'https://bgmbackend.com/nodejs/club',
  baseURL: "http://192.168.1.47:3500/club",
});

const apiClient = axios.create({
  // baseURL: 'https://bgmbackend.com/club',
  baseURL: "http:/192.168.1.47:8000/club",
});

export const adminApiClient = axios.create({
  // baseURL: 'https://bgmbackend.com/dashboard',
  baseURL: "http:/192.168.1.47:8000/dashboard",
});

export const adminApiClientNew = axios.create({
  baseURL: "https://server.bgmbackend.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Export base URLs
// export const BaseURLCLUB = 'https://bgmbackend.com/club';
export const BaseURLCLUB = 'http:/192.168.1.47:8000/club';
export const BaseURLDASHBOARD = 'http:/192.168.1.47:8000/dashboard';
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
    console.log("error from 201 page-------------",error)
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('mobileNumber');
      navigation.navigate('Login');
    } catch (storageError) {
      console.error('Error during logout process:', storageError);
    }
  }
  return Promise.reject(error);
};

// Request cancellation setup
const requestMap = new Map();

const setupAxiosInterceptors = () => {
  const axiosClients = [apiClient, NodeapiClient, adminApiClient, adminApiClientNew];
  
  axiosClients.forEach(client => {
    // Request interceptor for adding auth
    client.interceptors.request.use(setAuthHeader, (error) => Promise.reject(error));
    
    // Response interceptor for handling errors
    client.interceptors.response.use(
      (response) => {
        console.log("response",response)
        return response},

      (error) => handle401Error(error)
    );
  });
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