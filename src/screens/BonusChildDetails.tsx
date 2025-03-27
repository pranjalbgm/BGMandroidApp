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
import useReferredBonusList from '../hooks/useReferredBonusList';

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

const BonusChildDetails: React.FC<Props> = ({route}) => {
  const {parentMobile, childMobile} = route.params;

  const [isMenuVisible, setMenuVisibility] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  const playerData = usePlayerData();
  // const { bonusOn, isLoading } = useReferedBonusList({  parent_mobile: parentMobile, child_mobile: childMobile,  });
  const {
    data: bonusOn,
    isLoading,
    error,
  } = useReferredBonusList(parentMobile, childMobile);
  console.warn('======> bonus on', bonusOn);

  // useEffect(() => {
  //     fetchMobile(setMobileNumber).then(mobile => playerData.mutate({mobile}));
  // }, [mobileNumber]);
  useEffect(() => {
    fetchMobile(setMobileNumber);
  }, []); 

  useEffect(() => {

    if (mobileNumber) {
      playerData.mutate({ mobileNumber });
    }
  }, [mobileNumber]);

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
      <ScrollView>
        <View style={styles.container}>
          <HeaderThree title={'Bonus Report'} />

          <View style={styles.contentContainer}>
            <ScrollView horizontal>
              <View>
                <View
                  style={{
                    backgroundColor: '#013220',
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
                    }}>
                    S.No.
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                    }}>
                    Mobile
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                    }}>
                    commision_amount
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                    }}>
                    Action by
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                      padding: 15,
                    }}>
                    referral_level
                  </Text>
                </View>
                {Array.isArray(bonusOn) && bonusOn.length > 0 ? (
                  // {myPlayHistory?.length !== 0 ? (
                  bonusOn?.map((bonus: any, index: number) => (
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
});

export default BonusChildDetails;
