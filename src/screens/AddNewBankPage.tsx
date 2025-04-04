import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlayerDataFetch } from '../hooks/useHome';
// import { toast } from 'react-toastify'; 

import { fetchMobile } from '../hooks/useWallet';
import { useNewBankVerify } from '../hooks/useNewBankVerify';
import BankVerifyModal from '../components/NewBank/BankVerifyModal';
import HeaderThree from '../components/HeaderThree';

const AddNewBankPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const navigation = useNavigation();
  const { data: newBankVerify } = useNewBankVerify(mobileNumber) as { data?: any[] };
  const { data: playerInfo } = usePlayerDataFetch(mobileNumber) as { data?: any };
   const {refetch} = usePlayerDataFetch(mobileNumber);

  console.log("------------------------->>newBankVerify",newBankVerify?.results)

   useEffect(() => {
    const initializeMobile = async () => {
      const fetchedMobile = await fetchMobile(setMobileNumber);
      if (fetchedMobile && mobileNumber) {
        // playerInfo.mutate({ mobile: fetchedMobile });
        refetch
      }
    };
    initializeMobile();
  }, []);

  const handleShow = () => {
    if (playerInfo?.kyc === 'yes') {
      setShowModal(true);
    } else if (playerInfo?.iskycPending === 'yes') {
      Alert.alert('KYC Pending', 'Your KYC is in pending state. Please wait.');
    } else {
      Alert.alert('KYC Required', 'Please complete your KYC.');
    }
  };

  const handleClose = () => setShowModal(false);

  const prevStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    if (Array.isArray(newBankVerify) && newBankVerify?.results.length > 0) {
      newBankVerify.forEach((item) => {
        const prevStatus = prevStatuses.current[item?.mobile];
        const currentStatus = item?.status;

        if (prevStatus === 'pending' && currentStatus === 'success') {
          Alert.alert('Success', 'Bank verification successful!');
        } else if (prevStatus === 'pending' && currentStatus === 'rejected') {
          Alert.alert('Rejected', 'Bank verification rejected!');
        }

        prevStatuses.current[item?.mobile] = currentStatus;
      });
    }
  }, [newBankVerify]);

  return (
    <ScrollView >
      {/* Header */}
      <HeaderThree title='Add New Bank'/>
<View style={styles.BankPageWrapper}>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 10 }}>Current Bank Details</Text>
      {/* Current Bank Details */}
      {playerInfo ? (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput style={styles.input} value={playerInfo?.bank} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Holder Name</Text>
            <TextInput style={styles.input} value={playerInfo?.account_holder} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput 
  style={styles.input} 
  value={playerInfo?.account_number ? String(playerInfo.account_number) : "Loading..."} 
  editable={false} 
/>
</View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>IFSC Code</Text>
            <TextInput style={styles.input} value={playerInfo?.ifsc} editable={false} />
          </View>

          {/* <Button title="Change Bank Account"  onPress={handleShow} /> */}
          <TouchableOpacity onPress={handleShow} style={styles.button}><Text style={styles.buttonText}>Change Bank Account</Text></TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="blue" />
      )}

      {/* Pending Account Details */}
      {Array.isArray(newBankVerify?.results) && newBankVerify?.results.length > 0 && (
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Pending Account Details</Text>
          {newBankVerify?.results.filter((item) => item?.status === 'pending')
            .map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardText}>Bank Name: {item?.new_bank_details?.data?.ifsc_details?.bank || 'N/A'}</Text>
                <Text style={styles.cardText}>Account Holder: {item?.new_account_holder || 'N/A'}</Text>
                <Text style={styles.cardText}>Account Number: {item?.new_account_number || 'N/A'}</Text>
                <Text style={styles.cardText}>IFSC Code: {item?.new_bank_details?.data?.ifsc_details?.ifsc || 'N/A'}</Text>
                <Text style={[styles.cardText, { fontWeight: 'bold', color: 'red' }]}>Status: {item?.status || 'N/A'}</Text>
              </View>
            ))}
        </View>
      )}

      {/* Bank Verification Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <BankVerifyModal show={showModal} handleClose={handleClose} />
          {/* <Button title="Close" onPress={handleClose} /> */}
        </View>
      </Modal>

      </View>
    </ScrollView>
  );
};

const styles = {
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
    marginTop: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  BankPageWrapper : {
    padding: 20,
    marginTop: 20
  },
  button: {
    flex: 1,
    backgroundColor: "green",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
};

export default AddNewBankPage;
