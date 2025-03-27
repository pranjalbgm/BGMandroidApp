import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {usePlayerData} from '../hooks/useHome';
import {fetchMobile} from '../hooks/useWallet';
import useSpinWin from '../hooks/useSpinWin';
import useSpinUser from '../hooks/useSpinUser';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SpinnerWheel from '../WheelComponent/Wheel';
import appStyles from '../styles/appStyles';
import useTransactionHistory from '../hooks/useDepositHistory';
import Toast from 'react-native-simple-toast';

const SpinAndEarn = ({
  closeModalSpin,
  visible,
  setModalVisibleSpin,
}: {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [mobile, setMobile] = useState('');
  const playerInfo = usePlayerData();
  const winSpin = useSpinWin();
  // const { spinUser } = useSpinUser();
  // const {data: spinUser, isLoading, error, refetch,} = useTransactionHistory();
  const {
    transactions: spinUser,
    error,
    isLoading,
    nextPage,
    prevPage,
    isNextDisabled,
    isPrevDisabled,
    currentPage,
  } = useTransactionHistory({
    initialPage: 1,
    pageSize: 10,
  });
  // const [modalVisibleSpin, setModalVisibleSpin] = useState(false);
  const [spinData, setspinData] = useState(false);
  const [spinWinner, setSpinWinner] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  useEffect(() => {
   
      fetchMobile(setMobile).then(mobile => playerInfo?.mutate({mobile}));
 
console.log("this is spin and earn ----------------------------true")
    if (playerInfo?.isSuccess) {
      const textMessage =
        'Play BGM game and earn Rs10000 daily.' +
        '\nLife Time Earning \n24x7 Live Chat Support \nWithdrawal Via UPI/Bank \n👇👇 ' +
        '\nRegister Now, on \nwww.thebgmgame.com ' +
        '\nMy refer code is ' +
        (playerInfo?.data?.refer_code || 'N/A') +
        '.';

      setspinData(playerInfo?.data?.spin_remaining || 0);

      // Handle null or undefined values for `spin_used`
      const sampleNumber = playerInfo?.data?.spin_used || 0;
      if (sampleNumber != 0 || sampleNumber != 'null') {
        const lastDigit = Number.isInteger(sampleNumber)
          ? sampleNumber % 10
          : sampleNumber?.toString()?.slice(-1) || 0;

        console.log('The last digit of spin_remaining:', lastDigit);

        setSpinWinner(lastDigit);
      } else {
        // setSpinWinner();
        console.log('The last digit of spin_remaining:');
        // const lastdigit = 0
        // setSpinWinner(lastdigit)
      }
    }
  }, [mobile]);

  // const closeModalSpin = () => {
  //   setModalVisibleSpin(false);
  //   console.log("yes this is clicked")
  // };
  const onClose = () => {
    console.warn('Action canceled!');
    setModalVisibleSpin(false);
    // Toast.show(`Please complete the current tab before proceeding`, Toast.LONG);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
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
              borderRadius: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                marginTop: -25,
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Close button pressed');
                  onClose();
                }}
                style={styles.closebutton}>
                <Text style={styles.textIcon}>
                  <AntDesign name="close" size={24} color={'#707070'} />
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <SpinnerWheel spinleft={spinData} mobileNumber={mobile} />
            </View>

            <ScrollView style={{width: '100%', height: '25%', marginTop: 20}}>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    //display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: '100%',
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
                  {/* <Text
               style={{
                 color: '#000',
                 textAlign: 'left',
                 fontWeight: '500',
                 padding: 15,
                 paddingHorizontal: 20
               }}>
               Mobile
             </Text> */}
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
                  <Text
                    style={{
                      color: '#000',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      paddingHorizontal: 20,
                    }}>
                    Action
                  </Text>
                </View>

                {/* {console.log(spinUser)} */}
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
                        color: '#000',
                        textAlign: 'center',
                        fontWeight: '500',
                        padding: 15,
                      }}>
                      {/* <Loader visiblity={loader} /> */}
                      Loading......
                    </Text>
                  </View>
                ) : spinUser && spinUser?.length > 0 ? (
                  spinUser
                    ?.filter(
                      (transaction: Transaction) =>
                        transaction?.remark === 'Spin Play',
                    )
                    ?.map((User: any, index: number) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#0000',
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
                        {/* <Text
                     style={{
                       color: '#fff',
                       textAlign: 'center',
                       fontWeight: '500',
                       padding: 15,
                       minWidth: 80,
                     }}>
                     {User.mobile}
                   </Text> */}
                        <Text
                          style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 80,
                          }}>
                          {User.total_amount}
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
                        <Text
                          style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 80,
                          }}>
                          {User.action}
                        </Text>
                      </View>
                    ))
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
    </>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0cf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prize: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

export default SpinAndEarn;
