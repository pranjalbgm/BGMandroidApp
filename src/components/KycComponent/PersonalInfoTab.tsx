import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  StyleSheet,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { ScrollView } from 'react-native';

interface PersonalInfoTabProps {
  formData: {
    profileImage?: any;
    dob: string;
    permanent_address: string;
    pincode: string;
    gst_no?: string;
  };
  updateForm: (field: string, value: string | any) => void;
  playerData: any;
  onPickDocument: (image: any) => void;
  onSubmit: () => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  updateForm,
  playerData,
  onPickDocument,
  onSubmit
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mobileWarning, setMobileWarning] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const [errors, setErrors] = useState({ dob: '', pincode: '' });

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 500,
        maxWidth: 500,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          onPickDocument(selectedImage);
        }
      }
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      updateForm('dob', selectedDate.toISOString().split('T')[0]);

      // Validate age
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      if (
        age < 18 ||
        (age === 18 &&
          (today.getMonth() < selectedDate.getMonth() ||
            (today.getMonth() === selectedDate.getMonth() &&
              today.getDate() < selectedDate.getDate())))
      ) {
        setErrors((prev) => ({ ...prev, dob: 'You must be at least 18 years old' }));
      } else {
        setErrors((prev) => ({ ...prev, dob: '' }));
      }
    }
  };

  const validatePincode = () => {
    if (formData.pincode.length !== 6) {
      setErrors((prev) => ({ ...prev, pincode: 'Pincode must be 6 digits' }));
    } else {
      setErrors((prev) => ({ ...prev, pincode: '' }));
    }
  };

  const handleSubmit = () => {
    validatePincode(); // Ensure pincode is validated before submission
    if (errors.dob || errors.pincode) {
      Alert.alert('Error', 'Please correct the errors before submitting.');
      return;
    }
    onSubmit();
  };

  const isFormValid = () => {
    return formData.dob && formData.permanent_address && formData.pincode;
  };

  return (
    <View style={styles.container}>
      {/* <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      > */}
      {/* <Text style={styles.sectionTitle}>Upload Profile Image</Text>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageButton}>
          {formData.profileImage || (playerData?.data?.image) ? (
            <Image
              source={{
                uri: formData.profileImage?.uri || 
                     `https://api.thebgmgame.com/${playerData.data.image}`
              }}
              style={styles.profileImage}
            />
          ) : (
            <>
              <Image
                source={require('../../images/profile.png')}
                style={styles.defaultProfileImage}
              />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={24} color="#ffffff" />
              </View>
            </>
          )}
        </TouchableOpacity>
      </View> */}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          value={`+91 ${playerData?.data?.mobile || ''}`}
          editable={false}
          style={styles.input}
          onFocus={() => setMobileWarning(true)}
        />
        {mobileWarning && <Text style={styles.warningText}>This field is not editable</Text>}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={`${playerData?.data?.email || ''}`}
          editable={false}
          style={styles.input}
          onFocus={() => setEmailWarning(true)}
        />
        {emailWarning && <Text style={styles.warningText}>This field is not editable</Text>}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerContainer}>
          <Text style={[styles.input, !formData.dob && { color: '#888' }]}>
            {formData.dob ? formData.dob : 'Select Date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker 
            value={date} 
            mode="date" 
            display="default" 
            onChange={handleDateChange} 
          />
        )}
        {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput value={formData.permanent_address} onChangeText={(text) => updateForm('permanent_address', text)} style={styles.input} />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          value={formData.pincode}
          onChangeText={(text) => updateForm('pincode', text)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={6}
          onBlur={validatePincode}
        />
        {errors.pincode ? <Text style={styles.errorText}>{errors.pincode}</Text> : null}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>GST No (Optional)</Text>
        <TextInput value={formData.gst_no} onChangeText={(text) => updateForm('gst_no', text)} style={styles.input} />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { opacity: isFormValid() ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!isFormValid()}
        >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
        {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 15,
    marginBottom:20
  },
  scrollContainer: {
    // flexGrow: 1,
    // alignItems: 'center',
    // paddingVertical: 20,
  },
  errorText: { color: 'red', fontSize: 12, marginTop: 3 },
  warningText: { color: 'yellow', fontSize: 12, marginTop: 3 },
  sectionTitle: {
    color: '#000',
    marginBottom: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageButton: {
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  inputGroup: {
    marginBottom: 15,
    width:300
  },
  label: {
    color: '#000',
    // marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ECECEC',
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 45,
    textAlignVertical: 'center',
    justifyContent: 'center',
    // lineHeight: 45,
  },
  datePickerContainer: {
    backgroundColor: '#ECECEC',
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'green',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PersonalInfoTab;
