import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderThree from '../components/HeaderThree';
import DateTimePicker from '@react-native-community/datetimepicker';
import appStyles from '../styles/appStyles';
import useWallet, { fetchMobile } from '../hooks/useWallet';
import usePlayerProfile from '../hooks/usePlayerProfile';
import { format } from 'date-fns';
import DocumentPicker from 'react-native-document-picker';
import apiClient from '../constants/api-client';
import Toast from 'react-native-simple-toast';
import COLORS from '../components/COLORS';
import Loader from '../components/Loader';
import { usePlayerDataFetch } from '../hooks/useHome';

// Optimized interfaces
interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  editable?: boolean;
  onFocus?: () => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

// Reusable FormField component
const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  value, 
  placeholder, 
  editable = true, 
  onFocus, 
  keyboardType = 'default' 
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputField}>
      <TextInput
        value={value}
        placeholder={placeholder}
        style={{ color: COLORS.black }}
        editable={editable}
        onFocus={onFocus}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const EditProfileScreen: React.FC = () => {
  // State management
  const [mobile, setMobile] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageData, setImageData] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  
  // Custom hooks
  const playerData = usePlayerDataFetch(mobile);
  const { wallet } = useWallet();
  const { playerDetails } = usePlayerProfile();

  // Initialize mobile number and fetch player data
  useEffect(() => {
    const initializeMobile = async (): Promise<void> => {
      const fetchedMobile = await fetchMobile(setMobile);
      if (fetchedMobile) {
        playerData.refetch(fetchedMobile);
      }
    };
    initializeMobile();
  }, []);

  // Update date when player data changes
  useEffect(() => {
    if (playerData.data) {
      setSelectedDate(playerData.data.dob || null);
    }
  }, [playerData.data]);

  const handleFieldClick = (fieldName: string): void => {
    Toast.show(`${fieldName} is not editable.`, Toast.LONG);
  };

  const pickDocument = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: false,
      });
      
      setImageData(result[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error("Document picker error:", err);
      }
    }
  };

  const handleDateChange = (event: any, selected?: Date): void => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selected) {
      setSelectedDate(format(new Date(selected), 'yyyy-MM-dd'));
    }
  };

  const validation = (): void => {
    if (!selectedDate) {
      Toast.show('Please enter your date of birth', Toast.LONG);
      return;
    }
    submitInfo();
  };

  const submitInfo = async (): Promise<void> => {
    console.log('Starting profile update submission...');
  
    try {
      setLoader(true);
      
      // Create FormData object
      const formData = new FormData();
      
      // Always append DOB
      formData.append('dob', selectedDate as string);
  
      // Only append image if we have one
      if (imageData) {
        console.log('Including image in submission:', imageData);
        
        // Create proper image object for FormData
        const imageFile = {
          uri: imageData.uri,
          type: imageData.type || 'image/jpeg', // Fallback type if not provided
          name: imageData.name || 'profile-image.jpg', // Fallback name if not provided
        };
        
        formData.append('image', imageFile);
      }
  
      // Log FormData before submission (for debugging)
      console.log('FormData prepared for submission:', JSON.stringify(formData));
  
      const response = await apiClient.put(`/player-update/${mobile}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
  
      if (response.status === 200) {
        Toast.show('Profile updated successfully', Toast.LONG);
        playerData.refetch(mobile);
      } else {
        Toast.show(response.data.error || 'Update failed', Toast.LONG);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      const errorMessage = error.response?.data?.error || 'Network error. Please try again.';
      Toast.show(errorMessage, Toast.LONG);
    } finally {
      setLoader(false);
    }
  };

  // Get image URI from state or player data
  const getImageUri = (): string | null => {
    if (imageData?.uri) {
      return imageData.uri;
    } else if (playerData?.data?.image) {
      return playerData.data.image;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <HeaderThree title={'Profile'} />
      <ScrollView>
        <View style={styles.contentContainer}>
          {/* Balance and bonus */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceText}>
              Balance: <Text>{wallet?.total_amount || '0'}</Text>
            </Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceText}>
              Bonus: <Text>{(playerDetails && playerDetails[0]?.commission_amount) || 0}</Text>
            </Text>
          </View>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={pickDocument} activeOpacity={0.7}>
              <View style={styles.uploadProfile}>
                {getImageUri() ? (
                  <>
                  <Image
                    source={{ uri: getImageUri() as string }}
                    style={styles.profileImage}
                  />
                  <View style={styles.cameraIcon}>
                      <Ionicons name="camera" size={24} color="#ffffff" />
                    </View>
                    </>
                ) : (
                  <>
                    <Image
                      source={require('../images/profile.png')}
                      style={styles.profileimg}
                    />
                    <View style={styles.cameraIcon}>
                      <Ionicons name="camera" size={24} color="#ffffff" />
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Name Field */}
            <FormField
              label="Name"
              value={playerData?.data?.name || ''}
              placeholder="Enter Your Name"
              editable={false}
              onFocus={() => handleFieldClick('Name')}
            />

            {/* Email Field */}
            <FormField
              label="Email"
              value={playerData?.data?.email || ''}
              placeholder="Enter Your Email"
              editable={false}
            />

            {/* Mobile Field */}
            <FormField
              label="Mobile"
              value={mobile ? '+91 ' + mobile : ''}
              placeholder="Enter Your Mobile"
              editable={false}
            />

            {/* DOB Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>DOB</Text>
              <View style={styles.inputContainer}>
                <View style={styles.dateInputField}>
                  <TextInput
                    style={{ color: selectedDate ? COLORS.black : '#848282' }}
                    value={selectedDate || ''}
                    onFocus={() => setShowDatePicker(true)}
                    editable={false}
                    placeholder="DOB"
                  />
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => playerData?.data?.dob ? null : setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={selectedDate ? new Date(selectedDate) : new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Other non-editable fields */}
            <FormField
              label="Aadhaar"
              value={playerData?.data?.aadhar?.toString() || ''}
              placeholder="Aadhaar"
              editable={false}
            />

            <FormField
              label="PAN"
              value={playerData?.data?.pan || ''}
              placeholder="PAN"
              editable={false}
            />

            <FormField
              label="Bank"
              value={playerData?.data?.bank || ''}
              placeholder="Enter Your Bank Name"
              editable={false}
            />

            <FormField
              label="Account Number"
              value={playerData?.data?.account_number?.toString() || ''}
              placeholder="Enter Your Account Number"
              editable={false}
              keyboardType="numeric"
            />

            <FormField
              label="IFSC"
              value={playerData?.data?.ifsc || ''}
              placeholder="Enter your IFSC Code"
              editable={false}
            />

            <FormField
              label="Account Holder"
              value={playerData?.data?.account_holder || ''}
              placeholder="Enter account holder name"
              editable={false}
            />

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.Btn} onPress={validation}>
                <Text style={styles.primaryBtn}>Submit</Text>
                <View style={styles.bottomBorder} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <Loader visiblity={loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  contentContainer: { 
    padding: 20 
  },
  balanceCard: { 
    backgroundColor: '#000000', 
    padding: 20, 
    marginBottom: 15 
  },
  balanceText: { 
    color: '#ffffff', 
    textAlign: 'center', 
    fontWeight: '500' 
  },
  profileImageContainer: { 
    marginVertical: 25,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  uploadProfile: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: '#ECECEC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 999 
  },
  profileimg: {
    width: 40,
    height: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
    borderRadius: 999,
    padding: 5,
  },
  formContainer: { 
    marginBottom: 15 
  },
  fieldContainer: { 
    marginBottom: 15 
  },
  fieldLabel: { 
    color: '#000000', 
    marginBottom: 10, 
    fontWeight: '500' 
  },
  inputField: { 
    backgroundColor: '#ECECEC', 
    paddingHorizontal: 15 
  },
  dateInputField: { 
    backgroundColor: '#ECECEC', 
    paddingHorizontal: 15, 
    width: '100%' 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
  },
  buttonContainer: { 
    marginTop: 10 
  },
});

export default EditProfileScreen;