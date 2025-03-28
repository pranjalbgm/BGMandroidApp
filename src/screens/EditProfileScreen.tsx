import React, {useState, useEffect, useRef} from 'react';
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
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import HeaderThree from '../components/HeaderThree';
import NavFooter from '../components/NavFooter';
import DateTimePicker from '@react-native-community/datetimepicker';
import appStyles from '../styles/appStyles';
import useEditProfile from '../hooks/useEditProfile';
import usePlayerProfile from '../hooks/usePlayerProfile';
import useWalletAmount from '../hooks/useWalletAmount';
import {usePlayerData, usePlayerDataFetch} from '../hooks/useHome';
import useWallet, {fetchMobile} from '../hooks/useWallet';
import {format} from 'date-fns';
import DocumentPicker from 'react-native-document-picker';
import apiClient, {BaseURLCLUB, imageApiClient} from '../constants/api-client';
import {showAlert} from '../components/Alert';
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import COLORS from '../components/COLORS';
import Loader from '../components/Loader';
import axios from 'axios';
import Toast from 'react-native-simple-toast';

const EditProfileScreen = () => {
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({});
  const [imageData, setimageData] = useState({});
  const [loader, setLoader] = useState(false);
  const {refetch}= usePlayerDataFetch(mobile);

  const handleFieldClick = fieldName => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: `${fieldName} is not editable.`,
    }));
    Toast.show(`${fieldName} is not editable.`, Toast.LONG);
    // ToastAndroid.show(`${fieldName} is not editable.`, ToastAndroid.SHORT);
  };

  // =========> Select file from memory and set in state
  const pickDocument = async setter => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: false, // Specify image types if needed
      });

      console.log(result);

      // const uri = result[0].uri;
      // const fileName = result[0].name;
      // const destPath = RNFS.DocumentDirectoryPath + '/' + fileName;

      // await RNFS.copyFile(uri, destPath);

      // setter(destPath); // Set the state with the local URI of the copied image

      setter(result[0].uri);
      setimageData(result[0]);
      // console.log(result)

      // setter(result)

      // Convert the image to base64
      // const imageUri = result[0].uri;
      // const response = await fetch(imageUri);
      // const blob = await response.blob();
      // const reader = new FileReader();
      // reader.readAsDataURL(blob); // Read the blob as a base64 string
      // reader.onloadend = () => {
      //   const base64String = reader.result; // This is your base64 string
      //   setter(base64String);
      // };
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

   useEffect(() => {
          const initializeMobile = async () => {
            const fetchedMobile = await fetchMobile(setMobile);
            if (fetchedMobile) {
              // playerInfo.mutate({ mobile: fetchedMobile });
              refetch(fetchedMobile)
            }
          };
          initializeMobile();
        }, []);
  

  const validateName = name => {
    if (!name.trim()) {
      setErrors(prevErrors => ({...prevErrors, name: 'Name cannot be empty.'}));
    } else {
      setErrors(prevErrors => ({...prevErrors, name: null}));
    }
  };

  // =========> Make API Requests using custom hooks
  const {editProfile} = useEditProfile();
  const {playerDetails} = usePlayerProfile();
  const {wallet} = useWallet();
    const playerData = usePlayerDataFetch(mobile);
    console.log("playerdata----------",playerData)

  // console.log(playerData)

  // =========> Fetch player info

  // =========> Form Data Handling and submission
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [bank, setBank] = useState('');
  const [account_number, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  

  // const actions: {
  //   title: "Select Image",
  //   type: "library",
  //   options: {
  //     selectionLimit: 0,
  //     mediaType: "photo",
  //     includeBase64: false,
  //   }
  // };

  // useEffect(() => {
  //   if (!mobile) {
  //     fetchMobile(setMobile).then(mobile => playerData.mutate({mobile}));
  //   }

  //   fetchMobile(setMobile).then(mobile =>
  //     apiClient.post('player-profile/', {mobile}).then(res => {
  //       console.log('player data :- ', res.data);

  //       setName(res.data.name);
  //       setEmail(res.data.email);
  //       setSelectedDate(res.data.dob);
  //       setBank(res.data.bank);
  //       setAccountNumber(res.data.account_number);
  //       setIfsc(res.data.ifsc);
  //     }),
  //   );
  // }, [mobile]);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(format(currentDate, 'yyyy-MM-dd'));
  };

  const validation = () => {
    if (!selectedDate) {
      Toast.show('Please enter your dob', Toast.LONG);
    } else {
      submitInfo();
    }
  };

  const submitInfo = async () => {
    console.log('Starting KYC submission...');
  
    try {
      if (!imageData) {
        console.error('No image data found');
        return;
      }
  
      const imageUri = imageData?.uri;
      const imageName = imageData?.name;
      const imageType = imageData?.type;
  
      const formData = new FormData();
      formData.append('dob', selectedDate);
  
      if (imageUri) {
        formData.append('image', {
          uri: imageUri,
          type: imageType,
          name: imageName,
        });
      }
  
      console.log('Form Data:', formData);
      setLoader(true);
  
      const response = await apiClient.put(`/player-update/${mobile}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
  
      if (response.status !== 200) {
        console.log('Error Response:', response.data.error);
        Toast.show(response.data.error, Toast.LONG);
      } else {
        console.log('Profile updated successfully');
        Toast.show('Profile updated successfully', Toast.LONG);
      }
  
      console.log('Response Data:', response);
      setLoader(false);
  
    } catch (error) {
      console.log('Error:', error);
      setLoader(false);
  
      if (error.response) {
        console.log('Error Response:', error.response.data);
        Toast.show(error.response.data.error || 'Something went wrong', Toast.LONG);
      } else if (error.request) {
        console.log('Error Request:', error.request);
      } else {
        console.log('Error Message:', error.message);
      }
    }
  };

  useEffect(() => {
    editProfile.isSuccess && console.log(editProfile.data);
    // editProfile.isError && console.log(editProfile.error)
  }, [editProfile]);

  console.log('-===================>', playerData);
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderThree title={'Profile'} />
      <ScrollView>
        <View style={{padding: 20}}>
          {/* Balance and bonus */}
          <View
            style={{backgroundColor: '#000000', padding: 20, marginBottom: 15}}>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              Balance:
              <Text>{wallet && wallet?.total_amount}</Text>
            </Text>
          </View>
          <View
            style={{backgroundColor: '#000000', padding: 20, marginBottom: 15}}>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              Bonus:
              <Text>{(playerDetails && playerDetails[0]?.amount) || 0}</Text>
            </Text>
          </View>

          {/* Profile Image */}
          <View style={{marginVertical: 25}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => pickDocument(setImage)}
                activeOpacity={0.7}>
                <View style={styles.uploadProfile}>
                  {playerData && playerData.data && playerData.data.image ? (
                    <View style={{position: 'relative'}}>
                      <Image
                        source={{
                          uri: imageData.uri
                            ? imageData.uri
                            : 'https://api.thebgmgame.com/' +
                              playerData.data.image,
                        }}
                        style={{width: 100, height: 100, borderRadius: 999}}
                      />
                      {/*  'https://api.thebgmgame.com/' + playerData.data.image */}
                    </View>
                  ) : (
                    <>
                      <Image
                        source={require('../images/profile.png')}
                        style={styles.profileimg}
                      />
                      <View style={styles.icon}>
                        <Ionicons name="camera" size={24} color="#ffffff" />
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={{marginBottom: 15}}>
            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                Name
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  onChangeText={text => {
                    setName(text), console.log(text);
                  }}
                  defaultValue={playerData?.data?.name}
                  placeholder="Enter Your Name"
                  style={{color: COLORS.black}}
                  editable={false}
                  onFocus={() => handleFieldClick('Name')}
                />

                {errors.name && (
                  <Text style={{color: 'red', marginTop: 5}}>
                    {errors.name}
                  </Text>
                )}
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                Email
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  onChangeText={setEmail}
                  defaultValue={playerData?.data?.email}
                  placeholder="Enter Your Email"
                  style={{color: COLORS.black}}
                  editable={false}
                />
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                Mobile
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  value={'+91 ' + mobile}
                  placeholder="Enter Your Mobile"
                  style={{color: COLORS.black}}
                  editable={false}
                />
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                DOB
              </Text>
              <View style={styles.inputContainer}>
                <View
                  style={{
                    backgroundColor: '#ECECEC',
                    paddingHorizontal: 15,
                    width: '100%',
                  }}>
                  <TextInput
                    style={[{color: '#848282'}]} // Set text color to #000000
                    defaultValue={selectedDate}
                    onFocus={() => setShowDatePicker(true)}
                    editable={false} // Make the TextInput non-editable
                    placeholder="DOB"
                  />
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setShowDatePicker(true)}>
                  <Ionicons name="calendar-outline" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={selectedDate ? selectedDate : new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                Aadhaar
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  value={
                    playerData?.data?.aadhar &&
                    playerData?.data?.aadhar.toString()
                  }
                  placeholder="Aadhaar"
                  style={{color: COLORS.black}}
                  editable={false}
                />
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                PAN
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  value={playerData?.data?.pan}
                  placeholder="PAN"
                  style={{color: COLORS.black}}
                  editable={false}
                />
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                Bank
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  onChangeText={setBank}
                  defaultValue={playerData?.data?.bank}
                  placeholder="Enter Your Bank Name"
                  style={{color: COLORS.black}}
                  editable={false}
                />
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                Account Number
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  defaultValue={
                    playerData?.data?.account_number &&
                    playerData?.data?.account_number.toString()
                  }
                  onChangeText={setAccountNumber}
                  placeholder="Enter Your Account Number"
                  style={{color: COLORS.black}}
                  keyboardType="numeric"
                  editable={false}
                />

                {/* {console.log(account_number)}
                  { console.log(playerData?.data?.account_number)} */}
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                IFSC
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  defaultValue={playerData?.data?.ifsc}
                  onChangeText={setIfsc}
                  placeholder="Enter your IFSC Code"
                  style={{color: COLORS.black}}
                  editable={false}
                />
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                Account Holder
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  defaultValue={playerData?.data?.account_holder}
                  placeholder="Enter account holder name"
                  style={{color: COLORS.black}}
                  editable={false}
                />
              </View>
            </View>

            <View style={{marginTop: 10}}>
              <TouchableOpacity style={styles.Btn} onPress={validation}>
                <Text style={styles.primaryBtn}>Submit</Text>
                <View style={styles.bottomBorder} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <NavFooter /> */}
      <Loader visiblity={loader} />
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default EditProfileScreen;

// const submitInfo = async () => {
//   const formData = {
//     // image:iamge[0],
//     name: name,
//     email: email,
//     dob: selectedDate,  // Ensure selectedDate is formatted correctly
//     bank: bank,
//     account_number: account_number,
//     ifsc: ifsc,
//   };

//   try {
//     console.log('Profile not updated');
//     await editProfile.mutateAsync({ id: mobile, data: formData });
//     console.log('Profile updated successfully');
//   } catch (error) {
//     if (error.response) {
//       // Server responded with a status other than 200 range
//       console.log('Error Response:', error.response.data);
//     } else if (error.request) {
//       // Request was made but no response received
//       console.log('Error Request:', error.request);
//     } else {
//       // Something else happened in setting up the request
//       console.log('Error Message:', error.message);
//     }
//   }

//   console.log(JSON.stringify(formData));  // This will print your data in JSON format
// };
