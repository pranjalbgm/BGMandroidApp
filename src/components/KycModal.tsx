import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';

// Separate component imports
import ConfirmationModal from './ConfirmationModal';
import CancelKyc from './CancelKyc';
import IdProofTab from '../components/KycComponent/IdProofTab';
import BankDetailsTab from '../components/KycComponent/BankDetailsTabProps ';
import PersonalInfoTab from '../components/KycComponent/PersonalInfoTab';

// Hooks and utilities
import { 
  useVerifyAadhaar, 
  useVerifyPan, 
  useResetVerifyAadhaar, 
  useResetVerifyPan 
} from '../hooks/useAddKYC';
import { usePlayerData } from '../hooks/useHome';
import { fetchMobile } from '../hooks/useWallet';
import { BaseURLCLUB } from '../constants/api-client';
import { showAlert } from './Alert';
import { pickDocument } from '../components/KycComponent/pickDocument '; // Create this utility function
import appStyles from '../styles/appStyles';

// Types
interface KycModalProps {
  animationType: string;
  transparent: boolean;
  visible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  mobile: number | string;
  playerData: PlayerData;
}

interface PlayerData {
  id?: number;
  name?: string;
  kycStatus?: string;
  [key: string]: any;
}

const KycModal: React.FC<KycModalProps> = ({
  animationType,
  transparent,
  visible,
  setModalVisible,
  mobile,
  playerData,
}) => {
  // State Management
  const [navTabsHomeName, setNavTabsHomeName] = useState<string>('IdProof');
  const [activeCard, setActiveCard] = useState<string>('aadhar');
  const [loader, setLoader] = useState<boolean>(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState<boolean>(false);
  const [cancelKycModalVisible, setCancelKycModalVisible] = useState<boolean>(false);

  // Form States
  const [formData, setFormData] = useState({
    permanent_address: '',
    pincode: '',
    dob: '',
    gst_no: '',
  });

  // Hooks
  const verifyAadhaar = useVerifyAadhaar();
  const verifyPan = useVerifyPan();
  const playerInfo = usePlayerData();

  // Verification Effect
  useEffect(() => {
    if (verifyAadhaar.isSuccess) {
      setActiveCard('pan');
    }
  }, [verifyAadhaar.isSuccess]);

  // Mobile Fetch Effect
  useEffect(() => {
    if (!mobile) {
      playerInfo.mutate({mobile});
    }
  }, [mobile, playerInfo]);

  // Tab Navigation
  const navTabsHomeFunc = useCallback((tabName: string) => {
    setNavTabsHomeName(tabName);
  }, []);

  // Form Update Handler
  const updateForm = useCallback((field: string, value: string | any) => {
    setFormData(prev => ({...prev, [field]: value}));
  }, []);

  // KYC Submit Handler
  const onKycSubmit = async () => {
    setLoader(true);
    setModalVisible(false);

    const submitFormData = new FormData();
    submitFormData.append('mobile', mobile);
    submitFormData.append('permanent_address', formData.permanent_address);
    submitFormData.append('pincode', formData.pincode);
    submitFormData.append('kyc', 'yes');
    submitFormData.append('dob', formData.dob);
    if (formData.gst_no) {
      submitFormData.append('gst_no', formData.gst_no);
    }

    try {
      const response = await fetch(`${BaseURLCLUB}/player-update/${mobile}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        body: submitFormData,
      });

      if (response.ok) {
        showAlert('Submit KYC Successfully');
        const responseData = await response.json();
        fetchMobile(() => {}).then(() => playerData.mutate({mobile}));
      } else {
        const errorData = await response.json();
        showAlert('Submit KYC Unsuccessfully');
        console.error('KYC Submit Error:', errorData);
      }
    } catch (error) {
      console.error('KYC Submit Error:', error);
      showAlert('Submit KYC Unsuccessfully');
    } finally {
      setLoader(false);
      setConfirmationModalVisible(false);
    }
  };

   // Render Tabs
   const renderTabContent = () => {
    switch (navTabsHomeName) {
      case 'IdProof':
        return (
          <IdProofTab 
            activeCard={activeCard}
            setActiveCard={setActiveCard}
            formData={formData}
            updateForm={updateForm}
            verifyAadhaar={verifyAadhaar}
            verifyPan={verifyPan}
            mobile={mobile}
            onNext={() => navTabsHomeFunc('BankDetails')}
          />
        );
      case 'BankDetails':
        return (
          <BankDetailsTab 
            formData={formData}
            playerData={playerData}
            updateForm={updateForm}
            onNext={() => navTabsHomeFunc('PersonalInfo')}
          />
        );
      case 'PersonalInfo':
        return (
          <PersonalInfoTab 
            formData={formData}
            updateForm={updateForm}
            playerData={playerData}
            onSubmit={() => setConfirmationModalVisible(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
     <Modal 
        animationType={animationType} 
        transparent={transparent} 
        visible={visible}
      >
        {/* Modal Content */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity 
                onPress={() => setCancelKycModalVisible(true)} 
                style={styles.closeButton}
              >
                <Text style={styles.textIcon}>
                    <AntDesign name="close" size={24} color={'#707070'} />
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              {['IdProof', 'BankDetails', 'PersonalInfo'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabContainerItem,
                    navTabsHomeName === tab && styles.activetabContainerItem
                  ]}
                  onPress={() => navTabsHomeFunc(tab)}
                >
                  <Text style={[
                    styles.tabContainerText,
                    navTabsHomeName === tab && styles.activeTabContainerText
                  ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Content */}
            <View style={styles.tabContentContainer}>
              {renderTabContent()}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modals */}
      <ConfirmationModal
        visible={confirmationModalVisible}
        transactions={true}
        onSubmit={onKycSubmit}
        onCancel={() => setConfirmationModalVisible(false)}
      />

      <CancelKyc
        visible={cancelKycModalVisible}
        transactions={true}
        onSubmit={() => {
          setCancelKycModalVisible(false);
          setModalVisible(false);
        }}
        onCancel={() => setCancelKycModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // Add other necessary styles...
});

export default KycModal;
