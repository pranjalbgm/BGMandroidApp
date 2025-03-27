import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appStyles from '../styles/appStyles';
import InsufficientBalance from '../components/InsufficientBalance.modal';
import useWallet from '../hooks/useWallet';
import usePlaceBet from '../hooks/usePlaceBet';
import useManualGame from '../hooks/useManualGame';
import {showAlert} from '../components/Alert';
import LoaderWhite from '../components/LoaderWhite';
import Toast from 'react-native-simple-toast';

const ManualGame = ({navTabHomeName, market, apiData, screenType}: any) => {
  const navigation = useNavigation();
  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [showNoBalance, setShowNoBalance] = useState(!sufficientBalance);
  const [betText, setBetText] = useState('');
  const [loader, setLoader] = useState(false);

  const {wallet} = useWallet();
  const placeBet = usePlaceBet();

  const {
    handleNumberChange,
    handleKeyDown,
    handlePointsChange,
    calculateTotalPoints,
    calculateTotalPointsAdded,
    setPoints,
    manualInputs,
    inputRefs,
  } = useManualGame();

  const manualBets = () =>
    manualInputs.map(manualInput => ({
      betKey: manualInput.betKey,
      points: manualInput.points,
      betType: 'Jodi',
      jodiType: 'Jodi',
      market: market?.market,
    }));

  useEffect(() => {
    setSufficientBalance(wallet?.total_amount >= calculateTotalPointsAdded());
  }, [wallet, calculateTotalPointsAdded()]);

  const manualFields = Array.from({length: 10}, (_, index) => index);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      screenType('Manual');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Recalculate totals dynamically whenever manualInputs changes
    manualFields.forEach(field => {
      calculateTotalPoints(field);
    });
  }, [manualInputs]);

  useEffect(() => {
    // console.log("isPending :- ", placeBet)
    if (placeBet.isPending) {
      setLoader(true);
    } else if (placeBet.isSuccess) {
      setLoader(false);
      Toast.show('Point Placed Successfully.', Toast.LONG);

      navigation.navigate('AllGameScreen');
    } else if (placeBet.isError) {
      setLoader(false);
      showAlert(
        'Failed!',
        `Could not place bet..  ${placeBet.error?.response?.data?.error || ''}`,
      );
    }
  }, [placeBet.isSuccess, placeBet.isError, placeBet.isPending]);

  useEffect(() => {
    apiData(manualBets());
  }, [manualInputs]);

  const onDone = () => {
    if (betText) {
      if (sufficientBalance) {
        placeBet.mutate(manualBets().filter(bets => bets.betKey));
      } else {
        setShowNoBalance(!showNoBalance);
      }
    } else {
      Toast.show('Please place a bet.', Toast.LONG);
    }
  };

  const countDigits = (num: any): number => {
    if (typeof num !== 'number' || isNaN(num)) {
      return 0;
    }
    return num.toString().replace('-', '').length;
  };
  
  const digitCountInMaximum =
    market && market.maximum ? countDigits(market.maximum) : 0;

  return (
    <View style={{display: navTabHomeName == 'Tab2' ? 'flex' : 'none'}}>
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.innerContent}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingHorizontal: 20,
            }}>
            <View>
              <Text
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                Points Remaining:
              </Text>
              <Text
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                {wallet?.total_amount}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                Points Added:
              </Text>
              <Text
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                {calculateTotalPointsAdded()}
              </Text>
            </View>
          </View>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
            <View>
              <View style={{marginHorizontal: 20}}>
                <View style={styles.headerRow}>
                  <View style={{width: '60%'}}>
                    <Text style={styles.headerCell}>Jodi</Text>

                    {manualFields.map(currentManualField => (
                      <View
                        key={currentManualField}
                        style={{
                          flexDirection: 'row',
                          display: 'flex',
                          justifyContent: 'space-between',
                          // borderWidth:1,
                          // padding: 5,
                        }}>
                        {[1, 2, 3, 4, 5].map(numberIndex => (
                          <View style={styles.innerCell}>
                            <TextInput
                              style={styles.inputmanual}
                              maxLength={2}
                              keyboardType="numeric"
                              onChangeText={text => {
                                // Check if the input contains any non-numeric characters
                                const numericValue = text.replace(
                                  /[^0-9]/g,
                                  '',
                                ); // Remove non-numeric characters
                                if (numericValue === text) {
                                  // Proceed if the value is numeric
                                  handleNumberChange(
                                    currentManualField,
                                    numberIndex,
                                    numericValue,
                                   
                                  );
                                  setBetText(numericValue);
                                } else {
                                  // Show error message if input contains non-numeric characters
                                  Toast.show(
                                    'Please enter only numbers.',
                                    Toast.LONG,
                                  );
                                }
                              }}
                            />
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>

                  <View style={{}}>
                    <Text style={styles.headerCell}>
                      <Text style={{color: '#DE7A2D'}}>Point</Text>
                    </Text>

                    {manualFields.map(currentManualField => (
                      <TextInput
                        onChangeText={text =>
                          handlePointsChange(currentManualField, text)
                        }
                        key={currentManualField}
                        id={currentManualField + 'points'}
                        style={styles.innerCell}
                        maxLength={
                          digitCountInMaximum > 0 ? digitCountInMaximum : 4
                        }
                      />
                    ))}
                  </View>

                  <View style={{}}>
                    <Text style={styles.headerCell}>
                      <Text style={{color: '#DE7A2D'}}>Total</Text>
                    </Text>

                    {manualFields.map(currentManualField => (
                      <Text
                        key={currentManualField}
                        id={currentManualField + 'total'}
                        style={{...styles.innerCell}}>
                        {calculateTotalPoints(currentManualField)}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                  paddingHorizontal: 20,
                  marginBottom: 70,
                }}>
                <View>
                  <Text
                    style={{
                      color: '#000000',
                      textAlign: 'left',
                      fontWeight: '500',
                    }}>
                    Total Points:
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: '#000000',
                      textAlign: 'right',
                      fontWeight: '500',
                    }}>
                    {calculateTotalPointsAdded()}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modal */}

      <LoaderWhite visiblity={loader} />

      <InsufficientBalance
        showModal={showNoBalance}
        setShowModal={setShowNoBalance}
      />

      {/* Modal End */}

      {/* <View style={{ ...styles.footerFix, marginTop: 30 }}>
        <TouchableOpacity

          style={styles.Btn}
          onPress={() => onDone()}>
          <Text style={styles.primaryBtn}>Play</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default ManualGame;
