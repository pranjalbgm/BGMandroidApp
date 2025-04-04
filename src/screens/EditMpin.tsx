import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePlayerDataFetch } from '../hooks/useHome';
import { fetchMobile } from '../hooks/useWallet';
import useMpin from '../hooks/useMpin';
import HeaderThree from '../components/HeaderThree';

// Type definitions
type RootStackParamList = {
  Homepage: undefined;
  SetMpin: undefined;
};

type SetMpinScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SetMpin'>;

interface SetMpinProps {
  navigation: SetMpinScreenNavigationProp;
}

const EditMpin: React.FC<SetMpinProps> = ({ navigation }) => {
    const [mobile,setMobile] = useState("");
  const [mpin, setMpin] = useState<string>('');
  const [confirmMpin, setConfirmMpin] = useState<string>('');
  const [showMpin, setShowMpin] = useState<boolean>(false);
  const [showConfirmMpin, setShowConfirmMpin] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mpinStrength, setMpinStrength] = useState<string>('');
  const [modal, setModal] = useState<{
    show: boolean;
    type: string;
    message: string;
  }>({ show: false, type: '', message: '' });

  const { data: playerData } = usePlayerDataFetch(mobile);
  const { mpinData, changeMpinMutate, isChanging, changeError, refetch } = useMpin();
  const lastMpin = mpinData?.mpin || 'N/A';
  console.log("-----",mpinData)

   useEffect(() => {
      const initializeMobile = async (): Promise<void> => {
        const fetchedMobile = await fetchMobile(setMobile);
        if (fetchedMobile) {
          playerData.refetch(fetchedMobile);
        }
      };
      initializeMobile();
    }, []);
  

  // Validate MPIN strength and return feedback
  const validateMpin = (value: string): string => {
    if (value.length !== 6) return 'MPIN must be exactly 6 characters long.';
    if (!/[A-Za-z]/.test(value)) return 'MPIN must contain at least one letter.';
    if (!/\d/.test(value)) return 'MPIN must contain at least one number.';

    // Check for at least two alphabetic characters
    const letterCount = (value.match(/[A-Za-z]/g) || []).length;
    if (letterCount < 2) return 'Weak: MPIN must contain at least two letters.';

    // Detect weak MPIN patterns
    if (/([a-zA-Z])\1{5}/.test(value)) return 'Weak: Contains repeated letters like \'aaaaaa\'.';
    if (/([0-9])\1{5}/.test(value)) return 'Weak: Contains repeated numbers like \'111111\'.';

    return ''; // Return an empty string if it's a strong MPIN
  };

  const handleMpinChange = (value: string) => {
    // Remove any non-alphanumeric characters
    value = value.replace(/[^A-Za-z0-9]/g, '');
    
    // Limit to 6 characters
    if (value.length <= 6) {
      setMpin(value);
      
      // Check if the user has entered at least 5 characters
      if (value.length >= 5) {
        const mpinError = validateMpin(value);
        setError(mpinError);
    
        if (!mpinError) {
          setMpinStrength('Strong');
        } else if (mpinError.includes('Weak')) {
          setMpinStrength('Weak');
        } else {
          setMpinStrength('');
        }
      } else {
        // Clear the error and strength indicators if the input is less than 5 characters
        setError('');
        setMpinStrength('');
      }
    }
  };

  const handleConfirmMpinChange = (value: string) => {
    // Remove any non-alphanumeric characters
    value = value.replace(/[^A-Za-z0-9]/g, '');
    
    // Limit to 6 characters
    if (value.length <= 6) {
      setConfirmMpin(value);
    }
  };

  const handleSubmit = () => {
    const mpinError = validateMpin(mpin);
    if (mpinError) {
      setError(mpinError);
      return;
    }

    if (mpin.length !== 6 || confirmMpin.length !== 6) {
      setModal({
        show: true,
        type: 'error',
        message: 'MPIN must be exactly 6 characters long.',
      });
      return;
    }

    if (mpin === confirmMpin) {
      changeMpinMutate(
        { mobile: mobile, mpin, reMpin: confirmMpin },
        {
          onSuccess: () => {
            setModal({
              show: true,
              type: 'success',
              message: 'MPIN has been successfully set!',
            });
            refetch();
            setTimeout(() => navigation.navigate('HomeScreen'), 2000);
          },
          onError: () => {
            setModal({
              show: true,
              type: 'error',
              message: 'Failed to set MPIN. Please try again.',
            });
          },
        }
      );
    } else {
      setModal({
        show: true,
        type: 'error',
        message: 'MPINs do not match. Please try again.',
      });
    }
  };

  const closeModal = () => setModal({ show: false, type: '', message: '' });

  return (
    <>
         <HeaderThree title={'Change MPIN'} />
      <View style={styles.container}>
      <View style={styles.mpinBox}>
        <Text style={styles.title}>Set MPIN</Text>
        <Text style={styles.oldMpin}>Your Old MPIN : {lastMpin}</Text>

        {/* New MPIN */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Create New MPIN</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter MPIN"
              value={mpin}
              onChangeText={handleMpinChange}
              maxLength={6}
              secureTextEntry={!showMpin}
              keyboardType="visible-password"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowMpin(!showMpin)}
            >
              <Icon name={showMpin ? 'eye' : 'eye-slash'} size={20} color="#333" />
            </TouchableOpacity>
          </View>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          {mpinStrength ? (
            <Text style={[
              styles.strengthText,
              mpinStrength === 'Strong' ? styles.strongText : styles.weakText
            ]}>
              {mpinStrength} MPIN
            </Text>
          ) : null}
        </View>

        {/* Confirm MPIN */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm MPIN</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm MPIN"
              value={confirmMpin}
              onChangeText={handleConfirmMpinChange}
              maxLength={6}
              secureTextEntry={!showConfirmMpin}
              keyboardType="visible-password"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowConfirmMpin(!showConfirmMpin)}
            >
              <Icon name={showConfirmMpin ? 'eye' : 'eye-slash'} size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {isChanging ? 'Changing...' : 'Submit'}
          </Text>
        </TouchableOpacity>

        {changeError && (
          <Text style={styles.errorText}>
            Error: {changeError.message}
          </Text>
        )}
      </View>

      {/* Modal for feedback */}
      <Modal
        visible={modal.show}
        transparent={true}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[
                styles.modalTitle,
                modal.type === 'success' ? styles.successText : styles.errorText
              ]}>
                {modal.type === 'success' ? 'Success!' : 'Error!'}
              </Text>
              <Text style={styles.modalMessage}>{modal.message}</Text>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  modal.type === 'success' ? styles.successButton : styles.errorButton
                ]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mpinBox: {
    width: width * 0.9,
    maxWidth: 400,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#023020',
    marginBottom: 18,
    fontFamily: 'sans-serif',
  },
  oldMpin: {
    textAlign: 'center',
    color: '#023020',
    marginBottom: 50,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    marginTop: 2,
  },
  strengthText: {
    fontSize: 12,
    marginTop: 2,
  },
  strongText: {
    color: 'green',
  },
  weakText: {
    color: 'red',
  },
  submitButton: {
    width: '100%',
    padding: 10,
    backgroundColor: 'rgb(4, 89, 25)',
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    maxWidth: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  successButton: {
    backgroundColor: 'green',
  },
  errorButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditMpin;