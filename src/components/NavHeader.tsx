import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getButtonColor, getButtonText } from '../utils/KycUtils';
import appStyles from '../styles/appStyles';
import { useNavigation } from '@react-navigation/native'; 

interface NavHeaderProps {
  mobile: string;
  playerData: any;
  onKycPress: () => void;
}

const NavHeader: React.FC<NavHeaderProps> = ({ mobile, playerData, onKycPress }) => {
    const navigation = useNavigation();
    
  const isDisabled =
    playerData?.data?.kyc === 'yes' ||
    playerData?.data?.kyc === 'pending' ||
    playerData?.data?.iskycPending === 'yes' ||
    (playerData?.data?.aadhar_status === 'yes' &&
      playerData?.data?.pan_status === 'yes' &&
      playerData?.data?.bank_status === 'yes') || 
    (playerData?.data?.isKycByAdmin === "no" &&
      playerData?.data?.kyc === "yes");

  return (
    <View style={styles.contentText}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../images/app_ic.png')}
            style={styles.logoImage}
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            <Text style={styles.primaryBtn}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.userIdText}>User ID: {mobile}</Text>

      <TouchableOpacity
        onPress={onKycPress}
        disabled={isDisabled}
        style={[
          styles.kycButton, 
          { 
            backgroundColor: getButtonColor(playerData),
            opacity: isDisabled ? 0.6 : 1,
          }
        ]}
      >
        <Text style={styles.kycButtonText}>
          {getButtonText(playerData)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    ...appStyles,
  contentText: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoWrapper: {
    marginBottom: 10,
  },
  logoImage: {
    height: 75, 
    width: 75,
  },
  editProfileBtn: {
    // Existing styles
  },
  editProfileText: {
    // Existing styles
  },
  userIdText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    paddingTop: 20,
  },
  kycButton: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  kycButtonText: {
    color: '#fff', 
    fontSize: 15, 
    fontWeight: '500'
  }
});

export default NavHeader;