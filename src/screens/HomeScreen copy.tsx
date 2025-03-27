import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  Modal,
  Linking,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import NavFooter from '../components/NavFooter';
import WelcomeModal from '../components/WelcomeModal';
import TextTicker from 'react-native-text-ticker';
import appStyles from '../styles/appStyles';
import {getData, removeData} from '../constants/storage';
import {getTodayDate, isTimeNotPassed} from '../utils/time';
import useMarkets from '../hooks/useMarkets';
import useHome from '../hooks/useHome';
import useLatestResult from '../hooks/useLatestResult';
import {showAlert} from '../components/Alert';
import {openURL} from '../utils/general';
import ConvertTime from '../hooks/useConvertTime';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import {WebView} from 'react-native-webview';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import ReferAndEarn from '../components/ReferAndEarn';
import {usePlayerData} from '../hooks/useHome';
import useWallet, {fetchMobile} from '../hooks/useWallet';
import Clipboard from '@react-native-clipboard/clipboard';
import SpinAndEarn from '../components/SpinAndEarnModel';
import SpinWheelSecond from '../../SpinWheelSecond';
import useSpinUser from '../hooks/useSpinUser';

const HomeScreen = ({navigation}: any) => {
  // Refer And Earn Start

  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const playerInfo = usePlayerData();
  const {wallet} = useWallet();

  useEffect(() => {
    if (playerInfo.isSuccess) {
      const textMessage =
        'Play BGM game and earn Rs10000 daily.' +
        '\nLife Time Earning \n24x7 Live Chat Support \nWithdrawal Via UPI/Bank \n👇👇 ' +
        '\nRegister Now, on \nwww.thebgmgame.com ' +
        '\nMy refer code is ' +
        playerInfo.data.refer_code +
        '.';

      setMessage(textMessage);
    }
    console.log("this is homeScreeen ----------------------------true")
  }, [playerInfo]);

  const shareViaWhatsapp = async () => {
    const options = {
      title: 'Share via WhatsApp',
      message: message,
      url: 'https://api.whatsapp.com/send?text=' + encodeURIComponent(message),
    };

    try {
      await Share.open(options);
    } catch (error) {
      console.error(error);
    }
  };

  const shareViaSms = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    Linking.openURL(smsUrl);
  };

  const copyToRefferalClipboard = async text => {
    try {
      await Clipboard.setString(text);
      setCopySuccess('Copied!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopySuccess('Failed to copy!');
    }
  };

  useEffect(() => {
         fetchMobile(setMobile);
       }, []); 
     
       useEffect(() => {
     
         if (mobile) {
           playerInfo.mutate({ mobile });
         }
         console.log("this is homeScreeen ----------------------------true")
       }, [mobile]);
   
const [zeroSpin, setZeroSpin] = useState(false);

  useEffect(() => {
    if (playerInfo?.data?.spin_remaining === 0 && !zeroSpin) {
      setZeroSpin(true); // Only set the state if it's not already true
    }
    console.log("this is homeScreeen ----------------------------true")
  }, [playerInfo?.data?.spin_remaining, zeroSpin]);

  // Refer And Earn end

  // Spin And Earn start
  const {spinUser, isLoading, refetch} = useSpinUser({refetch});

  // useEffect(() => {
  //       fetchMobile(setMobile).then(mobile => playerInfo.mutate({mobile}));
  //       console.log("this is homeScreeen ----------------------------true")
  //   }, [mobile]);

  // Spin And Earn end

  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [modalVisibleWel, setModalVisibleWel] = useState(false);
  const [modalVisibleRefer, setModalVisibleRefer] = useState(false);
  const [modalVisibleSpin, setModalVisibleSpin] = useState(false);
  const [modalVisibleWhatsApp, setModalVisibleWhatsApp] = useState(false);
  const {width} = useWindowDimensions();
  // const navigation = useNavigation();

  const {markets} = useMarkets();
  const {home} = useHome();
  const {latestResult} = useLatestResult();

  useEffect(() => {
    let user;
    (async function getUserData() {
      user = await getData('user');
      // console.log("From Home Screen", user)
      user === null && navigation.navigate('LoginScreen');
    })();
  }, []);

  //---------- Modal ----------//

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setModalVisibleWel(true); // Set visible to true after 20 seconds
  //   }, 5000); // 20 seconds in milliseconds

  //   return () => clearTimeout(timer); // Clear the timer if the component unmounts
  // }, []); // Run this effect only once when the component mounts

  const closeModal = () => {
    setModalVisibleWel(false); // Close the modal
  };

  const closeModalRefer = () => {
    setModalVisibleRefer(false); // Close the modal
  };

  const closeModalSpin = () => {
    setModalVisibleSpin(false); // Close the modal
  };

  //---------- End ----------//

  const greeting_banner = {html: home?.greeting_banner || '<p></p>'};
  const note = {html: home?.note || '<p></p>'};

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        {/* HEADER */}
        <Header
          page={'Home'}
          setMenuVisibility={setMenuVisibility}
          isMenuVisible={isMenuVisible}
        />

        <View style={{flex: 1, flexDirection: 'row'}}>
          {/* NAVBAR */}
          <Navbar
            navigation={navigation}
            isMenuVisible={isMenuVisible}
            modalVisibleWhatsApp={modalVisibleWhatsApp}
            setModalVisibleWhatsApp={setModalVisibleWhatsApp}
            modalVisibleRefer={modalVisibleRefer}
            setModalVisibleRefer={setModalVisibleRefer}
            modalVisibleSpin={modalVisibleSpin}
            setModalVisibleSpin={setModalVisibleSpin}
          />

          {/* HOME SCREEN */}
          <ScrollView style={styles.scrollView}>
            <View>
              <View
                style={{
                  backgroundColor: '#000000',
                  padding: 20,
                  flexDirection: 'column',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextTicker
                    style={{
                      color: '#ffffff',
                      alignSelf: 'center',
                      fontWeight: '500',
                    }}
                    duration={8000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={2500}>
                    {home?.ticker}
                  </TextTicker>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    display: 'flex',
                    justifyContent: 'space-around',
                    paddingTop: 10,
                  }}>
                  <Text style={{color: '#ffffff', alignSelf: 'flex-start'}}>
                    Win Amount :{wallet?.winning}
                  </Text>
                  <Text style={{color: '#ffffff'}}>
                    Total Amount :{wallet?.total_amount}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: '#E1EFE6',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{width: '36%'}}>
                  <View style={{marginBottom: 15}}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ChatScreen')}>
                      <Text style={styles.callBtn}>Deposit</Text>
                      <View style={styles.callBtnIcon}>
                        <Text>
                          <Ionicons
                            name="logo-whatsapp"
                            size={22}
                            color="green"
                          />
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginBottom: 0}}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('WithdrawChat')}>
                      <Text style={styles.callBtn}>Withdraw</Text>
                      <View style={styles.callBtnIcon}>
                        <Text>
                          <Ionicons
                            name="logo-whatsapp"
                            size={22}
                            color="green"
                          />
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    width: '28%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../images/comlogo.png')}
                    style={styles.logoimage}
                  />
                </View>
                <View style={{width: '36%'}}>
                  <View style={{marginBottom: 15}}>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={() => navigation.navigate('AllGameScreen')}>
                      <Text style={styles.primaryBtn}>Other Game</Text>
                      <View style={styles.bottomBorder} />
                    </TouchableOpacity>
                  </View>
                  {/* <View style={{ marginBottom: 0 }}>
                    <TouchableOpacity style={styles.Btn}>
                      <Text style={styles.secondaryBtn}>Clear Data</Text>
                      <View style={styles.bottomBorder} />
                    </TouchableOpacity>
                  </View> */}
                </View>
              </View>

              <RenderHtml
                contentWidth={width}
                source={greeting_banner}
                tagsStyles={{
                  h6: {
                    fontSize: 16,
                    margin: 0,
                    paddingVertical: 6,
                    textAlign: 'center',
                    fontWeight: '300',
                    color: 'black',
                  },
                }}
              />

              <View
                style={{
                  backgroundColor: '#ECECEC',
                  padding: 15,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000000',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  {latestResult?.market_name}
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  Result
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  {latestResult?.bet_key}
                </Text>
              </View>

              <View style={{backgroundColor: '#E1EFE6', padding: 20}}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Image
                    source={require('../images/fire.png')}
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#000000',
                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    सबसे पहले रिजल्ट देखने के लिए क्लिक करें
                  </Text>
                  <Image
                    source={require('../images/fire.png')}
                    style={{marginLeft: 5}}
                  />
                </View>

                {/* OPENING EXTERNAL LINKS */}
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={styles.Btn}
                    // onPress={() => navigation.navigate('ResultHistoryScreen')}>
                    onPress={() =>
                      Linking.openURL('https://www.babajiisatta.com/').catch(
                        err => console.error("Couldn't load page", err),
                      )
                    }>
                    <Text style={styles.primaryBtn}>Click Link</Text>
                    <View style={styles.bottomBorder} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{backgroundColor: '#000000', padding: 20}}>
                <RenderHtml
                  contentWidth={width}
                  source={note}
                  tagsStyles={{
                    p: {
                      fontSize: 16,
                      margin: 0,
                      paddingVertical: 1,
                      textAlign: 'center',
                      fontWeight: '300',
                      color: 'white',
                    },
                  }}
                />
              </View>

              <View style={{marginTop: 20}}>
                <View style={{backgroundColor: '#ECECEC', padding: 20}}>
                  <Text
                    style={{
                      color: '#000000',
                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    BGM Game Live Result Of {getTodayDate()}
                  </Text>
                </View>

                <ScrollView>
                  <View>
                    {markets?.map(
                      (market: any) =>
                        market.status && (
                          <View key={market.id}>
                            {isTimeNotPassed(market.close_time) &&
                            !isTimeNotPassed(market.open_time) ? (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('MoringStarScreen', {
                                    market,
                                  })
                                }>
                                <View style={styles.gametable}>
                                  <View
                                    style={{
                                      backgroundColor: '#77c37a',
                                      padding: 10,
                                      marginBottom: 10,
                                    }}>
                                    <Text
                                      style={{
                                        color: '#ffffff',

                                        fontWeight: '500',
                                        textTransform: 'uppercase',
                                      }}>
                                      {market.market}
                                    </Text>

                                    <View
                                      style={{
                                        paddingTop: 10,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                      }}>
                                      <View>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          Open Time
                                        </Text>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          {ConvertTime(market.open_time)}
                                        </Text>
                                      </View>

                                      <View>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          Close Time
                                        </Text>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          {ConvertTime(market.close_time)}
                                        </Text>
                                      </View>

                                      <View>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          Result Time
                                        </Text>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          {ConvertTime(market.result_time)}
                                        </Text>
                                      </View>

                                      <View>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          Previous Time
                                        </Text>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          {market.previous_result?.bet_key
                                            .toString()
                                            .padStart(2, '0') || 'xx'}
                                        </Text>
                                      </View>

                                      <View>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          Today Result
                                        </Text>
                                        <Text
                                          style={{
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 12,
                                          }}>
                                          {market.latest_result?.bet_key
                                            .toString()
                                            .padStart(2, '0') || 'xx'}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ) : (
                              <View style={styles.gametable}>
                                <View
                                  style={{
                                    backgroundColor: '#77c37a',
                                    padding: 10,
                                    marginBottom: 10,
                                  }}>
                                  <Text
                                    style={{
                                      color: '#ffffff',

                                      fontWeight: '500',
                                      textTransform: 'uppercase',
                                    }}>
                                    {market.market}
                                  </Text>

                                  <View
                                    style={{
                                      paddingTop: 10,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      flexDirection: 'row',
                                    }}>
                                    <View>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        Open Time
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        {ConvertTime(market.open_time)}
                                      </Text>
                                    </View>

                                    <View>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        Close Time
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        {ConvertTime(market.close_time)}
                                      </Text>
                                    </View>

                                    <View>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        Result Time
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        {ConvertTime(market.result_time)}
                                      </Text>
                                    </View>

                                    <View>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        Previous Time
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        {market.previous_result?.bet_key
                                          .toString()
                                          .padStart(2, '0') || 'xx'}
                                      </Text>
                                    </View>

                                    <View>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        Today Result
                                      </Text>
                                      <Text
                                        style={{
                                          color: '#ffffff',
                                          textAlign: 'center',
                                          fontSize: 12,
                                        }}>
                                        {market.latest_result?.bet_key
                                          .toString()
                                          .padStart(2, '0') || 'xx'}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            )}
                          </View>
                        ),
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>

            <WelcomeModal visible={modalVisibleWel} onClose={closeModal} />
            <ReferAndEarn
              visible={modalVisibleRefer}
              onClose={closeModalRefer}
            />
            <SpinAndEarn visible={modalVisibleSpin} onClose={closeModalSpin} />
          </ScrollView>
        </View>
        <NavFooter />

        {/* NAVBAR SOCIALS MODAL */}
        {/* Model Refer And Eran */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleRefer}
          onRequestClose={() => setModalVisibleRefer(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: '#000000',
                minHeight: 450,
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
                  onPress={closeModalRefer}
                  style={styles.closebutton}>
                  <Text style={styles.textIcon}>
                    <AntDesign name="close" size={24} color={'#707070'} />
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
                        color: '#ffffff',
                        fontWeight: '500',
                        textAlign: 'center',
                        lineHeight: 25,
                      }}>
                      Welcome to The BGM Game
                    </Text>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#ffffff',
                          fontWeight: '500',
                          textAlign: 'center',
                          lineHeight: 25,
                        }}>
                        Share Application :{' '}
                      </Text>

                      <Text
                        style={{
                          color: 'green',
                          fontWeight: '500',
                          textAlign: 'center',
                          lineHeight: 25,
                        }}>
                        www.thebgmgame.com
                      </Text>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#ffffff',
                          fontWeight: '500',
                          textAlign: 'center',
                          lineHeight: 25,
                        }}>
                        My Referal Code :{' '}
                      </Text>

                      <Text
                        style={{
                          color: 'green',
                          fontWeight: '500',
                          textAlign: 'center',
                          lineHeight: 25,
                        }}>
                        {playerInfo?.data?.refer_code ||
                          'Generating referal code..'}
                      </Text>
                    </View>
                    <View style={{width: '100%', paddingVertical: 15}}>
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            copyToRefferalClipboard(
                              playerInfo?.data?.refer_code,
                            )
                          }
                          style={styles.button}>
                          <Text style={styles.text}>
                            🔥COPY REFERRAL CODE🔥
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#ffffff',
                            textAlign: 'center',
                            fontWeight: '500',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={require('../images/comlogo.png')}
                          style={styles.logoimage}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontSize: 15,
                          color: '#ffffff',
                          fontWeight: '500',
                        }}>
                        एप्लीकेशन को शेयर करें 👇
                      </Text>
                    </View>
                    <View style={{padding: 12}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <TouchableOpacity
                            onPress={shareViaWhatsapp}
                            style={{
                              marginTop: 12,
                              backgroundColor: '#007bff',
                              padding: 10,
                              borderRadius: 5,
                            }}>
                            <Text style={{color: 'white'}}>Share Whatsapp</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{flex: 1, alignItems: 'center'}}>
                          <TouchableOpacity
                            onPress={shareViaSms}
                            style={{
                              marginTop: 12,
                              backgroundColor: '#007bff',
                              padding: 10,
                              borderRadius: 5,
                            }}>
                            <Text style={{color: 'white'}}>Share SMS</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontSize: 15,
                          color: '#ffffff',
                          fontWeight: '500',
                        }}>
                        👆 एप्लीकेशन शेयर करने पर आपको हर यूजर का 1 फ्री स्पिन
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontSize: 15,
                          color: '#ffffff',
                          fontWeight: '500',
                        }}>
                        मिलेगा,जिससे आप इनाम जीत सकते हैं| 👆
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* Model Spin And Win */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleSpin}
          onRequestClose={() => setModalVisibleSpin(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: '#000000',
                minHeight: 700,
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
                  onPress={closeModalSpin}
                  style={styles.closebutton}>
                  <Text style={styles.textIcon}>
                    <AntDesign name="close" size={24} color={'#707070'} />
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text style={styles.textSpin}>
                  SPIN LEFT 👉
                  {playerInfo?.data?.spin_remaining ||
                    (!zeroSpin ? 'Calculating spins left..' : 0)}
                </Text>
              </View>
              <SpinWheelSecond />

              <ScrollView horizontal>
                <View>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: '#000',
                        textAlign: 'left',
                        fontWeight: '500',
                        padding: 15,
                        paddingHorizontal: 20,
                      }}>
                      S.No.
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        textAlign: 'left',
                        fontWeight: '500',
                        padding: 15,
                        paddingHorizontal: 20,
                      }}>
                      Mobile
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        textAlign: 'left',
                        fontWeight: '500',
                        padding: 15,
                        paddingHorizontal: 20,
                      }}>
                      Points
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        textAlign: 'left',
                        fontWeight: '500',
                        padding: 15,
                        paddingHorizontal: 20,
                      }}>
                      Date
                    </Text>
                  </View>
                  {/* {console.log(spinUser)} */}
                  {spinUser?.length !== 0 ? (
                    spinUser?.map((User: any, index: number) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#000',

                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                          borderBottomWidth: 1,
                          borderBottomColor: '#cccccc',
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: '500',
                            textAlign: 'center',
                            padding: 15,
                            minWidth: 80,
                          }}>
                          {index + 1}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 80,
                          }}>
                          {User.mobile}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 80,
                          }}>
                          {User.points}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 80,
                          }}>
                          {User.created_at}
                        </Text>
                      </View>
                    ))
                  ) : isLoading ? (
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
                          color: '#000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                        }}>
                        Loading...
                      </Text>
                    </View>
                  ) : (
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
                          color: '#000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                        }}>
                        No Data Available.
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Model Welcome  */}

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
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  ...appStyles,

  circleBtn: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 100,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    padding: 15,
  },
  iconimage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 0,
  },
  text: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },

  textSpin: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  closebutton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 100,
    elevation: 5,
  },
  textIcon: {
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoimage: {
    // textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green', // Example primary color
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  text: {
    color: 'white', // Example text color
    fontSize: 12,
    textAlign: 'center',
  },
});
export default HomeScreen;
