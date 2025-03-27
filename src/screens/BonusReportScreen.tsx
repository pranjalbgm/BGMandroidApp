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

  const playerData = usePlayerData();
  const {bonusOn, isLoading} = useReferedBonusList({
    parent_mobile: mobileNumber,
  });
  // console.warn("======>",bonusOn)

  // useEffect(() => {
  //     fetchMobile(setMobileNumber).then(mobile => playerData.mutate({mobile}));
  // }, [mobileNumber]);
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
    navigation.navigate('BonusChildDetails', {parentMobile, childMobile});
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
      <ScrollView>
        <View style={styles.container}>
          <HeaderThree title={'Bonus Report'} />

          <View style={{padding: 20}}>
            <Text
              style={{color: '#000000', paddingBottom: 15, fontWeight: 400}}>
              Total Commission:
              <Text> {totalCommission} </Text>
            </Text>
            <Text
              style={{color: '#000000', paddingBottom: 15, fontWeight: 400}}>
              Remaining Commission:
              <Text>{bonusReport && bonusReport[0]?.closing_balance} </Text>
            </Text>
            <Text
              style={{
                color: '#000000',
                paddingBottom: 15,
                fontWeight: '500',
                lineHeight: 24,
              }}>
              Enter Redeeem Amount (Min - 50 And
              <Text>{'\n'}</Text>
              Max- 2000 Can Withdraw)
            </Text>
            <View
              style={{
                marginBottom: 15,
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  backgroundColor: '#ECECEC',
                  paddingHorizontal: 15,
                  width: '70%',
                }}>
                <TextInput
                  onChangeText={setTextInput1}
                  value={textInput1}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={onSubmit} style={styles.Btn}>
                  <Text style={styles.secondaryBtn}>Submit</Text>
                  <View style={styles.bottomBorder} />
                </TouchableOpacity>
              </View>
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
                      paddingHorizontal: 60,
                    }}>
                    Date
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                    }}>
                    Bet Amount
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                    }}>
                    Commission Recieved
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                    }}>
                    Commission Redeemed
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                    }}>
                    Redeem Status
                  </Text>
                </View>

                {bonusReport?.length !== 0 ? (
                  bonusReport?.map((bonus: any, index: number) => (
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
                          minWidth: 145,
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
                          minWidth: 145,
                        }}>
                        {bonus.mobile}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.commision_amount}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.action_by}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {bonus.referral_level}
                      </Text>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                          handleViewDetails(mobileNumber, bonus.mobile)
                        }>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 145,
                          }}>
                          View Details
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

type BonusTableRowProps = {
  item: BonusItem;
  parentMobile: string | null;
};

const BonusTableRow: React.FC<BonusTableRowProps> = ({item, parentMobile}) => {
  const navigation = useNavigation();

  const handleViewDetails = (
    parentMobile: string | null,
    childMobile: string,
  ) => {
    navigation.navigate('BonusChildDetails', {parentMobile, childMobile});
  };

  return (
    <View style={styles.rowContainer}>
      <Text style={styles.cell}>{item.mobile}</Text>
      <Text style={styles.cell}>{item.commision_amount}</Text>
      <Text style={styles.cell}>{item.action_by}</Text>
      <Text style={styles.cell}>{item.referral_level}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleViewDetails(parentMobile, item.mobile)}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
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
});

export default BonusReport;
