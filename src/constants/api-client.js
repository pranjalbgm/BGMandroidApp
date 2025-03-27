import axios from 'axios';

export const NodeapiClient = axios.create({
  baseURL: "http://192.168.1.51:3500/club",
  // player-update/1020304050/
  // baseURL: 'https://bgmbackend.com/nodejs/club',
});
const apiClient = axios.create({
  baseURL: "http:/192.168.1.51:8000/club",
  // player-update/1020304050/
  // baseURL: 'https://bgmbackend.com/club',
});

export const adminApiClient = axios.create({
  baseURL: "http://192.168.1.51:8000/dashboard",
  // baseURL: 'https://bgmbackend.com/dashboard',
});

export const BaseURLCLUB = 'http://192.168.1.51:8000/club'
// export const BaseURLCLUB = 'https://bgmbackend.com/club';
export const BaseURLDASHBOARD = 'http://192.168.1.51:8000/dashboard'
// export const BaseURLDASHBOARD = 'https://bgmbackend.com/dashboard';

// export const imageApiClient = 'http://192.168.1.48:8000/'
export const imageApiClient = 'https://bgmbackend.com/';
// 'https://api.thebgmgame.com'
// 'http://192.168.1.4:8000'

export default apiClient;
