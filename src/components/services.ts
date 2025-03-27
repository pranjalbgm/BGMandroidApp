import {Alert} from 'react-native';
import Toast from 'react-native-simple-toast';
import {yelp_auth} from './apiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

export const loginData = async () => {
  return AsyncStorage.getItem('userData').then((value: any) => {
    const user = JSON.parse(value);
    return user;
  });
};

export const request = async (url: string, formData: any, type = 0) => {
  const netStatus = await NetInfo.fetch();

  console.log('Url --- ' + url);
  console.log('formData --- ' + formData);

  if (netStatus.isConnected === true) {
    return axios
      .post(url, formData)
      .then(response => {
        var msg = response.data.message;

        var str = '';
        if (typeof msg !== 'string') {
          {
            Object.entries(msg).length > 0 &&
              Object.entries(msg).map(([key, value]) => {
                let arr = value as any;
                if (str.length === 0) {
                  str = key + ' - ' + arr[0];
                } else {
                  str += '\n' + key + ' - ' + arr[0];
                }
              });
          }
        }

        if (str.length > 5) {
          response.data.message = str;
        } else {
          response.data.message = msg;
        }

        return response.data;
      })
      .catch(error => {
        console.log(url);
        console.log(formData);
        console.log('AXIOS ERROR: ', error);
        return {status: 'false', message: error};
        if (error.response.status == 401) {
          return {status: 'false', message: ''};
        } else if (error.response.status === 0) {
          return {status: 'noNet', message: 'No internet Connection'};
        } else {
          return {status: 'false', message: error};
        }
      });
  } else {
    console.log('netStatus ', netStatus);
    return {status: 'noNet', message: 'No internet Connection'};
  }
};

export const post = async (url: string, formData: any, navigation: any) => {
  const header = {
    Authorization: 'Bearer ',
    Accept: 'application/json',
  };

  const netStatus = await NetInfo.fetch();

  if (netStatus.isConnected === true) {
    return AsyncStorage.getItem('userData').then(async (value: any) => {
      const user = JSON.parse(value);
      header.Authorization = `Bearer ${user.auth_token}`;
      console.log(header);

      try {
        const response = await axios.post(url, formData, {headers: header});

        console.log(url);

        console.log(formData);

        console.log('RESPONSE RECEIVED: ', response.data);

        var msg = response.data.message;

        var str = '';
        if (typeof msg !== 'string') {
          {
            Object.entries(msg).length > 0 &&
              Object.entries(msg).map(([key, value]) => {
                let arr = value as any;
                if (str.length === 0) {
                  str = arr[0];
                } else {
                  str += '\n' + arr[0];
                }
              });
          }
        }

        if (str.length > 5) {
          response.data.message = str;
        } else {
          response.data.message = msg;
        }

        return response.data;
      } catch (error: any) {
        console.log(url);
        console.log(formData);
        if (error.response) {
          console.log('AXIOS ERROR status: ', error.response.data);
          console.log('AXIOS ERROR status: ', error.response.data.message);
          if (error.response.status == 401) {
            if (
              error.response.data.message ==
              'Your account has been deactivated please contact administrator'
            ) {
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen', params: {role: user.user_type}}],
              });
              AsyncStorage.setItem('userData', JSON.stringify({}));
            } else {
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen', params: {role: user.user_type}}],
              });
              AsyncStorage.setItem('userData', JSON.stringify({}));
            }
            Toast.showWithGravity(
              error.response.data.message,
              Toast.LONG,
              Toast.BOTTOM,
            ); //  return { status: "false", message: '' };
          } else if (error.response.status === 0) {
            return {status: 'noNet', message: 'No internet Connection'};
          } else {
            return {status: 'false', message: error};
          }
        }
      }
    });
  } else {
    console.log('netStatus ', netStatus);
    return {status: 'noNet', message: 'No internet Connection'};
  }
};

export const get = async (url: string, navigation: any) => {
  const header = {
    Authorization: 'Bearer ',
    Accept: 'application/json',
  };

  const netStatus = await NetInfo.fetch();

  if (netStatus.isConnected === true) {
    return AsyncStorage.getItem('userData').then(async (value: any) => {
      const user = JSON.parse(value);
      header.Authorization = `Bearer ${user.auth_token}`;
      console.log(header);
      // navigation.navigate('NoNetworkScreen', { icon: 'noNet', description: 'No internet Connection' , btnTitle: 'Try Again' })

      try {
        const response = await axios.get(url, {headers: header});
        console.log(url);
        console.log('RESPONSE RECEIVED: ', response.data);
        return response.data;
      } catch (error: any) {
        console.log(url);

        if (error.response) {
          console.log('AXIOS ERROR status: ', error.response.data);
          console.log('AXIOS ERROR status: ', error.response.data.message);
          console.log('AXIOS ERROR status: ', error.response.status);

          if (error.response.status === 401) {
            if (
              error.response.data.message ==
              'Your account has been deactivated please contact administrator'
            ) {
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen', params: {role: user.user_type}}],
              });
              AsyncStorage.setItem('userData', JSON.stringify({}));
            } else {
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen', params: {role: user.user_type}}],
              });
              AsyncStorage.setItem('userData', JSON.stringify({}));
            }
            Toast.showWithGravity(
              error.response.data.message,
              Toast.LONG,
              Toast.BOTTOM,
            ); // return { status: "false", message: '' };
          }
        }
      }
    });
  } else {
    console.log('netStatus ', netStatus);
    return {status: 'noNet', message: 'No internet Connection'};
  }
};

export const yelpCall = async (url: string, navigation: any) => {
  const header = {
    Authorization: `Bearer ${yelp_auth}`,
    Accept: 'application/json',
  };
  console.log(header);
  const netStatus = await NetInfo.fetch();

  if (netStatus.isConnected === true) {
    return axios
      .get(url, {headers: header})
      .then(response => {
        console.log(url);
        console.log('RESPONSE RECEIVED: ', response.data);
        return response.data;
      })
      .catch(error => {
        console.log(url);
        console.log('AXIOS ERROR: ', error);
        if (error.response) {
          console.log('AXIOS ERROR status: ', error.response.status);
          if (error.response.status === 401) {
            AsyncStorage.setItem('selectLocationData', JSON.stringify({}));
            AsyncStorage.setItem('userData', JSON.stringify({}));
            // navigation.navigate('Login');
            navigation.reset({
              index: 0,
              routes: [{name: 'IntroScreen'}],
            });
            Toast.showWithGravity(
              error.response.data.message,
              Toast.LONG,
              Toast.BOTTOM,
            ); // return { status: "false", message: '' };
            return {status: 'false', message: ''};
          } else {
            return {status: 'false', message: error};
          }
        }
      });
  } else {
    console.log('netStatus ', netStatus);
    return {status: 'noNet', message: 'No internet Connection'};
  }
};

export const upload = async (url: string, formData: any, navigation: any) => {
  const header = {
    Authorization: 'Bearer ',
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  };
  const netStatus = await NetInfo.fetch();

  if (netStatus.isConnected === true) {
    return AsyncStorage.getItem('userData').then(async (value: any) => {
      const user = JSON.parse(value);
      header.Authorization = `Bearer ${user.auth_token}`;
      console.log(header);

      try {
        console.log('khkashfajshfjkas');
        const response = await axios.post(url, formData, {headers: header});

        // const response = await fetch(url, {
        //     headers: header,
        //     method: 'POST',
        //     body: formData
        // });
        const json = await response.data;
        console.log(url);
        console.log(formData);
        console.log(json);

        var msg = json.message;

        var str = '';
        if (typeof msg !== 'string') {
          {
            Object.entries(msg).length > 0 &&
              Object.entries(msg).map(([key, value]) => {
                let arr = value as any;
                if (str.length === 0) {
                  str = arr[0];
                } else {
                  str += '\n' + arr[0];
                }
              });
          }
        }

        if (str.length > 5) {
          json.message = str;
        } else {
          json.message = msg;
        }

        console.log('jskskfkskfhskhf :- ', json);

        return json;
      } catch (error: any) {
        console.error(error);
        console.log(url);
        console.log(formData);
        if (error.response) {
          console.log('AXIOS ERROR status: ', error.response.data);
          console.log('AXIOS ERROR status: ', error.response.data.message);
          if (error.response.status === 401) {
            // navigation.navigate('Login');
            if (
              error.response.data.message ==
              'Your account has been deactivated please contact administrator'
            ) {
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen', params: {role: user.user_type}}],
              });
              AsyncStorage.setItem('userData', JSON.stringify({}));
            } else {
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen', params: {role: user.user_type}}],
              });
              AsyncStorage.setItem('userData', JSON.stringify({}));
            }

            Toast.showWithGravity(
              error.response.data.message,
              Toast.LONG,
              Toast.BOTTOM,
            ); // return { status: "false", message: '' };
            //return { status: "false", message: '' };
          } else {
            return {status: 'false', message: error};
            // Alert.alert('', error);
          }
        }
      }
    });
  } else {
    console.log('netStatus ', netStatus);
    return {status: 'noNet', message: 'No internet Connection'};
  }
};
