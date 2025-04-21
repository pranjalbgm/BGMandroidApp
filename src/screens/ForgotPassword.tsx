import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Modal,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';
import appStyles from '../styles/appStyles';
import { usePostMobile, useVerifyOTP } from '../hooks/useAddLogin';
import { showAlert } from '../components/Alert';
import { getData, storeData } from '../constants/storage';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import apiClient, { BaseURLCLUB } from '../constants/api-client';
import OtpInputs from 'react-native-otp-inputs';
import COLORS from '../components/COLORS';
import Toast from 'react-native-simple-toast';
import useLoginContent from '../hooks/useLoginContent';
import { BlurView } from '@react-native-community/blur';
 
interface IUserInfo {
  mobile: string;
}
 
const ForgotPassword = () => {
  const navigation = useNavigation();
  const { loginContent } = useLoginContent();
  //---------- Input Form ----------//
  const [textInput1, setTextInput1] = useState('');
  const [refCode, setRefCode] = useState('');
  const [mpin, setMpin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [loader, setLoader] = useState(false);
  //---------- Input Form End ----------//
  const [modalVisible, setModalVisible] = useState(false);
  const postMobile = usePostMobile();
  const verifyOTP = useVerifyOTP();
 
  useEffect(() => {
    let user;
    (async function getUserData() {
      user = await getData("user")
      // console.log("From Login Screen", user)
      //user !== null && navigation.navigate('HomeScreen')
    })()
  }, [])

  //-------- OTP Input -------//
  const [otp, setOtp] = useState('');
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
 
  const handleChange = ({text}:any) => {
    console.log(text)
    setOtp(text);
  };
 
  const handleVerifyMobile = async () => {
    if (!textInput1) {
      Toast.show("Please enter your mobile number.", Toast.LONG);
    }
    else if (textInput1.length < 10 || textInput1.length > 10) {
      Toast.show("Please enter valid mobile number.", Toast.LONG);
    }
    else {
      setLoader(true)
      try {
        var params = { mobile: textInput1 }
        const response = await postMobile.mutateAsync(params)
        if (response) {
          console.log("reached till here")
          setModalVisible(true)
          setLoader(false)
          Toast.show("otp sent!", Toast.LONG);
        }
        else {
          console.log("reached till here in else", postMobile)
          Toast.show("Something went wrong please try again.", Toast.LONG);
          setModalVisible(false)
          setLoader(false)
        }
      } catch (error) {
        showAlert("Failed!", `Please try again later! \n${error}`)
        console.log("Failed!", `Please try again later! \n${error}`)
        setLoader(false)
      }
    }
  }
 
  const handleResendOtp = () => {
    if (resendAttempts >= 3) {
      showAlert("You have exceeded the maximum number of resend attempts (3).")
      return
    }
    setResendAttempts(resendAttempts + 1);
    handleVerifyMobile(); 
  };
 
  const handleVerifyOtp = async () => {
    if (otp.length < 1) {
      Toast.show("Please enter your otp.", Toast.LONG);
    }
    else if (otp.length < 6) {
      Toast.show("Please enter valid otp.", Toast.LONG);
    }
    else if (!mpin || mpin.length < 6) {
        Toast.show('Please set a valid 6-digit MPIN.', Toast.LONG);
        return;
      }
    else {
      setLoader(true)
      try {
        const userInfo = {
          mobile: textInput1,
          otp,
          mpin:mpin,
        };
        const response = await verifyOTP.mutateAsync(userInfo)
          if (response) {
            console.log("reached till here")
            setLoader(false)
            storeData<IUserInfo>({ key: "user", data: { mobile: textInput1 } })
            navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' as never}] })
          }
          else {
            console.log("reached till here in else", postMobile)
            Toast.show("Something went wrong please try again.", Toast.LONG);
            setModalVisible(false)
            setLoader(false)
          }
        } catch (error) {
          setLoader(false)
          Toast.show("Please enter valid otp.", Toast.LONG);
        }
      //  console.log("userinfo data", userInfo)
      //  const response = await verifyOTP.mutateAsync(userInfo)
      // axios.post(BaseURLCLUB + '/player-verify-otp/', userInfo).then((response) => {
      //   console.log("Data 111111 :- ", response)
 
      //   setLoader(false)
      //   storeData<IUserInfo>({ key: "user", data: { mobile: textInput1 } })
      //   navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] })
 
      // }).catch((error) => {
      //   setLoader(false)
      //   Toast.show("Please enter valid otp.", Toast.LONG);
      // })
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', }}>
      <ImageBackground
      source={require('../images/bg-login-new.png')}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
      <ScrollView>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Image
            source={require('../images/app_ic.png')}
            style={[ { height: 140, width: 140 }]}
          />
        </View>
 
        <View style={{ width: '100%', alignItems: 'center', backgroundColor: COLORS.black }}>
          <Text style={{ fontSize: 17, color: COLORS.white, marginHorizontal: 20, textAlign: 'center', paddingVertical: 5 }}>{loginContent?.heading}</Text>
        </View>
        <View>
       
        <View
          style={{  padding: 20, borderRadius: 10, marginHorizontal: 5, marginTop: 20, display:"flex", justifyContent:"center" }}>
          <View style={{marginBottom: 20, position: 'relative' }}>
            <Text
              style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
              Mobile Number
            </Text>
            <Text
              style={{
                color: '#ffffff',
                fontWeight: '500',
                position: 'absolute',
                left: 0,
                backgroundColor: '#000000',
                top: 30,
                zIndex: 1,
                padding: 19,
              }}>
              +91
            </Text>
            <TextInput
              style={[
                styles.formInput,
                { paddingLeft: 80, backgroundColor: '#fff' },
              ]}
              onChangeText={text => setTextInput1(text.replace(/[^0-9]/g, ''))}
              value={textInput1}
              placeholder="Enter Mobile Number"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={{ marginBottom: 20, position: 'relative' }}>
            {!otpSent && (
              <TextInput
                style={styles.input}
                placeholder="Enter Referral Code"
                keyboardType="numeric"
                onChangeText={text => setRefCode(text.replace(/[^0-9]/g, ''))}
                value={refCode}
              />
            )}
          </View>
          
          
 
          <TouchableOpacity
            // disabled={postMobile.isPending}
            // style={postMobile.isPending ? styles.disabledBtn : styles.Btn}
            onPress={() => handleVerifyMobile()}>
            <Text style={styles.primaryBtn}>Send otp</Text>
            <View style={styles.bottomBorder} />
            <View style={styles.redirectingSignup}>
            <Text style={styles.signupText}>
                          Already have an account?{' '}
                          <Text
                            style={styles.signupLink}
                            onPress={() => navigation.navigate('MpinScreen' as never)}>
                            Login
                          </Text>
                        </Text>
                        </View>
          </TouchableOpacity>
 
 
        </View>
       
        </View>
     
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                minHeight: 300,
                width: '92%',
                borderTopEndRadius: 15,
                borderTopLeftRadius: 15,
                position: 'relative',
                borderRadius: 10,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginTop: -45,
                }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closebutton}>
                  <Text style={styles.textIcon}>
                    <AntDesign name="close" size={24} color={'#707070'} />{' '}
                  </Text>
                </TouchableOpacity>
              </View>
 
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor:"green"
                }}>
                <View>
                  <View style={{ padding: 20 }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: '500',
                        textAlign: 'center',
                      }}>
                      OTP Verification
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontSize: 12,
                        paddingTop: 5,
                      }}>
                      Enter the otp sent to your number
                    </Text>
                    <OtpInputs
                      handleChange={(code) => handleChange(code)}
                      numberOfInputs={6}
                      inputContainerStyles={{ height: 50, width: 50, borderColor: COLORS.black, borderWidth: 1, alignItems: 'center', justifyContent: 'center', margin: 1, borderRadius: 10, }}
                      style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
                      inputStyles={{ fontSize: 20, color: COLORS.black, textAlign: 'center' }}
                    />

<View style={{ marginBottom: 20 }}>
          <TextInput
              style={[{ 
                 marginTop: 20,backgroundColor: '#FFF',
                borderWidth: 1,
                borderColor: 'darkgreen', borderRadius:10, paddingLeft:20  }]}
              onChangeText={(text) => setMpin(text.replace(/[^0-9]/g, ''))}
              value={mpin}
              placeholder="Set a 6-digit MPIN"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
 
                    <View
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // paddingTop: 20,
                      }}>
                      <View style={{ width: '48%' }}>
                        <TouchableOpacity
                          style={styles.Btn}
                          disabled={loader ? true : false}
                          onPress={() => handleVerifyOtp()}>
                          <Text style={styles.primaryBtn}>{!loader ? 'Verify otp' : 'Verifying'}</Text>
                          <View style={styles.bottomBorder} />
                        </TouchableOpacity>
                      </View>
                    </View>
 
                    <TouchableOpacity
                      disabled={verifyOTP.isPending}
                      style={verifyOTP.isPending ? styles.disabledBtn : { marginTop: 20 }} onPress={() => handleResendOtp()}>
                      <Text
                        style={{
                          color: '#4CB050',
                          textAlign: 'center',
                          fontWeight: '500',
                        }}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
 
      </ScrollView>
   
      </View>
      </ImageBackground>
 
      <Loader visiblity={loader} />
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
 
export default ForgotPassword;