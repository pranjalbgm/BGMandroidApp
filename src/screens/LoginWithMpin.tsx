import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import { getData, storeData } from '../constants/storage';
import Loader from '../components/Loader';
import COLORS from '../components/COLORS';
import apiClient, { NodeapiClient } from '../constants/api-client';
import appStyles from '../styles/appStyles';

const LoginWithMpin = () => {
  const navigation = useNavigation();

  //---------- Input Form ----------//
  const [mobile, setMobile] = useState('');
  const [mpin, setMpin] = useState('');
  const [loader, setLoader] = useState(false);
  //---------- Input Form End ----------//

  // useEffect(() => {
  //   (async function checkUserSession() {
  //     const user = await getData("user");
  //     if (user) {
  //       navigation.navigate('HomeScreen');
  //     }
  //   })();
  // }, []);

  const handleLogin = async () => {
    if (!mobile || mobile.length !== 10) {
      Toast.show('Please enter a valid 10-digit mobile number.', Toast.LONG);
      return;
    }

    if (!mpin || mpin.length !== 6) {
      Toast.show('Please enter a valid 6-digit MPIN.', Toast.LONG);
      return;
    }

    setLoader(true);

    const params = { mobile:mobile, mpin: mpin };
try{
    NodeapiClient.post('/login', params)
    .then( (response) => {
     
      if (response?.status === 200) {
        storeData({ key: 'user', data: { mobile } });
        const tokenvalue = response?.data?.jwt_token 
        console.log("get till here -----------------", tokenvalue);
        storeData({ key: 'token', data: { tokenvalue } });
        navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
      } else {
        Toast.show(response?.data?.message || 'Invalid credentials.', Toast.LONG);
      }
    })
    .catch((error) => {
      Toast.show('Login failed. Please try again later.', Toast.LONG);
      console.error('Login Error:', error);
    })
    .finally(() => {
      setLoader(false);
    });
  } catch {
    Toast.show('Login failed. Please try again later.', Toast.LONG);
  }
}

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ImageBackground
        source={require('../images/bg-login-new.png')}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
            <Image
              source={require('../images/app_ic.png')}
              style={{ height: 140, width: 140 }}
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center', backgroundColor: COLORS.black }}>
            <Text
              style={{
                fontSize: 17,
                color: COLORS.white,
                marginHorizontal: 20,
                textAlign: 'center',
                paddingVertical: 5,
              }}>
              Login to your account
            </Text>
          </View>

          <View
            style={{
              padding: 20,
              borderRadius: 10,
              marginHorizontal: 5,
              marginTop: 20,
              width: '90%',
            }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
                Mobile Number
              </Text>
              <TextInput
                style={styles.formInput}
                onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
                value={mobile}
                placeholder="Enter Mobile Number"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            

            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
                MPIN
              </Text>
              <TextInput
                style={styles.formInput}
                onChangeText={(text) => setMpin(text.replace(/[^0-9][^a-z][^A-Z]/g, ''))}
                value={mpin}
                placeholder="Enter 6-digit MPIN"
                maxLength={6}
              />
            </View>
            
          {/* <View style={styles.forgotLink}>
                      <Text style={styles.signupText}>
                                    <Text
                                      style={styles.signupLink}
                                      onPress={() => navigation.navigate('ForgotPassword')}>
                                      Forgot Password
                                    </Text>
                                  </Text>
          </View> */}

            <TouchableOpacity onPress={handleLogin} style={styles.primaryBtnContainer}>
              <Text style={styles.primaryBtn}>Login</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate('LoginScreen')}>
                Sign Up
              </Text>
            </Text>
          </View>
          </View>
        </View>

        <Loader visiblity={loader} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles, 

  formInput: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },

  primaryBtnContainer: {
    backgroundColor: COLORS.black,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  primaryBtn: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,  // Optional but improves readability
    textAlign: 'center', // Ensures proper alignment inside Button/Text
  },
});
export default LoginWithMpin;
