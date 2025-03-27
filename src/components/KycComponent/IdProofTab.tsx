import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import appStyles from '../../styles/appStyles';

interface IdProofTabProps {
  activeCard: string;
  setActiveCard: (card: string) => void;
  formData: {
    aadhar?: string;
    pan?: string;
    aadharFrontImage?: { uri: string };
    aadharBackImage?: { uri: string };
  };
  updateForm: (field: string, value: string | { uri: string }) => void;
  verifyAadhaar: {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    mutate: (data: { 
      mobile: number | string; 
      aadhar: string; 
      aadharFrontImage?: string; 
      aadharBackImage?: string 
    }) => void;
  };
  verifyPan: {
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    mutate: (data: { mobile: number | string; pan: string }) => void;
  };
  mobile: number | string;
  onNext: () => void;
}

const IdProofTab: React.FC<IdProofTabProps> = ({
  activeCard,
  setActiveCard,
  formData,
  updateForm,
  verifyAadhaar,
  verifyPan,
  mobile,
  onNext,
}) => {
  const [aadharFrontImage, setAadharFrontImage] = useState<string | null>(
    formData.aadharFrontImage?.uri || null
  );
  const [aadharBackImage, setAadharBackImage] = useState<string | null>(
    formData.aadharBackImage?.uri || null
  );
  const [isVerifyButtonEnabled, setIsVerifyButtonEnabled] = useState(false);

  // Check if all fields are filled to enable verify button
  useEffect(() => {
    const isAllFieldsFilled = 
      formData.aadhar && 
      aadharFrontImage && 
      aadharBackImage;
    
    setIsVerifyButtonEnabled(!!isAllFieldsFilled);
  }, [formData.aadhar, aadharFrontImage, aadharBackImage]);

  const handleImagePicker = (type: 'front' | 'back') => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        
        if (type === 'front') {
          setAadharFrontImage(imageUri);
          updateForm('aadharFrontImage', { uri: imageUri });
        } else {
          setAadharBackImage(imageUri);
          updateForm('aadharBackImage', { uri: imageUri });
        }
      }
    });
  };

  const handleVerifyAadhaar = () => {
    if (isVerifyButtonEnabled) {
      verifyAadhaar.mutate({ 
        mobile, 
        aadhar: formData.aadhar || '',
        aadharFrontImage: aadharFrontImage || undefined,
        aadharBackImage: aadharBackImage || undefined
      });
    }
  };

  const handleProceedToPan = () => {
    if (
      verifyAadhaar.isSuccess && 
      aadharFrontImage && 
      aadharBackImage
    ) {
      setActiveCard('pan');
    } else {
      Alert.alert(
        'Incomplete Aadhaar Verification',
        'Please complete Aadhaar verification by:\n1. Entering Aadhaar number\n2. Verifying Aadhaar number\n3. Uploading front and back photos'
      );
    }
  };

  const renderAadharSection = () => (
    <View style={styles.aadharCard}>
      {/* Aadhaar Number Input */}
      <View style={styles.kycinputContainer}>
        <Text style={styles.aadharlabel}>Aadhaar Number</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={(text) => {
              const formattedText = text.replace(/\D/g, '').slice(0, 12); 
              updateForm('aadhar', formattedText);
            }}
            value={formData.aadhar}
            placeholder="Enter Aadhaar Number"
            keyboardType="numeric"
            maxLength={12} 
          />
        </View>
        
        {/* Separate Aadhaar Verify Button */}
        
      </View>

      <View style={styles.photoUploadRow}>
        {/* Aadhaar Front Image Upload */}
        <View style={styles.photoUploadContainer}>
          <Text style={styles.aadharlabel}>Aadhaar Front Photo</Text>
          <TouchableOpacity 
            style={styles.imagePickerButton} 
            onPress={() => handleImagePicker('front')}
          >
            {aadharFrontImage ? (
              <Image 
                source={{ uri: aadharFrontImage }} 
                style={styles.uploadedImage} 
              />
            ) : (
              <Text style={styles.imagePickerText}>Upload Front Photo</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Aadhaar Back Image Upload */}
        <View style={styles.photoUploadContainer}>
          <Text style={styles.aadharlabel}>Aadhaar Back Photo</Text>
          <TouchableOpacity 
            style={styles.imagePickerButton} 
            onPress={() => handleImagePicker('back')}
          >
            {aadharBackImage ? (
              <Image 
                source={{ uri: aadharBackImage }} 
                style={styles.uploadedImage} 
              />
            ) : (
              <Text style={styles.imagePickerText}>Upload Back Photo</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.aadharverifybtn}>
      <TouchableOpacity
          style={[
            styles.aadharVerifyButton,
            { 
              opacity: isVerifyButtonEnabled ? 1 : 0.5,
              backgroundColor: isVerifyButtonEnabled 
                ? (verifyAadhaar.isSuccess ? '#4CB050' : '#007BFF') 
                : '#E0E0E0'
            }
          ]}
          onPress={handleVerifyAadhaar}
          disabled={!isVerifyButtonEnabled}
        >
          <Text style={[
            styles.aadharVerifyButtonText,
            { 
              color: isVerifyButtonEnabled 
                ? '#FFFFFF' 
                : '#888' 
            }
          ]}>
            {verifyAadhaar.isSuccess
              ? 'Verified'
              : verifyAadhaar.isError
              ? 'Failed! Retry'
              : verifyAadhaar.isPending
              ? 'Verifying..'
              : 'Verify Aadhaar'}
          </Text>
        </TouchableOpacity>
      {/* Proceed Button */}
      <TouchableOpacity
        style={[
          styles.Btn, 
          { 
            opacity: verifyAadhaar.isSuccess && aadharFrontImage && aadharBackImage ? 1 : 0.5 
          }
        ]}
        onPress={handleProceedToPan}
        disabled={!(verifyAadhaar.isSuccess && aadharFrontImage && aadharBackImage)}
      >
        <Text style={styles.primaryBtn}>Proceed to PAN</Text>
      </TouchableOpacity>
      </View>
    </View>
  );

  const renderPanSection = () => (
    <View style={styles.panCard}>
      <View style={styles.kycinputContainer}>
        <Text style={styles.label}>PAN Number</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={(text) => updateForm('pan', text)}
            value={formData.pan}
            placeholder="XXXXXXXXXX"
            autoCapitalize="characters"
            maxLength={10}
          />
          <TouchableOpacity
            style={styles.panVerifyButton}
            onPress={() => {
              if (!(verifyPan.isSuccess || verifyPan.isPending)) {
                verifyPan.mutate({ mobile, pan: formData.pan || '' });
              }
            }}
          >
            <Text style={styles.panVerifyButtonText}>
              {verifyPan.isSuccess
                ? 'Verified'
                : verifyPan.isError
                ? 'Failed! Retry'
                : verifyPan.isPending
                ? 'Verifying..'
                : 'Verify'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.Btn, { opacity: verifyPan.isSuccess ? 1 : 0.5 }]}
        onPress={onNext}
        disabled={!verifyPan.isSuccess}
      >
        <Text style={styles.primaryBtn}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Text style={styles.documentTypeLabel}>Document Type</Text>
      <View style={styles.cardToggleContainer}>
        <TouchableOpacity
          style={[styles.Btn, activeCard === 'aadhar' && styles.activeBtn]}
          onPress={() => setActiveCard('aadhar')}
        >
          <Text style={[
            styles.cartabsBtn, 
            activeCard === 'aadhar' && styles.activeText
          ]}>
            Aadhar Card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.Btn, 
            (activeCard === 'pan' && verifyAadhaar.isSuccess && aadharFrontImage && aadharBackImage) 
              ? styles.activeBtn 
              : styles.inactiveBtn
          ]}
          onPress={() => {
            if (verifyAadhaar.isSuccess && aadharFrontImage && aadharBackImage) {
              setActiveCard('pan');
            } else {
              Alert.alert(
                'Cannot Access PAN Section',
                'Please complete Aadhaar verification first.'
              );
            }
          }}
        >
          <Text style={[
            styles.cartabsBtn, 
            (activeCard === 'pan' && verifyAadhaar.isSuccess && aadharFrontImage && aadharBackImage)
              ? styles.activeText 
              : styles.inactiveText
          ]}>
            Pan Card
          </Text>
        </TouchableOpacity>
      </View>

      {activeCard === 'aadhar' ? renderAadharSection() : renderPanSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  documentTypeLabel: {
    color: '#000000',
    marginBottom: 10,
    fontWeight: '500',
  },
  cardToggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kycinputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  aadharlabel: {
    color: '#000000',
    marginBottom: 10,
    fontWeight: '500',
  },
  inputWrapper: {
    backgroundColor: '#ECECEC',
    paddingHorizontal: 15,
    borderRadius: 8,
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aadharVerifyButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aadharVerifyButtonText: {
    fontWeight: '500',
  },
  aadharverifybtn:{
    borderRadius: 8,
    justifyContent: 'space-between',
    display:"flex",
    flexDirection:"row"
  },
  panVerifyButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#4CB050',
  },
  panVerifyButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  Btn: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  inactiveBtn: {
    backgroundColor: '#E0E0E0',
  },
  activeBtn: {
    backgroundColor: 'green',
  },
  primaryBtn: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cartabsBtn: {
    color: '#000000',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#888',
  },
  photoUploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  photoUploadContainer: {
    width: '48%', // Slightly less than half to account for spacing
  },
  photoLabel: {
    color: '#000000',
    marginBottom: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  imagePickerButton: {
    backgroundColor: '#ECECEC',
    height: 100, // Reduced height to fit in row
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  imagePickerText: {
    color: '#888',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default IdProofTab;