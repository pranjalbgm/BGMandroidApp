import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import useReferedBonusList from "../hooks/useAddKYC";
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import {fetchMobile} from '../hooks/useWallet';
import {usePlayerData} from '../hooks/useHome';
import useReferedBonusList from '../hooks/useBonusReportList';
import NavFooter from '../components/NavFooter';
import HeaderThree from '../components/HeaderThree';
import useApprovedBonusList from '../hooks/useApprovedBonusList';

type BonusItem = {
  mobile: string;
  commision_amount: string;
  action_by: string;
  referral_level: string;
};

type Props = {
  navigation: any;
};

type DateTimeResult = {
  date: string;
  time: string;
};

export function separateDateAndTime(dateTimeString: string): DateTimeResult {
  if (!dateTimeString) {
    return {date: '', time: ''};
  }
  return dateTimeString.includes('T')
    ? {date: dateTimeString.split('T')[0], time: dateTimeString.split('T')[1]}
    : {date: dateTimeString.split(' ')[0], time: dateTimeString.split(' ')[1]};
}

const BonusReport: React.FC<Props> = ({navigation}) => {
  const [isMenuVisible, setMenuVisibility] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [isApprovedView, setIsApprovedView] = useState<boolean>(false);
  

  const playerData = usePlayerData();
  const { 
    bonusOn: pendingBonusData, 
    isLoading: isPendingLoading 
  } = useReferedBonusList({
    user_mobile: "8441067845", 
    status: "Pending"
  });

  const { 
    bonusOn: approvedBonusData, 
    isLoading: isApprovedLoading 
  } = useApprovedBonusList({
    mobile: mobileNumber
  });

  // Combine loading states and data
  const bonusData = isApprovedView ? approvedBonusData : pendingBonusData;
  const isLoading = isApprovedView ? isApprovedLoading : isPendingLoading;
// console.log("--------------->>>>>>>>><<<<<<<<<<<<<<<<>>>>>>>>>>>>>>",bonusData)
  useEffect(() => {
      fetchMobile(setMobileNumber);
      console.log("this is bonus report ----------------------------true")
    }, []); 
  
    useEffect(() => {
  
      if (mobileNumber) {
        playerData.mutate({ mobileNumber });
      }
    }, [mobileNumber]);

  // const navigation = useNavigation();

  const handleViewDetails = (
    parentMobile: string | null,
    childMobile: string,
  ) => {
    navigation.navigate('BonusChildDetails');
  };

  const handleToggleBonusView = () => {
    // Toggle between Pending and Approved views
    setIsApprovedView(prev => !prev);
  };


  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
      <ScrollView>
        <View style={styles.container}>
          <HeaderThree title={'Bonus Report'} />

          <View style={{padding: 20}}>
            <Text
              style={
                styles.tips 
              }>
             आप अपने REFERAL CODE से जितने भी खिलाड़ी जोड़ोगे, उनकी खेली हुई गेम का आपको 10 परसेंट मिलेगा। और वो जितने लोगों को जोड़ेंगे अपने REFERAL CODE से, उसका भी आपको 2 से 5 परसेंट मिलेगा। यह ऑफर केवल 3 महीनों के लिए मान्य है।
            </Text>
          <View>
            <Text style={styles.chatsupportdiv}>
            ⚠️ Chat SUPPORT💥 के ज़रिए Admin से संपर्क करें और अपना Bonus Commission ON करवाएं, ताकि आप अपना रेफरल BONUS Commission बिना किसी रुकावट के आसानी से प्राप्त कर सकें। जब तक आप इसे ON नहीं करवाएंगे, तब तक आपका BOnus Commission मिलना शुरू नहीं होगा। ⚠️
            </Text>
          </View>


            <View>
              <Text 
                style={styles.approvedBonusBtn} 
                onPress={handleToggleBonusView}
              >
              {!isApprovedView 
                  ? 'Click Here to check Approved Bonus →' 
                  : 'Click Here to check Pending Bonus →'}
              </Text>
            </View>
          </View>
          <View>
            <ScrollView horizontal>
              <View>
                <View
                  style={{
                    backgroundColor: 'darkgreen',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      // paddingHorizontal: 60,
                      minWidth: 15,
                    }}>
                    Index
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Name
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Mobile
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Commission
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Child Commission
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Game Played by Refer User (Level 1)
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Win amount (Level 1)
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Profit (Level 1)
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    TTL Comm (Level 1)
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Game Played by Refer User (Level 2)
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Win amount (Level 2)
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Profit (Level 2)
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    TTL Comm (Level 2)
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 45,
                    }}>
                    Total Comm
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 25,
                    }}>
                    View
                  </Text>
                </View>

                {bonusData?.length !== 0 ? (
                  bonusData?.map((bonus: any, index: number) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#ECECEC',

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
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 15,
                        }}>
                        {index + 1}
                      </Text>
                      {/* <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {`${separateDateAndTime(history.createdAt).date
                          } ${ConvertTime(
                            separateDateAndTime(history.createdAt).time
                          )}`}
                      </Text> */}
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 45,
                        }}>
                        {bonus.name}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 45,
                        }}>
                        {bonus.mobile}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 45,
                        }}>
                        {bonus.commission_count}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 45,
                        }}>
                        {bonus.child_commission_count}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 315,
                        }}>
                        {bonus.bet_amount}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.refer_1_win_amount}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.profit_by_player}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.refer_level_1_amount}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 345,
                        }}>
                        {bonus.bet_amount_2}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.refer_2_win_amount}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.profit_by_player_2}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.refer_level_2_amount}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.total_commission}
                      </Text>
                      <TouchableOpacity
                        // style={styles.button}
                        onPress={() =>
                          handleViewDetails(mobileNumber, bonus.mobile)
                        }>
                        <Text
                          style={{
                            
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 10,
                            minWidth: 45,
                            color: 'white',
                            backgroundColor:"green",
                            borderRadius:10,
                           
                          }}>
                          View
                        </Text>
                      </TouchableOpacity>
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
                        color: '#000000',
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
                        color: '#000000',
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
          {/* <NavFooter/> */}

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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingContainer: {
    padding: 10,
    backgroundColor: '#0c3716',
    alignItems: 'center',
  },
  heading: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  marqueeContainer: {
    marginTop: 10,
    backgroundColor: '#0c3716',
    padding: 12,
  },
  marqueeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
    padding: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  approvedBonusBtn:{
    backgroundColor:"green",
    color:"white",
    padding:10,
    borderRadius:10
  },
  chatsupportdiv:{
    backgroundColor:"rgb(248, 215, 218)",
    color:"rgb(114, 28, 36)",
    padding:10,
    borderRadius:10,
    marginBottom:10
  },
  tips:{
    backgroundColor:"rgb(248, 249, 250)",
    color: '#000000',
                paddingBottom: 15,
                fontWeight: '500',
                lineHeight: 24,
  }
});

export default BonusReport;
