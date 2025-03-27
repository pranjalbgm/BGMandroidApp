import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ImageBackground,
  Linking,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import appStyles from '../styles/appStyles';
import {getData, removeData} from '../constants/storage';
import {fetchMobile} from '../hooks/useWallet';
import {useGameSettings, usePlayerData} from '../hooks/useHome';
import {Modal} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {TextInput} from 'react-native';
import {BaseURLCLUB} from '../constants/api-client';
import {showAlert} from './Alert';
import {
  useResetVerifyAadhaar,
  useResetVerifyPan,
  useVerifyAadhaar,
  useVerifyPan,
} from '../hooks/useAddKYC';
import Loader from './Loader';
import Toast from 'react-native-simple-toast';
import ConfirmationModal from './ConfirmationModal';
import CancelKyc from './CancelKyc';

interface PlayerData {
  id?: number;
  name?: string;
  kycStatus?: string;
  [key: string]: any; // Allow extra properties
}

const KycModal = ({
  animationType,
  transparent,
  visible,
  setModalVisible,
  mobile,
  playerData,
}: {
  mobile: number | string;
  playerData: PlayerData;
  animationType: string;
  transparent: boolean;
  visible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>; // Prop type for state setter
}) => {
  // --------------------------
  // const [formData, setFormData] = useState(initialState);
  // const updateField = (field, value) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
  // };

  // const initialState = {
  //   setAadhar: '',
  //   setPan: '',
  //   setBank: '',
  //   setAccountNo: '',
  //   setAccountHolderName: '',
  //   setIfsc: '',
  //   setimageProfile:''
  // };
  // const resetForm = () => {

  //   setFormData(initialState)

  // };

  // ----------------------
  // const [mobile, setMobile] = useState("");
  const gameSetting = useGameSettings();
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [cancelKycModalVisible, setCancelKycModalVisible] = useState(false);

  const verifyAadhaar = useVerifyAadhaar();
  const resetAadhar = useResetVerifyAadhaar();
  const resetPan = useResetVerifyPan();
  // console.log("this is verify =================>",verifyAadhaar)
  const verifyPan = useVerifyPan();
  // const [mobile, setMobile] = useState(false);
  const [navTabsHomeName, setNavTabsHomeName] = useState('IdProof');
  const [addPointsAmount, setAddPointsAmount] = useState('');
  const [imageData, setImageData] = useState({});
  const [imageDataBack, setimageDataBack] = useState({});
  const [imageDataPan, setimagePan] = useState({});
  const [imageDataProfile, setimageProfile] = useState({});
  const [loader, setLoader] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');

  const [bank, setBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [reEnterAccountNo, setReEnterAccountNo] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [openKyc, setOpenKyc] = useState(true);
  const [activeCard, setActiveCard] = useState('aadhar');
  const [aadharFront, setAadharFront] = useState('');
  const [aadharBack, setAadharBack] = useState('');
  const [modalVisible4, setModalVisible4] = useState(false);
  const [panImage, setPanImage] = useState('');
  const [error, setError] = useState('');
  // const [navTabsHomeName, setNavTabsHomeName] = useState('IdProof');

  //  =============> KYC modal effects starts
  useEffect(() => {
    // Check if Aadhar verification is successful, and switch to Pan tab
    if (verifyAadhaar.isSuccess) {
      setActiveCard('pan');
    }
    console.log("this is aadhar kyc--------------------------true")
  }, [verifyAadhaar.isSuccess]);

  // Set default to 'IdProof'

  // State to track completion of each tab
  const [tabCompletionStatus, setTabCompletionStatus] = useState({
    IdProof: false,
    BankDetails: false,
    PersonalInfo: false,
  });

  // Function to handle tab switch
  const navTabsHomeFunc = tabName => {
    // if (!tabCompletionStatus[navTabsHomeName]) {
    //   Toast.show(`Please complete the current tab before proceeding`, Toast.LONG);
    //   return;
    // }
    setNavTabsHomeName(tabName);
  };

  const completeTab = tabName => {
    setTabCompletionStatus(prevState => ({
      ...prevState,
      [tabName]: true, // Mark the current tab as completed
    }));
  };
  //  for the id proof tab
  const handleIdProofSubmit = () => {
    // Here you could validate or perform some logic (e.g., form validation)
    // completeTab('IdProof');
    setNavTabsHomeName('BankDetails'); // Mark the IdProof tab as completed when the form is submitted
  };

  //  for the BankDetails tab
  const handleBankDetailsSubmit = () => {
    // completeTab('BankDetails'); // Mark the BankDetails tab as completed when the form is submitted
    setNavTabsHomeName('PersonalInfo');
  };

  //  =============> KYC modal effects ends
  const playerInfo = usePlayerData();
  // =========> Fetch player info
  useEffect(() => {
    if (!mobile) {
      playerInfo.mutate({mobile});
    }
    console.log("this is kyc modal ------------------------------true")
  }, [mobile]); // Make sure to include both mobile and playerInfo as dependencies

  // =========> Fetch player info ends here

  // const playerData = usePlayerData();

  const handleCancel = () => {
    console.log('Action canceled!');
    setConfirmationModalVisible(false);
  };
  const onClose = () => {
    console.log('Action canceled!');
    setCancelKycModalVisible(true);
  };

  const handleCancelkyc = () => {
    setCancelKycModalVisible(false);
  };

  const onCancelKyc = async () => {
    setCancelKycModalVisible(false);
    setModalVisible(false);
  };

  const onKycSubmit = async () => {
    const fields = [
      {value: aadhar, name: 'Aadhar'},
      {value: pan, name: 'Pan'},
      {value: bank, name: 'Bank'},
      {value: accountNo, name: 'Account Number'},
      {value: accountHolderName, name: 'Account Holder Name'},
      {value: ifsc, name: 'IFSC'},
      {value: imageDataProfile, name: 'Profile Image'},
    ];

    const missingFields = fields
      .filter(field => !field.value)
      .map(field => field.name);

    if (missingFields.length > 0) {
      const missingFieldsList = missingFields.join(', ');
      Toast.show(`${missingFieldsList} are required`, Toast.LONG);
      return;
    } else {
      setLoader(true);
      setModalVisible(false);

      const formData = new FormData();

      if (profileImage) {
        formData.append('image', {
          uri: profileImage.uri,
          type: profileImage.type,
          name: profileImage.name,
        });
      }

      // Append other form data
      formData.append('aadhar', aadhar);
      formData.append('pan', pan);
      formData.append('bank', bank);
      formData.append('account_holder', accountHolderName);
      formData.append('account_number', accountNo);
      formData.append('ifsc', ifsc);
      // formData.append("name", name);
      formData.append('mobile', mobile);
      formData.append('email', email);
      formData.append('kyc', 'yes');

      try {
        // console.log(formData);

        // Make sure to set the headers for multipart/form-data
        const response = await fetch(
          `${BaseURLCLUB}/player-update/${mobile}/`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
            body: formData,
          },
        );

        if (response.ok) {
          console.log('Submit Kyc Successfully');
          showAlert('Submit Kyc Successfully');
          setConfirmationModalVisible(false);
          const responseData = await response.json();
          console.log('Upload successful', responseData);
          fetchMobile(setMobile).then(mobile => playerData.mutate({mobile}));
        } else {
          const errorData = await response.json();
          console.log('Error Response:', errorData);
          showAlert('Submit Kyc Unsuccessfully');
          setConfirmationModalVisible(false);
        }
        setLoader(false);
      } catch (error) {
        console.log('Error Message:', error.message);
        setLoader(false);
      }
    }
  };

  const isDisabled =
    playerData?.data?.kyc === 'yes' ||
    playerData?.data?.kyc === 'pending' ||
    (playerData?.data?.aadhar_status === 'yes' &&
      playerData?.data?.pan_status === 'yes' &&
      playerData?.data?.bank_status === 'yes');

  const initialState = {
    setAadhar: '',
    setPan: '',
    setBank: '',
    setAccountNo: '',
    setAccountHolderName: '',
    setIfsc: '',
    setimageProfile: '',
  };
  const resetForm = () => {
    setAadhar('');
    setPan('');
    setBank('');
    setAccountNo('');
    setAccountHolderName('');
    setIfsc('');
    setProfileImage(''); // Reset profile image
  };

  return (
    <>
      <Modal animationType="fade" transparent={transparent} visible={visible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              minHeight: 500,
              maxHeight: 570,
              width: '100%',
              borderTopEndRadius: 15,
              borderTopLeftRadius: 15,
              position: 'relative',
            }}>
            {/* ---------------CLOSE BUTTON--------------- */}
            <View
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: -45,
              }}>
              <TouchableOpacity
                onPress={() => onClose()}
                style={styles.closebutton}>
                <Text style={styles.textIcon}>
                  <AntDesign name="close" size={24} color={'#707070'} />
                </Text>
              </TouchableOpacity>
            </View>

            {/* ---------------TABS--------------- */}
            <View style={styles.tabContainer}>
              <View
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={[
                    styles.tabContainerItem,
                    navTabsHomeName === 'IdProof' &&
                      styles.activetabContainerItem,
                  ]}
                  onPress={() => navTabsHomeFunc('IdProof')}>
                  <Text
                    style={[
                      styles.tabContainerText,
                      navTabsHomeName === 'IdProof' &&
                        styles.activeTabContainerText,
                    ]}>
                    Id Proof
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabContainerItem,
                    navTabsHomeName === 'BankDetails' &&
                      styles.activetabContainerItem,
                  ]}
                  onPress={() => navTabsHomeFunc('BankDetails')}>
                  <Text
                    style={[
                      styles.tabContainerText,
                      navTabsHomeName === 'BankDetails' &&
                        styles.activeTabContainerText,
                    ]}>
                    Bank Details
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabContainerItem,
                    navTabsHomeName === 'PersonalInfo' &&
                      styles.activetabContainerItem,
                  ]}
                  onPress={() => navTabsHomeFunc('PersonalInfo')}>
                  <Text
                    style={[
                      styles.tabContainerText,
                      navTabsHomeName === 'PersonalInfo' &&
                        styles.activeTabContainerText,
                    ]}>
                    Personal Info
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ---------------INFO FORM--------------- */}
            <ScrollView>
              <View style={styles.tabContentContainer}>
                {navTabsHomeName === 'IdProof' && (
                  <View>
                    <View style={{marginBottom: 15}}>
                      <Text
                        style={{
                          color: '#000000',
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        Document Type
                      </Text>

                      {/* ---------------Buttons to toggle between Aadhar Card and Pan Card--------------- */}
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 20,
                        }}>
                        <TouchableOpacity
                          style={[
                            styles.Btn,
                            activeCard === 'aadhar' && styles.activeBtn,
                          ]}
                          onPress={() => setActiveCard('aadhar')}>
                          <Text
                            style={[
                              styles.cartabsBtn,
                              activeCard === 'aadhar' && styles.activeText,
                            ]}>
                            Aadhar Card
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.Btn,
                            activeCard === 'pan' && styles.activeBtn,
                          ]}
                          onPress={() => setActiveCard('pan')}>
                          <Text
                            style={[
                              styles.cartabsBtn,
                              activeCard === 'pan' && styles.activeText,
                            ]}>
                            Pan Card
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* ---------------Render Aadhar Card section if activeCard is 'aadhar'--------------- */}

                      {activeCard === 'aadhar' && (
                        <View style={styles.aadharCard}>
                          <View
                            style={{
                              marginBottom: 15,
                              position: 'relative',
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                marginBottom: 10,
                                fontWeight: '500',
                              }}>
                              Aadhaar Number
                            </Text>
                            <View
                              style={{
                                backgroundColor: '#ECECEC',
                                paddingHorizontal: 15,
                              }}>
                              <TextInput
                                onChangeText={setAadhar}
                                value={aadhar}
                                placeholder="XXXX - XXXX - XXXX"
                                keyboardType="numeric"
                              />
                            </View>

                            <TouchableOpacity
                              style={{
                                position: 'absolute',
                                right: 20,
                                bottom: 15,
                              }}
                              // disabled={verifyAadhaar.isSuccess}
                              onPress={() => {
                                if (
                                  !(
                                    // verifyAadhaar.isError ||
                                    (
                                      verifyAadhaar.isSuccess ||
                                      verifyAadhaar.isPending
                                    )
                                  )
                                ) {
                                  verifyAadhaar.mutate({
                                    mobile,
                                    aadhar,
                                  });
                                }
                              }}>
                              <Text
                                style={{
                                  color: '#4CB050',
                                  textAlign: 'center',
                                  fontWeight: '500',
                                }}>
                                {verifyAadhaar.isSuccess
                                  ? 'Verified'
                                  : verifyAadhaar.isError
                                    ? 'Failed! Retry'
                                    : verifyAadhaar.isPending
                                      ? 'Verifying..'
                                      : 'Verify'}
                              </Text>
                            </TouchableOpacity>
                          </View>

                          {/* <View>
                            <TouchableOpacity
                              style={styles.Btn}
                              onPress={() =>
                                setModalVisible4(true)
                              }>
                              <Text style={styles.secondaryBtn}>
                                Upload
                              </Text>
                              <View
                                style={styles.bottomBorder}
                              />
                            </TouchableOpacity>
                          </View> */}
                          {/*
                                          <View style={{ marginTop: 50 }}>
                                            <TouchableOpacity
                                              style={styles.Btn}>
                                              <Text style={styles.primaryBtn}>
                                                Next
                                              </Text>
                                              <View
                                                style={styles.bottomBorder}
                                              />
                                            </TouchableOpacity>
                                          </View> */}
                        </View>
                      )}
                      {activeCard === 'pan' && (
                        <View style={styles.panCard}>
                          <View
                            style={{
                              marginBottom: 15,
                              position: 'relative',
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                marginBottom: 10,
                                fontWeight: '500',
                              }}>
                              PAN Number
                            </Text>
                            <View
                              style={{
                                backgroundColor: '#ECECEC',
                                paddingHorizontal: 15,
                              }}>
                              <TextInput
                                onChangeText={setPan}
                                value={pan}
                                placeholder="XXXXXXXXXX"
                                //keyboardType="numeric"
                                autoCapitalize="characters"
                              />
                            </View>

                            <TouchableOpacity
                              style={{
                                position: 'absolute',
                                right: 20,
                                bottom: 15,
                              }}
                              onPress={() => {
                                if (
                                  !(
                                    // verifyPan.isError ||
                                    (verifyPan.isSuccess || verifyPan.isPending)
                                  )
                                ) {
                                  verifyPan.mutate({
                                    mobile,
                                    pan,
                                  });
                                }
                              }}>
                              <Text
                                style={{
                                  color: '#4CB050',
                                  textAlign: 'center',
                                  fontWeight: '500',
                                }}>
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

                          {/* <View>
                            <TouchableOpacity
                              style={styles.Btn}
                              onPress={() =>
                                setModalVisible4(true)
                              }>
                              <Text style={styles.secondaryBtn}>
                                Upload
                              </Text>
                              <View
                                style={styles.bottomBorder}
                              />
                            </TouchableOpacity>
                          </View> */}

                          <View style={{marginTop: 50}}>
                            <TouchableOpacity
                              style={styles.Btn}
                              onPress={handleIdProofSubmit}
                              disabled={!verifyPan.isSuccess}>
                              <Text style={styles.primaryBtn}>Next</Text>
                              <View style={styles.bottomBorder} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {navTabsHomeName === 'BankDetails' && (
                  <View>
                    <View style={{marginBottom: 15}}>
                      <View style={styles.savingAccCard}>
                        {/* Select Your Bank */}
                        <View style={{marginBottom: 15}}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Select Your Bank
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              onChangeText={setBank}
                              value={bank}
                              placeholder="Select Bank"
                            />
                          </View>
                        </View>

                        {/* Account Number */}
                        <View style={{marginBottom: 15}}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Account Number
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              onChangeText={setAccountNo}
                              value={accountNo}
                              placeholder="Enter Account Number"
                              keyboardType="numeric"
                            />
                          </View>
                        </View>

                        {/* Re-enter Account Number */}
                        <View style={{marginBottom: 15}}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Re-enter Account Number
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              onChangeText={setReEnterAccountNo}
                              value={reEnterAccountNo}
                              placeholder="Re-enter Account Number"
                              keyboardType="numeric"
                            />
                          </View>
                          {reEnterAccountNo &&
                            reEnterAccountNo !== accountNo && (
                              <Text style={{color: 'red', marginTop: 5}}>
                                Account numbers do not match.
                              </Text>
                            )}
                        </View>

                        {/* Account Holder Name */}
                        <View style={{marginBottom: 15}}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Account Holder Name
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              onChangeText={setAccountHolderName}
                              value={accountHolderName}
                              placeholder="Enter Name"
                            />
                          </View>
                        </View>

                        {/* IFSC */}
                        <View style={{marginBottom: 15}}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            IFSC
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              onChangeText={setIfsc}
                              value={ifsc}
                              placeholder="Enter IFSC"
                              autoCapitalize="characters"
                            />
                          </View>
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity
                          style={[
                            styles.Btn,
                            {
                              opacity:
                                bank &&
                                accountNo &&
                                reEnterAccountNo &&
                                accountHolderName &&
                                ifsc &&
                                accountNo === reEnterAccountNo
                                  ? 1
                                  : 0.5,
                            },
                          ]}
                          onPress={handleBankDetailsSubmit}
                          disabled={
                            !(
                              bank &&
                              accountNo &&
                              reEnterAccountNo &&
                              accountHolderName &&
                              ifsc &&
                              accountNo === reEnterAccountNo
                            )
                          }>
                          <Text style={styles.primaryBtn}>Next</Text>
                          <View style={styles.bottomBorder} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}

                {navTabsHomeName === 'PersonalInfo' && (
                  <View>
                    <Text
                      style={{
                        color: '#000000',
                        marginBottom: 10,
                        fontWeight: '500',
                      }}>
                      Upload Profile Image
                    </Text>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                      }}>
                      <View style={{width: 100, height: 100}}>
                        <TouchableOpacity
                          onPress={() => pickDocument(setProfileImage, '0')}
                          style={{
                            ...styles.imguploadBtn,
                            borderRadius: 100,
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View style={styles.uploadProfile}>
                            {playerData &&
                            playerData.data &&
                            playerData.data.image ? (
                              <View style={{position: 'relative'}}>
                                <Image
                                  source={{
                                    uri: imageDataProfile.uri
                                      ? imageDataProfile.uri
                                      : 'https://api.thebgmgame.com/' +
                                        playerData.data.image,
                                  }}
                                  style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 999,
                                  }}
                                />
                                {/* Render additional content on top of the image */}
                              </View>
                            ) : (
                              <>
                                <Image
                                  source={require('../images/profile.png')}
                                  style={styles.profileimg}
                                />
                                <View style={styles.icon}>
                                  <Ionicons
                                    name="camera"
                                    size={24}
                                    color="#ffffff"
                                  />
                                </View>
                              </>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* <View style={{ marginBottom: 15 }}>
                      <Text
                        style={{
                          color: '#000000',
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        Name
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#ECECEC',
                          paddingHorizontal: 15,
                        }}>
                        <TextInput
                          onChangeText={setName}
                          value={name}
                          placeholder="Enter Name"
                        />
                      </View>
                    </View> */}

                    <View
                      style={{
                        marginBottom: 15,
                        position: 'relative',
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        Mobile
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#ECECEC',
                          paddingHorizontal: 15,
                        }}>
                        <TextInput
                          value={`+91 ${mobile}`}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        marginBottom: 15,
                        position: 'relative',
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        Email
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#ECECEC',
                          paddingHorizontal: 15,
                        }}>
                        <TextInput
                          onChangeText={setEmail}
                          value={email}
                          placeholder="Enter Email"
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.Btn}
                      // onPress={() => onKycSubmit()}
                      onPress={() => setConfirmationModalVisible(true)}>
                      <Text style={styles.primaryBtn}>Submit</Text>
                      <View style={styles.bottomBorder} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={confirmationModalVisible}
        transactions={true}
        onSubmit={onKycSubmit}
        onCancel={handleCancel}
      />

      <CancelKyc
        visible={cancelKycModalVisible}
        transactions={true}
        onSubmit={onCancelKyc}
        onCancel={handleCancelkyc}
      />
    </>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default KycModal;
