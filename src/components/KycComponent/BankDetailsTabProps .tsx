import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  Alert
} from 'react-native';
import { useBankVerification } from '../../hooks/useBankVerification'; // Import the hook

// Define Props Type
interface BankDetailsTabProps {
  formData: {
    bank: string;
    accountNo: string;
    reEnterAccountNo: string;
    accountHolderName: string;
    ifsc: string;
  };
  updateForm: (field: string, value: string) => void;
  onNext: () => void;
  playerData: void;
}

const BankDetailsTab: React.FC<BankDetailsTabProps> = ({
  formData,
  updateForm,
  onNext,
  playerData
}) => {
  const [accountError, setAccountError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
// console.log("-------------------+++++hihihih",playerData?.data?.mobile)
  // Use the bank verification mutation hook
  const { verifyBank, isLoading, isError, isSuccess } = useBankVerification();

  // Validate account numbers match
  useEffect(() => {
    if (formData.accountNo && formData.reEnterAccountNo) {
      if (formData.accountNo !== formData.reEnterAccountNo) {
        setAccountError('Account numbers do not match');
        setIsVerified(false);
      } else {
        setAccountError(null);
      }
    }
  }, [formData.accountNo, formData.reEnterAccountNo]);

  // Handle Bank Verification
  const handleVerify = () => {
    if (!isFormValid()) {
      Alert.alert('Validation Error', 'Please fill all fields correctly');
      return;
    }

    const verificationData = {
      mobile: playerData?.data?.mobile,
      account_number: formData.accountNo,
      ifsc: formData.ifsc,
      account_holder: formData.accountHolderName,
      bank: formData.bank
    };

    verifyBank(verificationData);
  };

  // Handle success/error messages after mutation
  useEffect(() => {
    if (isSuccess) {
      setIsVerified(true);
      Alert.alert('Verification Success', 'Bank details verified successfully');
    }
    if (isError) {
      setIsVerified(false);
      Alert.alert('Verification Failed', 'Unable to verify bank details');
    }
  }, [isSuccess, isError]);

  // Check if all required fields are filled
  const isFormValid = () => {
    const { bank, accountNo, reEnterAccountNo, accountHolderName, ifsc } = formData;
    return (
      bank && 
      accountNo && 
      reEnterAccountNo && 
      accountHolderName && 
      ifsc && 
      accountNo === reEnterAccountNo
    );
  };

  return (
    <View style={styles.container}>
      {/* Bank Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Select Your Bank</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.bank}
            onChangeText={(text) => updateForm('bank', text)}
            placeholder="Select Bank"
          />
        </View>
      </View>

      {/* Account Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Account Number</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.accountNo}
            onChangeText={(text) => updateForm('accountNo', text)}
            placeholder="Enter Account Number"
            keyboardType="numeric"
            style={styles.input}
            maxLength={16}
          />
        </View>
      </View>

      {/* Re-enter Account Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Re-enter Account Number</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.reEnterAccountNo}
            onChangeText={(text) => updateForm('reEnterAccountNo', text)}
            placeholder="Re-enter Account Number"
            keyboardType="numeric"
            style={styles.input}
            maxLength={16}
          />
        </View>
        {accountError && <Text style={styles.errorText}>{accountError}</Text>}
      </View>

      {/* Account Holder Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Account Holder Name</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.accountHolderName}
            onChangeText={(text) => updateForm('accountHolderName', text)}
            placeholder="Enter Name"
            style={styles.input}
          />
        </View>
      </View>

      {/* IFSC Code */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>IFSC</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.ifsc}
            onChangeText={(text) => updateForm('ifsc', text)}
            placeholder="Enter IFSC"
            autoCapitalize="characters"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { 
              opacity: isFormValid() && !isLoading ? 1 : 0.5,
              backgroundColor: isFormValid() && !isLoading ? '#007AFF' : '#CCCCCC'
            }
          ]}
          onPress={handleVerify}
          disabled={!isFormValid() || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            { 
              opacity: isVerified ? 1 : 0.5,
              backgroundColor: isVerified ? 'green' : '#CCCCCC'
            }
          ]}
          onPress={onNext}
          disabled={!isVerified}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
    width: 300
  },
  label: {
    color: '#000000',
    marginBottom: 10,
    fontWeight: '500',
  },
  inputWrapper: {
    backgroundColor: '#ECECEC',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  input: {
    height: 45,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  verifyButton: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BankDetailsTab;
