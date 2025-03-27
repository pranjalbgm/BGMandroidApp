import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import OtpInputs from 'react-native-otp-inputs';
import Toast from 'react-native-simple-toast';

// Import necessary components and hooks
import appStyles from '../styles/appStyles';
import { usePostMobile, useVerifyOTP } from '../hooks/useAddLogin';
import { showAlert } from '../components/Alert';
import { getData, storeData } from '../constants/storage';
import Loader from '../components/Loader';
import COLORS from '../components/COLORS';
import apiClient, { BaseURLCLUB } from '../constants/api-client';
import useLoginContent from '../hooks/useLoginContent';

// TypeScript interface for user info
interface IUserInfo {
  mobile: string;
  email: string;
}

const LoginScreen = () => {
  const navigation = useNavigation();
  const { loginContent } = useLoginContent();

  // State variables
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [refCode, setRefCode] = useState('');
  const [mpin, setMpin] = useState('');
  const [resendAttempts, setResendAttempts] = useState(0);
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState('');

  // Hooks for mobile and OTP operations
  const postMobile = usePostMobile();
  const verifyOTP = useVerifyOTP();

  // Comprehensive email validation
  const validateEmail = (email: string) => {
    // Regex for comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Check basic format
    if (!emailRegex.test(email)) {
      return false;
    }

    // Additional checks
    const [local, domain] = email.split('@');
    
    // Ensure local part is not too long
    if (local.length > 64) return false;
    
    // Ensure domain is not too long
    if (domain.length > 255) return false;
    
    // Prevent some common invalid email patterns
    if (email.includes('..')) return false;
    if (local.startsWith('.') || local.endsWith('.')) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;

    return true;
  };

  // Handle mobile and email verification
  const handleVerifyContact = async () => {
    // Reset previous states
    setLoader(true);
    
    // Validate mobile number
    if (!mobileNumber) {
      Toast.show("Please enter your mobile number", Toast.LONG);
      setLoader(false);
      return;
    }

    if (mobileNumber.length !== 10) {
      Toast.show("Please enter a valid 10-digit mobile number", Toast.LONG);
      setLoader(false);
      return;
    }

    // Validate email (now compulsory)
    if (!emailAddress) {
      Toast.show("Email address is required", Toast.LONG);
      setLoader(false);
      return;
    }

    if (!validateEmail(emailAddress)) {
      Toast.show("Please enter a valid email address", Toast.LONG);
      setLoader(false);
      return;
    }

    try {
      // Prepare parameters for API call
      const params = { 
        mobile: mobileNumber, 
        email: emailAddress,
        referred_by: refCode 
      };

      // Send OTP
      const response = await postMobile.mutateAsync(params);
      console.log("response from backend",response)
      if (response) {
        setModalVisible(true);
        Toast.show("OTP sent successfully!", Toast.LONG);
      } else {
        Toast.show("Something went wrong. Please try again.", Toast.LONG);
      }
    } catch (error) {
      
      console.log("error -",error?.response?.data?.message)
      showAlert("Failed!", `${error?.response?.data?.message} \nPlease try again later!`);
    } finally {
      setLoader(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    // Validate OTP and MPIN
    if (otp.length < 6) {
      Toast.show("Please enter a valid 6-digit OTP", Toast.LONG);
      return;
    }
    
    if (mpin.length < 6) {
      Toast.show("Please set a valid 6-digit MPIN", Toast.LONG);
      return;
    }

    setLoader(true);

    const userInfo = {
      mobile: mobileNumber,
      email: emailAddress,
      otp,
      mpinNumber: mpin,
    };

    try {
      const response = await axios.post(
        BaseURLCLUB + '/player-verify-otp/', 
        userInfo
      );

      // Store user data and navigate
      await storeData<IUserInfo>({ 
        key: "user", 
        data: { 
          mobile: mobileNumber,
          email: emailAddress
        } 
      });
      
      navigation.reset({ 
        index: 0, 
        routes: [{ name: 'HomeScreen' }] 
      });
    } catch (error) {
      Toast.show("Invalid OTP. Please try again.", Toast.LONG);
    } finally {
      setLoader(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = () => {
    if (resendAttempts >= 3) {
      showAlert("You have exceeded the maximum number of resend attempts (3).");
      return;
    }
    setResendAttempts(resendAttempts + 1);
    handleVerifyContact();
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../images/bg-login-new.png')}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {/* Logo Section */}
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Image
              source={require('../images/app_ic.png')}
              style={{ height: 140, width: 140 }}
            />
          </View>

          {/* Input Section */}
          <View style={{ padding: 20 }}>
            {/* Mobile Number Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
                Mobile Number
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ 
                  backgroundColor: '#000000', 
                  color: '#ffffff', 
                  padding: 20, 
                  borderWidth:1,
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20 
                }}>
                  +91
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      flex: 1, 
                      paddingLeft: 10, 
                      borderTopLeftRadius: 0, 
                      borderBottomLeftRadius: 0 
                    }
                  ]}
                  onChangeText={text => setMobileNumber(text.replace(/[^0-9]/g, ''))}
                  value={mobileNumber}
                  placeholder="Enter Mobile Number"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
                Email Address
              </Text>
              <TextInput
                style={styles.formInput}
                onChangeText={text => setEmailAddress(text.trim())}
                value={emailAddress}
                placeholder="Enter Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Referral Code */}
            <View style={{ marginBottom: 20 }}>
              <TextInput
                style={styles.input}
                placeholder="Enter Referral Code (Optional)"
                onChangeText={text => setRefCode(text)}
                value={refCode}
              />
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              onPress={handleVerifyContact}
              style={styles.Btn}
            >
              <Text style={styles.primaryBtn}>Send OTP</Text>
              <View style={styles.bottomBorder} />
            </TouchableOpacity>

            {/* Login Link */}
            <View style={{ marginTop: 15, alignItems: 'center' }}>
              <Text style={styles.signupText}>
                Already have an account?{' '}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('MpinScreen')}
                >
                  Login
                </Text>
              </Text>
            </View>
          </View>

          {/* OTP Verification Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
              <View style={{
                backgroundColor: 'white',
                width: '92%',
                borderRadius: 10,
                padding: 20,
              }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ alignSelf: 'flex-end', marginBottom: 10 }}
                >
                  <AntDesign name="close" size={24} color={'#707070'} />
                </TouchableOpacity>

                <Text style={{
                  fontSize: 18,
                  fontWeight: '500',
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                  OTP Verification
                </Text>

                <Text style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}>
                  Enter the OTP sent to your mobile number and email
                </Text>

                <OtpInputs
                  handleChange={(code) => setOtp(code)}
                  numberOfInputs={6}
                  inputContainerStyles={{
                    height: 50,
                    width: 50,
                    borderColor: COLORS.black,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 5,
                    borderRadius: 10,
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                  inputStyles={{
                    fontSize: 20,
                    color: COLORS.black,
                    textAlign: 'center',
                  }}
                />

                <TextInput
                  style={{
                    backgroundColor: '#FFF',
                    borderWidth: 1,
                    borderColor: 'darkgreen',
                    borderRadius: 10,
                    paddingLeft: 20,
                    marginBottom: 20,
                  }}
                  onChangeText={(text) => setMpin(text.replace(/[^0-9]/g, ''))}
                  value={mpin}
                  placeholder="Set a 6-digit MPIN"
                  keyboardType="numeric"
                  maxLength={6}
                />

                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={styles.Btn}
                    disabled={loader}
                    onPress={handleVerifyOtp}
                  >
                    <Text style={styles.primaryBtn}>
                      {loader ? 'Verifying...' : 'Verify OTP'}
                    </Text>
                    <View style={styles.bottomBorder} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleResendOtp}
                    style={{ marginTop: 15 }}
                  >
                    <Text style={{ color: '#4CB050', fontWeight: '500' }}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>

      <Loader visiblity={loader} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default LoginScreen;