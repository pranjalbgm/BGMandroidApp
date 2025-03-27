import React, {useState, useEffect, useRef} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Animated,Easing,TouchableWithoutFeedback,Image,TextInput,Modal,Button,ImageBackground,Linking,AppState,Alert,} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import NavFooter from '../components/NavFooter';
import TextTicker from 'react-native-text-ticker';
import appStyles from '../styles/appStyles';
import useHome, {usePlayerData, usePlayerDataFetch} from '../hooks/useHome';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import useTransactionHistory from '../hooks/useDepositHistory';
import useWallet, {fetchMobile} from '../hooks/useWallet';
import useWithdrawPoints from '../hooks/useWithdrawPoints';
import useAddPoints, {
  useFrontSettings,
  useMidSetting,
  useMidSettingManualAccount,
  useMidSettingManualMerchantAccount,
  useMidSettingUpiGateway,
} from '../hooks/useAddPoints';
import {showAlert} from '../components/Alert';
import Loader from '../components/Loader';
import {BaseURLCLUB} from '../constants/api-client';
import Toast from 'react-native-simple-toast';
import COLORS from '../components/COLORS';
import axios from 'axios';
import WalletPoints from '../components/walletPoints';
import KycModal from '../components/KycModal';
import { getButtonText } from '../utils/KycUtils';

const WalletAddAmountScreen = ({navigation}: any) => {

   // =========> Fetch player info
useEffect(() => {
  fetchMobile(setMobile);
}, []); 

  // =========> States
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [ mobile, setMobile] = useState('');
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [modalVisibleWhatsApp, setModalVisibleWhatsApp] = useState(false);
  const [makeTransaction, setMakeTransaction] = useState(false);
  const [loader, setLoader] = useState(false);
  const [addPaymnetModel, setAddPaymnetModel] = useState(false);
  const [addPaymnetManualAccount, setAddPaymnetManualAccount] = useState(false);
  const [addPaymnetMerchantId, setAddPaymnetMerchantId] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [tid, setTid] = useState(0);
  const [addPointsAmount, setAddPointsAmount] = useState('');
  const [withdrawlPointsAmount, setWithdrawlPointsAmount] = useState('');
  const [manualAccountText, setManualAccountText] = useState({
    accountNumber: '',
    accountName: '',
    ifsc: '',
    admin: '',
    type: '',
    file:'',
    tranceId:''
  });
  const [manualTrancId, setManualTrancId] = useState('');
  const [errors, setError] = useState('');
  const {midSettingsManualMerchantAccount} =
    useMidSettingManualMerchantAccount();
  // =========> Make API Requests using custom hooks
  // const playerData = usePlayerData();
  const playerData = usePlayerDataFetch(mobile);
  const {
    transactions,
    error,
    isLoading,
    nextPage,
    prevPage,
    refetch,
    isNextDisabled,
    isPrevDisabled,
    currentPage,
  } = useTransactionHistory({
    initialPage: 1,
    pageSize: 10,
  });
  const addPoints = useAddPoints();
  const withdrawPoints = useWithdrawPoints();
  const {refetchWallet, wallet} = useWallet();
  const {forntSettings} = useFrontSettings();
  const {midSettings} = useMidSetting();
  const {midSettingsManualAccount} = useMidSettingManualAccount();
  const {midSettingsUpiGateway} = useMidSettingUpiGateway();

  const handleInputChange = (text: any) => {
    // Remove non-digit characters
    const sanitizedText = text.replace(/[^0-9]/g, '');

    // Limit input to 12 digits
    if (sanitizedText.length > 12) {
      setError('UTR ID cannot exceed 12 digits');
    } else {
      setError('');
    }

    // Set the state with the sanitized value (up to 12 digits)
    setManualTrancId(sanitizedText.slice(0, 12));
  };
 
       
// useEffect(() => {
//            if (mobile) {
//              playerData.mutate({ mobile });
//            }
//          }, [mobile]);
  // =========> Observe if user switched/closed app
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (makeTransaction) {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            try {
              console.log('UPI TRANSACTION DONE');
              await addPoints.mutateAsync({
                admin: selectedMerchant.admin,
                merchant_transaction_id: selectedMerchant.merchant_id,
                amount: parseInt(addPointsAmount),
                transaction_id: tid,
              });
              console.log('API TRANSACTION FAILED');
              setMakeTransaction(false);
              setAddPointsAmount('');
              refetch();
              subscription.remove();
            } catch (error) {
              console.log(error);
            }
          }

          appState.current = nextAppState;
          setAppStateVisible(appState.current);
          console.log('AppState', appState.current);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [makeTransaction]);
  // =========> Transactions Handling
  const redirectToPayment = (paymentUrl: string) => {
    Linking.openURL(paymentUrl).catch(err => {
      console.error('Failed to open URL:', err);
    });
  };

  const handleDepositUpi = async () => {
    console.log('depositing: ', addPointsAmount);

    // UPI URL creation

    try {
      const minAmount = forntSettings?.min_deposit;
      const maxAmount = forntSettings?.max_deposit;

      const amountToAdd = parseInt(addPointsAmount);

      if (amountToAdd < minAmount) {
        showAlert('Amount too low!');
        return;
      } else if (amountToAdd > maxAmount) {
        showAlert('Amount too High!');
        return;
      }

      const merchant_ids = midSettings?.filter(
        mid => amountToAdd >= mid.min_deposit && amountToAdd <= mid.max_deposit,
      );

      const random = Math.floor(Math.random() * merchant_ids?.length);

      setTid(Date.now());
      setSelectedMerchant(merchant_ids[random]);

      setMakeTransaction(true);

      const upiUrl = `${'upi://'}pay/?ver=${'01'}&mode=${'15'}&am=${addPointsAmount}&mam=${addPointsAmount}&cu=INR&pa=${selectedMerchant?.merchant_id}&pn=${selectedMerchant?.company}&mc=${'5816'}&tr=${Date.now()}&tn=${Date.now()}&tid=${tid}`;

      Linking.openURL(upiUrl).catch(err =>
        console.error("Couldn't load page", err),
      );

      // Consider where to put refetchWallet based on your application logic
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const onUpiGatewayCreate = async () => {
    try {
      const timestamp = Date.now();
      const random_number = Math.floor(Math.random() * 1000000);
      const transaction_id = `${timestamp}-${random_number}`;

      const params = JSON.stringify({
        transaction_id: transaction_id,
        amount: addPointsAmount, // Ensure addPointsAmount is defined and valid
        name: playerData?.data?.name,
        email: playerData?.data?.email,
        mobile: playerData?.data?.mobile,
        redirect_url: 'http://localhost:8081/WalletAddAmount/payment',
      });

      console.log('Request params:', params);

      const response = await axios.post(
        `${BaseURLCLUB}/create-payment-gateway/`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status === true) {
        const data = response.data.data;

        // Redirect to payment URL
        if (data.payment_url) {
          console.log('Redirecting to:', data.payment_url);
          await Linking.openURL(data.payment_url); // React Native's Linking for URL handling
        } else {
          Alert.alert('Error', 'Payment URL is missing. Please try again.');
        }

        // Check payment status
        checkPaymentStatus(transaction_id); // Ensure this is a properly defined function
      } else {
        console.log('Error message from server:', response.data.msg);
        Alert.alert(
          'Error',
          response.data.msg || 'Failed to create payment. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error creating order:', error);

      if (error.response && error.response.data) {
        console.error('Response data:', error.response.data);
      }

      Alert.alert('Error', 'Failed to create order. Please try again later.');
    }
  };
  // upi gateway ends

  const checkPaymentStatus = order_id => {
    const formatDate = date => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const params = JSON.stringify({
      transaction_id: order_id,
      date: formatDate(new Date()), // Replace moment here
    });

    var headers = {
      'Content-Type': 'application/json',
    };

    axios
      .post(`${BaseURLCLUB}/status-check-upi-gateway/`, params, {headers})
      .then(res => {
        if (res.data.status === true) {
          // Handle successful response here
          // console.log('Order created successfully:', res.data);
          const data = res.data;

          if (data.data.status == 'success') {
            addPoints
              .mutateAsync({
                // admin: adminType,
                amount: res.data.data.amount,
                transaction_id: order_id,
                mobile: mobileNumber,
                gateway: 'UpiGateway',
                merchant_transaction_id: data.data.upi_txn_id,
              })
              .catch(error => {
                console.log('addPoints.error :- ', error);
                // setManualAccountModel(false)
                // setNewShowModal(false);
              });
          } else if (data.data.status == 'Failure') {
            console.log(res.data.msg);
          }
        } else {
          // setAmountError(res.data.msg);
        }
      })
      .catch(err => {
        console.error('Error creating order:', err);
        return;
        console.error('Response data:', err.response.data); // Log the response data to get more information
        console.log('Failed to create order. Please try again.');
      });
  };
  const handleNewOpen = () => {
    if (addPointsAmount) {
      const amount = parseFloat(addPointsAmount); 
      let matchFound = false;
      let amountInRange = false;
      
     
      for (let index = 0; index < forntSettings?.results?.length; index++) {
        const item = forntSettings?.results?.[index];

        if (item.status == true) {
          if (amount >= item.min_deposit && amount <= item.max_deposit) {
            amountInRange = true;
            if (item.gateway == 'ManualUpi') {
              const matchingAccount = midSettings.find( midItem =>
                  midItem.type == 'ManualUpi' &&
                  midItem.status == true &&
                  amount >= midItem.min_deposit &&
                  amount <= midItem.max_deposit,
              );

              if (matchingAccount) {
                handleDepositUpi();
                matchFound = true;
                break; // Exit the loop if a match is found
              }
            } else if (item.gateway == 'ManualAccount') {
              const matchingAccount = midSettingsManualAccount.find(
                midItem =>
                  midItem.type == 'ManualAccount' &&
                  midItem.status == true &&
                  amount >= midItem.min_deposit &&
                  amount <= midItem.max_deposit,
              );

              if (matchingAccount) {
                setManualAccountText({
                  accountName: matchingAccount.account_holder_name,
                  accountNumber: matchingAccount.account_number,
                  ifsc: matchingAccount.ifsc,
                  admin: matchingAccount.admin,
                  type: matchingAccount.type,
                });
                addPaymnetManualAccount;
                setAddPaymnetManualAccount(true);
                matchFound = true;
                break; // Exit the loop if a match is found
              }
            } else if (item.gateway == 'UpiGateway') {
              console.log('entered till here');
              const matchingAccount = midSettingsUpiGateway.find(
                midItem =>
                  midItem.type == 'UpiGateway' &&
                  midItem.status == true &&
                  amount >= midItem.min_deposit &&
                  amount <= midItem.max_deposit,
              );

              if (matchingAccount) {
                console.log('entered till here and account matched');
                onUpiGatewayCreate();
                matchFound = true;
                break; // Exit the loop if a match is found
              }
            } else if (item.gateway == 'ManualMerchantId') {
              console.log('landed in maerchant id', midSettingsManualMerchantAccount);
              const matchingAccount = midSettingsManualMerchantAccount?.results?.find(
                midItem =>
                  midItem.type == 'ManualMerchantId' &&
                  midItem.status == true &&
                  amount >= midItem.min_deposit &&
                  amount <= midItem.max_deposit,
              );

              if (matchingAccount) {
                setManualAccountText({
                  // accountName: matchingAccount.account_holder_name,
                  // accountNumber: matchingAccount.account_number,
                  admin: matchingAccount.admin,
                  type: matchingAccount.type,
                  accountNumber: matchingAccount.company,
                  tranceId: matchingAccount.merchant_id,
                  accountName: matchingAccount.AccountHolderName,
                  file: matchingAccount.file,
                });
                addPaymnetMerchantId;
                setAddPaymnetMerchantId(true);
                // console.log('setaddpayement has been true');
                matchFound = true;
                break; // Exit the loop if a match is found
              }
            }
          }
        }
      }

      if (!amountInRange) {
        Toast.show('Amount is out of the allowed range', Toast.LONG);
      } else if (!matchFound) {
        Toast.show('No merchant id is found', Toast.LONG);
      }
    } else {
      Toast.show('Please enter point', Toast.LONG);
    }
  };

  const findMatchingAccount = (accounts, amount) => {
    const minDeposit = Math.min(
      ...accounts.map(account => account.min_deposit),
    );
    const maxDeposit = Math.max(
      ...accounts.map(account => account.max_deposit),
    );

    if (amount < minDeposit) {
      Toast.show('The amount is lower than the minimum deposit', Toast.LONG);
      return null;
    } else if (amount > maxDeposit) {
      Toast.show('The amount is higher than the maximum deposit', Toast.LONG);
      return null;
    } else {
      return (
        accounts.find(
          account =>
            amount >= account.min_deposit && amount <= account.max_deposit,
        ) || null
      );
    }
  };

  const onSubmitManualAccount = () => {
    const matchingAccount = findMatchingAccount(
      midSettingsManualAccount,
      addPointsAmount,
    );

    console.log(matchingAccount);
    if (matchingAccount) {
      setManualAccountText({
        accountName: matchingAccount.account_holder_name,
        accountNumber: matchingAccount.account_number,
        ifsc: matchingAccount.ifsc,
        admin: matchingAccount.admin,
        type: matchingAccount.type,
      });
    } else {
      setManualAccountText({
        accountName: '',
        accountNumber: '',
        ifsc: '',
        admin: null,
        type: '',
      });
    }

    setAddPaymnetManualAccount(true);
  };

  const onDoneManualAccount = async () => {
    setAddPaymnetManualAccount(false);
    // setAddPaymnetMerchantId(false);
    // if (manualTrancId) {
    //   await addPoints.mutateAsync({
    //     amount: addPointsAmount,
    //     admin: manualAccountText.admin,
    //     transaction_id: manualTrancId,
    //     merchant_account_holder_name: manualAccountText.type == 'ManualMerchantId' ?  manualAccountText.accountName : "",
    //     account_holder_name: manualAccountText.type == 'ManualMerchantId' ? '' : manualAccountText.accountName,
    //     merchant_transaction_id: manualAccountText.type == 'ManualMerchantId' ? manualAccountText.tranceId : '',
    //     account_number: manualAccountText.accountNumber,
    //     // account_holder_name: manualAccountText.accountName,
    //     ifsc: manualAccountText.ifsc,
    //     gateway: manualAccountText.type,

    //   }).catch((error) => {
    //     console.log(error)
    //   });
    //   Toast.show('Deposit added successfully', Toast.LONG)
    //   setAddPaymnetMerchantId(false)
    // }
    // else {
    //   Toast.show('Please enter UTR ID', Toast.LONG);
    // }

    if (manualTrancId && manualTrancId.length === 12) {
      try {
        await addPoints.mutateAsync({
          amount: addPointsAmount,
          admin: manualAccountText.admin,
          transaction_id: manualTrancId,
          merchant_account_holder_name:
            manualAccountText.type === 'ManualMerchantId'
              ? manualAccountText.accountName
              : '',
          account_holder_name:
            manualAccountText.type === 'ManualMerchantId'
              ? ''
              : manualAccountText.accountName,
          merchant_transaction_id:
            manualAccountText.type === 'ManualMerchantId'
              ? manualAccountText.tranceId
              : '',
          account_number: manualAccountText.accountNumber,
          ifsc: manualAccountText.ifsc,
          gateway: manualAccountText.type,
        });

        // On success, show the success toast

        if (addPoints.isSuccess) {
          console.log('%%%%%%%%%%-------->', addPoints.isSuccess, addPoints);
          Toast.show('Deposit added successfully', Toast.LONG);
          setAddPaymnetMerchantId(false);
        } else if (addPoints.isError) {
          console.log('%%%%%%%%%%-------->', addPoints.isError);
          Toast.show('Deposit not added ', Toast.LONG);
        }
        // Reset the form state
      } catch (error) {
        // On error, show the error message from the backend
        console.warn('this is warning', error.error);
        const errorMessage =
          error?.error || 'An error occurred. Please try again.';
        Toast.show(errorMessage, Toast.LONG);
      }
    } else {
      // Show toast if UTR ID is missing
      Toast.show('Please enter valid UTR ID', Toast.LONG);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawlPointsAmount) {
      Toast.show('Please enter  withdrawal point.', Toast.LONG);
      return;
    }

    try {
      setLoader(true);
        await fetchMobile(setMobile);
      const buttonText = getButtonText(playerData);
      if (buttonText === 'KYC Verified!') {
      if (wallet && wallet?.winAmount) {
   
          await withdrawPoints.mutateAsync(parseInt(withdrawlPointsAmount));
          refetchWallet();
          refetch();
          setWithdrawlPointsAmount('');
          Toast.show('Withdrawal Successful', Toast.LONG);
        } else {
          Toast.show(
            'Your Win Point is null or not fetched correctly',
            Toast.LONG,
          );
        }
      } else {
        
        // If KYC is not completed
          // setModalVisible(true);
          Toast.show(buttonText, Toast.LONG);
      }
    } catch (error) {
      console.error('Error in withdrawal process:', error);
      Toast.show(
        'An error occurred during withdrawal. Please try again.',
        Toast.LONG,
      );
    } finally {
      setLoader(false); // Always hide the loader
    }
  };

  const handleAddPoint = async () => {
    if (addPointsAmount) {
      try {
        setLoader(true);
         const buttonText = getButtonText(playerData); 
        if (buttonText === 'KYC Verified!') {
          handleNewOpen();
        } else {
          // setModalVisible(true);
          Toast.show(buttonText, Toast.LONG);
        }
        setLoader(false);
      } catch (error) {
        console.error('Error adding points:', error);
      }
    } else {
      Toast.show('Please enter point', Toast.LONG);
    }
  };



  //-------- Tabs-------//
  const [navTabHome, setNavTab] = useState(false);
  const [navTabHomeName, setNavTabName] = useState('Tab1');
  const navTabHomeFunc = async (tabName: any) => {
    setNavTab(true);
    setNavTabName(tabName);
  };
  //-------- End-------//

  //-------- Modal -------//
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  //-------- End -------//

  //-------- Tabs -------//
  
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          <Header
            page={'Wallet'}
            setMenuVisibility={setMenuVisibility}
            isMenuVisible={isMenuVisible}
          />

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <Navbar
              navigation={navigation}
              isMenuVisible={isMenuVisible}
              modalVisibleWhatsApp={modalVisibleWhatsApp}
              setModalVisibleWhatsApp={setModalVisibleWhatsApp}
            />

            <ScrollView style={styles.scrollView}>
              <TouchableWithoutFeedback>
                <View>
                  {/* ---------------TICKER--------------- */}
                  <View style={{ backgroundColor: '#000000', padding: 20 }}>

                <TextTicker
                  style={{
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                  duration={8000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2500}>
                  Deposite के लिए केवल अपने खाते का ही इस्तेमाल करें, अन्यथा आपको ब्लॉक किया जा सकता है!
                </TextTicker>

              </View>
                  <WalletPoints />

                  {/* ---------------PAGE--------------- */}
                  <View style={{marginTop: 20}}>
                    {/* ---------------HEADER--------------- */}
                    <View style={styles.customTab}>
                      <TouchableOpacity
                        style={[
                          styles.tabItem,
                          navTabHomeName === 'Tab1' && styles.activeTabItem,
                        ]}
                        onPress={() => navTabHomeFunc('Tab1')}>
                        <Text
                          style={[
                            styles.tabText,
                            navTabHomeName === 'Tab1' && styles.activeTabText,
                          ]}>
                          Add Point
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.tabItem,
                          navTabHomeName === 'Tab2' && styles.activeTabItem,
                        ]}
                        onPress={() => navTabHomeFunc('Tab2')}>
                        <Text
                          style={[
                            styles.tabText,
                            navTabHomeName === 'Tab2' && styles.activeTabText,
                          ]}>
                          Withdraw
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.customTabContant}>
                      {/* ---------------ADD POINTS--------------- */}
                      <View
                        style={{
                          display: navTabHomeName == 'Tab1' ? 'flex' : 'none',
                        }}>
                        {/* ADDING POINTS */}
                        <View
                          style={{
                            paddingHorizontal: 20,
                            paddingTop: 10,
                            paddingBottom: 20,
                          }}>
                          <View style={{marginBottom: 15}}>
                            <Text
                              style={{
                                color: '#000000',
                                marginBottom: 10,
                                fontWeight: '500',
                              }}>
                              Add Point
                            </Text>
                            <View
                              style={{
                                backgroundColor: '#ECECEC',
                                paddingHorizontal: 15,
                              }}>
                              <TextInput
                                onChangeText={setAddPointsAmount}
                                value={addPointsAmount}
                                placeholder="Enter Point"
                                keyboardType="numeric"
                              />
                            </View>
                          </View>

                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                            }}>
                            {[500, 1000, 1500, 2000, 2500, 3000].map(
                              (amount, index) => (
                                <View
                                  key={index}
                                  style={{width: '32%', marginVertical: 8}}>
                                  <TouchableOpacity
                                    style={styles.Btn}
                                    onPress={() => {
                                      setAddPointsAmount(`${amount}`);
                                    }}>
                                    <Text style={styles.tagBtn}>{amount}</Text>
                                  </TouchableOpacity>
                                </View>
                              ),
                            )}
                          </View>

                          <View style={{padding: 20}}>
                            {/* <Text
                          style={{
                            color: '#000000',
                            fontSize: 14,
                            textAlign: 'center',
                            fontWeight: '500',
                          }}>
                          आपका पैसा 5 से 10 मिनट मैं एड हो जाएगा
                        </Text> */}
                          </View>

                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <View style={{width: '48%'}}>
                              <TouchableOpacity
                                style={styles.Btn}
                                onPress={() => {
                                  handleAddPoint();
                                }}
                                // onPress={() => playerData?.data?.kyc === "yes" ? handleAddPoint() : setModalVisible4(true)}
                                // onPress={() => {
                                //   if (playerData?.data?.kyc === "no") {
                                //     handleAddPoint();
                                //   } else {
                                //     setModalVisible4(true);
                                //   }
                                // }}
                              >
                                <Text style={styles.secondaryBtn}>
                                  Add Points
                                </Text>
                                <View style={styles.bottomBorder} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                        {/* ADD POINTS HISTORY */}
                        <ScrollView horizontal>
                          <TouchableWithoutFeedback>
                            <View>
                              <View
                                style={{
                                  backgroundColor: '#001C0D',

                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  marginTop: 15,
                                }}>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  S. No.
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Pay Mode
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Transaction Id
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Date
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Points
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Closing Balance
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Status
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Receipt
                                </Text>
                              </View>

                              {isLoading ? (
                                <View
                                  style={{
                                    backgroundColor: '#ECECEC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#cccccc',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#000000',
                                      textAlign: 'left',
                                      width: '100%',
                                      fontWeight: '500',
                                      padding: 15,
                                    }}>
                                    Loading..
                                  </Text>
                                </View>
                              ) : error ? (
                                <View
                                  style={{
                                    backgroundColor: '#ECECEC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#cccccc',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#000000',
                                      textAlign: 'left',
                                      width: '100%',
                                      fontWeight: '500',
                                      padding: 15,
                                    }}>
                                    No Data Available.
                                  </Text>
                                </View>
                              ) : (
                                (Array.isArray(transactions)
                                  ? transactions.filter(
                                      transaction =>
                                        transaction.type === 'Credit',
                                    )
                                  : []
                                ).map((history, index) => (
                                  <View key={history.id || index}>
                                    <View
                                      style={{
                                        backgroundColor: 'white',

                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#cccccc',
                                      }}>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {index + 1}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.purpose}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.transaction_id}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {` ${history.created_at.split(' ')[0]} at ${history.created_at.split(' ').splice(1).join(' ')}`}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.amount}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.closing_balance || 0}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.action}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history?.action === "Success" ? (
                                          <Text>receipt</Text>
                                        ) : (
                                          <Text>...</Text>
                                        )}
                                      </Text>
                                    </View>
                                  </View>
                                ))
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                        </ScrollView>
                        {/* Pagination Controls */}
                        <View style={styles.pagination}>
                          <Button
                            title="Previous"
                            onPress={prevPage}
                            disabled={isPrevDisabled}
                          />
                          <Text style={styles.pageInfo}>
                            Page {currentPage}
                          </Text>
                          <Button
                            title="Next"
                            onPress={nextPage}
                            disabled={isNextDisabled}
                          />
                        </View>
                      </View>

                      {/* ---------------WITHDRAWL--------------- */}
                      <View
                        style={{
                          display: navTabHomeName == 'Tab2' ? 'flex' : 'none',
                        }}>
                        {/* ---------------WITHDRAWING POINTS--------------- */}
                        <View
                          style={{
                            paddingHorizontal: 20,
                            paddingTop: 10,
                            paddingBottom: 20,
                          }}>
                          <View style={{marginBottom: 15}}>
                            <Text
                              style={{
                                color: '#000000',
                                marginBottom: 10,
                                fontWeight: '500',
                              }}>
                              Withdraw
                            </Text>
                            <View
                              style={{
                                backgroundColor: '#ECECEC',
                                paddingHorizontal: 15,
                              }}>
                              <TextInput
                                onChangeText={setWithdrawlPointsAmount}
                                value={withdrawlPointsAmount}
                                placeholder="Enter Withdraw Point"
                                keyboardType="numeric"
                              />
                            </View>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                            }}>
                            {[500, 1000, 1500, 2000, 2500, 3000].map(
                              (amount, index) => (
                                <View
                                  key={index}
                                  style={{width: '32%', marginVertical: 8}}>
                                  <TouchableOpacity
                                    style={styles.Btn}
                                    onPress={() => {
                                      setWithdrawlPointsAmount(`${amount}`);
                                    }}>
                                    <Text style={styles.tagBtn}>{amount}</Text>
                                  </TouchableOpacity>
                                </View>
                              ),
                            )}
                          </View>

                          <View style={{padding: 20}}>
                            {/* <Text
                          style={{
                            color: '#000000',
                            fontSize: 14,
                            textAlign: 'center',
                            fontWeight: '500',
                          }}>
                          आपका पैसा 5 से 10 मिनट मैं एड हो जाएगा
                        </Text> */}
                          </View>

                          <View
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <View style={{width: '48%'}}>
                              <TouchableOpacity
                                style={styles.Btn}
                                onPress={() => handleWithdrawal()}>
                                <Text style={styles.secondaryBtn}>
                                  Withdrawal{' '}
                                </Text>
                                <View style={styles.bottomBorder} />
                              </TouchableOpacity>
                            </View>

                            <Text
                              style={{
                                color: '#000000',
                                textAlign: 'center',
                                fontWeight: '500',
                                paddingTop: 20,
                              }}>
                              Request History
                            </Text>
                          </View>

                          {/* ---------------KYC MODAL--------------- */}

                          <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible4}
                            onRequestClose={() => setModalVisible4(false)}>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              }}>
                              <View
                                style={{
                                  backgroundColor: 'white',
                                  minHeight: 200,
                                  width: '92%',
                                  borderTopEndRadius: 15,
                                  borderTopLeftRadius: 15,
                                  position: 'relative',
                                  borderRadius: 10,
                                }}>
                                <View
                                  style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    marginTop: -45,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => setModalVisible4(false)}
                                    style={styles.closebutton}>
                                    <Text style={styles.textIcon}>
                                      <AntDesign
                                        name="close"
                                        size={24}
                                        color={'#707070'}
                                      />
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <View>
                                    <View style={{padding: 20}}>
                                      <Text
                                        style={{
                                          textAlign: 'center',
                                          paddingBottom: 20,
                                        }}>
                                        <AntDesign
                                          name="checksquare"
                                          size={36}
                                          color="#4CB050"
                                        />
                                      </Text>

                                      <Text
                                        style={{
                                          color: '#000000',
                                          fontWeight: '500',
                                          textAlign: 'center',
                                        }}>
                                        Your Documents Uploaded
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </Modal>
                        </View>

                        {/* ---------------WITHDRAW POINTS HISTORY--------------- */}
                        <ScrollView horizontal>
                          <TouchableWithoutFeedback>
                            <View>
                              <View
                                style={{
                                  backgroundColor: '#001C0D',

                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  marginTop: 15,
                                }}>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  S. No.
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Pay Mode
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Date
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Points
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Closing Balance
                                </Text>
                                <Text
                                  style={{
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  Status
                                </Text>
                              </View>

                              {isLoading ? (
                                <View
                                  style={{
                                    backgroundColor: '#ECECEC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#cccccc',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#000000',
                                      textAlign: 'left',
                                      width: '100%',
                                      fontWeight: '500',
                                      padding: 15,
                                    }}>
                                    Loading..
                                  </Text>
                                </View>
                              ) : error ? (
                                <View
                                  style={{
                                    backgroundColor: '#ECECEC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#cccccc',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#000000',
                                      textAlign: 'left',
                                      width: '100%',
                                      fontWeight: '500',
                                      padding: 15,
                                    }}>
                                    No Data Available.
                                  </Text>
                                </View>
                              ) : (
                                (Array.isArray(transactions)
                                  ? transactions.filter(
                                      transaction =>
                                        transaction.type === 'Debit',
                                    )
                                  : []
                                ).map((history, index) => (
                                  <View key={history.id || index}>
                                    <View
                                      style={{
                                        backgroundColor: 'white',

                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#cccccc',
                                      }}>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {index + 1}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.purpose}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.transaction_id}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {`${history.created_at.split(' ')[0]} at ${history.created_at.split(' ').splice(1).join(' ')}`}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.amount}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.closing_balance || 0}
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#000000',
                                          textAlign: 'center',
                                          fontWeight: '500',
                                          padding: 15,
                                          minWidth: 145,
                                        }}>
                                        {history.action}
                                      </Text>
                                    </View>
                                  </View>
                                ))
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                        </ScrollView>
                        {/* Pagination Controls */}
                        <View style={styles.pagination}>
                          <Button
                            title="Previous"
                            onPress={prevPage}
                            disabled={isPrevDisabled}
                          />
                          <Text style={styles.pageInfo}>
                            Page {currentPage}
                          </Text>
                          <Button
                            title="Next"
                            onPress={nextPage}
                            disabled={isNextDisabled}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>

          <KycModal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            setModalVisible={setModalVisible}
            mobile={mobile}
            playerData={playerData}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleWhatsApp}
            onRequestClose={() => setModalVisibleWhatsApp(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  height: 350,
                  width: '100%',
                  borderTopEndRadius: 15,
                  borderTopLeftRadius: 15,
                }}>
                <ScrollView>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      paddingBottom: 20,
                      padding: 20,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '32%',
                        marginVertical: 8,
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity>
                        <View style={styles.circleBtn}>
                          <Image
                            source={require('../images/whatsapp.png')}
                            style={styles.iconimage}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            paddingTop: 5,
                          }}>
                          Whatsapp
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '32%',
                        marginVertical: 8,
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity>
                        <View style={styles.circleBtn}>
                          <Image
                            source={require('../images/instagram.png')}
                            style={styles.iconimage}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            paddingTop: 5,
                          }}>
                          Instagram
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '32%',
                        marginVertical: 8,
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity>
                        <View style={styles.circleBtn}>
                          <Image
                            source={require('../images/facebook.png')}
                            style={styles.iconimage}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            paddingTop: 5,
                          }}>
                          Facebook
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: '32%',
                        marginVertical: 8,
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity>
                        <View style={styles.circleBtn}>
                          <Image
                            source={require('../images/chrome.png')}
                            style={styles.iconimage}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            paddingTop: 5,
                          }}>
                          Chrome
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '32%',
                        marginVertical: 8,
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity>
                        <View style={styles.circleBtn}>
                          <Image
                            source={require('../images/opera.png')}
                            style={styles.iconimage}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            paddingTop: 5,
                          }}>
                          Opera
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: '#cccccc',
                    padding: 15,
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisibleWhatsApp(false)}
                    style={styles.button}>
                    <Text style={styles.text}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal style={{flex: 1}} visible={addPaymnetModel}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.8)',
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: COLORS.black,
                    fontWeight: '400',
                    marginTop: 10,
                  }}>
                  {'Welcome to The BGM Game'}
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    marginTop: 10,
                    backgroundColor: 'grey',
                  }}
                />

                <Image
                  style={{height: 100, width: 100, marginTop: 10}}
                  source={require('../images/com-logo.png')}
                />

                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    backgroundColor: COLORS.black,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: COLORS.white,
                      fontWeight: '400',
                      marginVertical: 10,
                      textAlign: 'center',
                    }}>
                    {'नीचे दिए हुए आइकॉन पे क्लिक करे 👇'}
                  </Text>
                </View>

                <View
                  style={{
                    width: '90%',
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 5,
                  }}>
                  <TouchableOpacity
                    onPress={handleDepositUpi}
                    style={{flex: 1, marginEnd: 5}}>
                    <Text style={styles.primaryBtn}>Manual UPI</Text>
                    <View style={styles.bottomBorder} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      onSubmitManualAccount(), setAddPaymnetModel(false);
                    }}
                    style={{flex: 1, marginStart: 5}}>
                    <Text style={styles.primaryBtn}>Manual Account</Text>
                    <View style={styles.bottomBorder} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    backgroundColor: COLORS.black,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: COLORS.white,
                      fontWeight: '400',
                      marginVertical: 10,
                      textAlign: 'center',
                    }}>
                    {'भुगतान करने के बाद बैक बटन दबाये 👇'}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setAddPaymnetModel(false)}
                  style={{marginTop: 10, width: '90%', marginBottom: 20}}>
                  <Text
                    style={[styles.primaryBtn, {backgroundColor: '#d77932'}]}>
                    Back
                  </Text>
                  <View style={styles.bottomBorder} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setAddPaymnetModel(false)}
                  style={{
                    height: 50,
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.app_color,
                    borderRadius: 90,
                    position: 'absolute',
                    top: -25,
                    end: -10,
                  }}>
                  <Image
                    style={{height: 35, width: 35}}
                    resizeMode="cover"
                    source={require('../images/cross_ic.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            style={{flex: 1}}
            visible={addPaymnetManualAccount || addPaymnetMerchantId}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.8)',
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* close btn */}
              <View
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginTop: -45,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setAddPaymnetManualAccount(false);
                    setAddPaymnetMerchantId(false);
                  }}
                  style={styles.closebutton}>
                  <Text style={styles.textIcon}>
                    <AntDesign name="close" size={24} color={'#707070'} />
                  </Text>
                </TouchableOpacity>
              </View>
              {/* close btn */}

              <View
                style={{
                  width: '90%',
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: COLORS.black,
                    fontWeight: '400',
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {'Welcome to The BGM Game'}
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    marginTop: 10,
                    backgroundColor: 'grey',
                  }}
                />

                <View style={{alignSelf: 'center', width: '90%'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#505356',
                      fontWeight: '600',
                      marginTop: 10,
                    }}>
                    {'Account Holder Name'}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      backgroundColor: '#e9ecef',
                      borderRadius: 5,
                      marginTop: 2,
                    }}>
                    <TextInput
                      placeholder="Account Holder Name"
                      style={{
                        marginStart: 10,
                        fontSize: 14,
                        color: '#505356',
                        fontWeight: '600',
                      }}
                      editable={false}
                      value={manualAccountText.accountName}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      color: '#505356',
                      fontWeight: '600',
                      marginTop: 10,
                    }}>
                    {'Account Number'}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      backgroundColor: '#e9ecef',
                      borderRadius: 5,
                      marginTop: 2,
                    }}>
                    <TextInput
                      placeholder="Account Number"
                      style={{
                        marginStart: 10,
                        fontSize: 14,
                        color: '#505356',
                        fontWeight: '600',
                      }}
                      editable={false}
                      value={manualAccountText.tranceId}
                    />
                  </View>

                  {addPaymnetManualAccount && (
                    <>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#505356',
                          fontWeight: '600',
                          marginTop: 10,
                        }}>
                        {'IFSC'}
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          height: 40,
                          backgroundColor: '#e9ecef',
                          borderRadius: 5,
                          marginTop: 2,
                        }}>
                        <TextInput
                          placeholder="IFSC"
                          style={{
                            marginStart: 10,
                            fontSize: 14,
                            color: '#505356',
                            fontWeight: '600',
                          }}
                          editable={false}
                          value={manualAccountText.ifsc}
                        />
                      </View>
                    </>
                  )}

                  <Image
                    style={{
                      height: 300,
                      width: 200,
                      alignSelf: 'center',
                      marginTop: 20,
                    }}
                    resizeMode="contain"
                    source={{
                      uri: `${manualAccountText?.file}`,
                    }}
                    alt="QR Code"
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      color: '#505356',
                      fontWeight: '600',
                      marginTop: 10,
                    }}>
                    {'UTR ID'}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      backgroundColor: '#e9ecef',
                      borderRadius: 5,
                      marginTop: 2,
                    }}>
                    <TextInput
                      placeholder="UTR ID"
                      style={{
                        marginStart: 10,
                        fontSize: 14,
                        color: '#000',
                        fontWeight: '600',
                        borderBottomWidth: 1,
                        borderColor: error ? 'red' : '#ccc',
                        paddingBottom: 5,
                      }}
                      value={manualTrancId}
                      onChangeText={handleInputChange}
                      // onChangeText={(text) => setManualTrancId(text)}
                      keyboardType="numeric" // Restrict keyboard to numbers only
                    />
                    {error ? (
                      <Text
                        style={{
                          color: 'red',
                          marginStart: 10,
                          marginTop: 5,
                          fontSize: 12,
                        }}>
                        {errors}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={() => onDoneManualAccount()}
                    style={{
                      marginTop: 20,
                      width: '100%',
                      marginBottom: 20,
                    }}>
                    <Text style={styles.primaryBtn}>Submit</Text>
                    <View style={styles.bottomBorder} />
                  </TouchableOpacity>
                </View>

                {addPaymnetManualAccount && (
                  <TouchableOpacity
                    onPress={() => {
                      setAddPaymnetManualAccount(false);
                      setAddPaymnetMerchantId(false);
                    }}
                    style={{
                      height: 50,
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.app_color,
                      borderRadius: 90,
                      position: 'absolute',
                      top: -25,
                      end: -10,
                    }}>
                    <Image
                      style={{height: 35, width: 35}}
                      resizeMode="cover"
                      source={require('../images/cross_ic.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>

          {/* <Loader visiblity={isLoading} /> */}

          {isMenuVisible && (
            <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  {backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 0},
                ]}
              />
            </TouchableWithoutFeedback>
          )}
          <Loader visiblity={loader} />
        </View>
      </TouchableWithoutFeedback>

      <NavFooter />
    </>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default WalletAddAmountScreen;
