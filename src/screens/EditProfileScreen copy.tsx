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
import {usePlayerData} from '../hooks/useHome';
import useWallet, {fetchMobile} from '../hooks/useWallet';
import {format} from 'date-fns';
import DocumentPicker from 'react-native-document-picker';
import {imageApiClient} from '../constants/api-client';
import {showAlert} from '../components/Alert';
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const EditProfileScreen = () => {
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({});

  // =========> Select file from memory and set in state
  const pickDocument = async setter => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // Specify image types if needed
      });

      setter(result);

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
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

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
  const playerData = usePlayerData();

  // =========> Fetch player info
  // useEffect(() => {
  //     fetchMobile(setMobile).then(mobile => playerData.mutate({mobile}));
  // }, [mobile]);
  useEffect(() => {
        fetchMobile(setMobile);
      }, []); 
    
      useEffect(() => {
    
        if (mobile) {
          playerData.mutate({ mobile });
        }
      }, [mobile]);
  

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

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(format(currentDate, 'yyyy-MM-dd'));
  };

  const submitInfo = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // Specify image types if needed
      });

      console.log('Results PickDocument', result);

      if (result[0]) {
        const imageUri = result[0].uri;
        const imageName = result[0].name;
        const imageType = result[0].type;

        // Convert image to base64
        const imageBase64 = await RNFS.readFile(imageUri, 'base64');

        const formData = {
          name: name,
          email: email,
          dob: selectedDate, // Ensure selectedDate is formatted correctly
          bank: bank,
          account_number: parseInt(account_number), // Convert account_number to an integer
          ifsc: ifsc,
          image: `${imageBase64}`,
        };

        try {
          console.log('Profile not updated');
          await editProfile.mutateAsync({id: mobile, data: formData});
          console.log('Profile updated successfully');
        } catch (error) {
          if (error.response) {
            // Server responded with a status other than 200 range
            // console.log('Error Response:', error.response);
            console.log('Error Response:', error.response.data);
          } else if (error.request) {
            // Request was made but no response received
            console.log('Error Request:', error.request);
          } else {
            // Something else happened in setting up the request
            console.log('Error Message:', error.message);
          }
        }

        console.log(JSON.stringify(formData)); // This will print your data in JSON format
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.log('Document Picker Error:', err);
      }
    }
  };

  // const submitInfo = async () => {
  //   const formData = {
  //     // image:image[0].uri,
  //     name: name,
  //     email: email,
  //     dob: selectedDate,  // Ensure selectedDate is formatted correctly
  //     bank: bank,
  //     account_number: account_number,
  //     ifsc: ifsc,
  //     image: image
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

  // useEffect(() => {
  //   if (editProfile.isSuccess) {
  //     showAlert("Successful!", "Edit Successfully.")
  //     navigation.navigate('EditProfileScreen')
  //   } else if (editProfile.isError) {
  //     showAlert("Successful!", "Could not place Edit...")
  //   }
  // }, [editProfile])

  useEffect(() => {
    editProfile.isSuccess && console.log(editProfile.data);
    // editProfile.isError && console.log(editProfile.error)
  }, [editProfile]);
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
                  {image ? (
                    <Image
                      source={{uri: image[0].uri}}
                      style={{width: 100, height: 100, borderRadius: 999}}
                    />
                  ) : (
                    <>
                      <Image
                        source={require('../images/profile.png')}
                        style={styles.profileimg}
                      />
                      {/* {console.log(imageApiClient + playerData.image)} */}
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
                  onChangeText={setName}
                  value={name || playerData?.data?.name}
                  placeholder="Enter Your Name"
                />
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
                  value={email || playerData?.data?.email}
                  placeholder="Enter Your Email"
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
                    value={selectedDate || 'YYYY-MM-DD'}
                    onFocus={() => setShowDatePicker(true)}
                    editable={false} // Make the TextInput non-editable
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
                  value={selectedDate || new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={{marginBottom: 15}}>
              <Text
                style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
                Aadhaar
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <Text style={{height: 50, paddingVertical: 15, color: '#000'}}>
                  {JSON.stringify(playerData?.data?.aadhar)}
                </Text>
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
                  placeholder="KYC Required"
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
                  value={bank || playerData?.data?.bank}
                  placeholder="Enter Your Bank Name"
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
                  value={account_number || playerData?.data?.account_number}
                  onChangeText={setAccountNumber}
                  placeholder="Enter Your Account Number"
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
                  value={ifsc || playerData?.data?.ifsc}
                  onChangeText={setIfsc}
                  placeholder="KYC Required"
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
                  value={playerData?.data?.account_holder}
                  placeholder="KYC Required"
                />
              </View>
            </View>

            <View style={{marginTop: 10}}>
              <TouchableOpacity style={styles.Btn} onPress={submitInfo}>
                <Text style={styles.primaryBtn}>Submit</Text>
                <View style={styles.bottomBorder} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <NavFooter />
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
