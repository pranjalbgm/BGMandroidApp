import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appStyles from '../styles/appStyles';
import InsufficientBalance from '../components/InsufficientBalance.modal';
import useHarrafGame from '../hooks/useHarrafGame';
import usePlaceBet from '../hooks/usePlaceBet';
import useWallet from '../hooks/useWallet';
import {showAlert} from '../components/Alert';
import Loader from '../components/Loader';
import Toast from 'react-native-simple-toast';
import LoaderWhite from '../components/LoaderWhite';

const harrafNumbers = [
  '000',
  '111',
  '222',
  '333',
  '444',
  '555',
  '666',
  '777',
  '888',
  '999',
];

const HarrafGame = ({navTabHomeName, market, apiData, screenType}: any) => {
  const navigation = useNavigation();
  const {
    andarNumbers,
    baharNumbers,
    setAndarNumber,
    setBaharNumber,
    allBets,
    calculateTotalPoints,
  } = useHarrafGame(market);
  const placeBet = usePlaceBet();
  const {wallet} = useWallet();

  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [showNoBalance, setShowNoBalance] = useState(!sufficientBalance);
  const [betText, setBetText] = useState('');
  const [betText2, setBetText2] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setSufficientBalance(wallet?.total_amount >= calculateTotalPoints());
  }, [wallet, calculateTotalPoints()]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      screenType('Harraf');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('isPending :- ', placeBet);
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

  const onDone = () => {
    if (betText || betText2) {
      if (sufficientBalance) {
        placeBet.mutate(allBets().filter(bet => bet.points));
      } else {
        setShowNoBalance(!showNoBalance);
      }
    } else {
      Toast.show('Please place a bet.', Toast.LONG);
    }
  };

  useEffect(() => {
    apiData(allBets());
  }, [andarNumbers, baharNumbers]);

  const countDigits = (num : any) => {
    if (typeof num !== 'number' || isNaN(num)) {
      return 0;
    }
    return num.toString().replace('-', '').length;
  };

  const digitCountInMaximum =
    market && market.maximum ? countDigits(market.maximum) : 0;

  return (
    <View style={{display: navTabHomeName == 'Tab3' ? 'flex' : 'none'}}>
      <ScrollView nestedScrollEnabled>
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
                {calculateTotalPoints()}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                backgroundColor: '#329040',
                padding: 15,
                marginBottom: 20,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                Andar Haruf
              </Text>
            </View>
            {/* Table Body */}
            <View style={{...styles.table, ...styles.tableflex}}>
              {harrafNumbers.map(harrafNumber => (
                <View
                  key={harrafNumber}
                  style={{...styles.cell, ...styles.flexcell5}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#000000',
                      padding: 10,
                      backgroundColor: '#E1EFE6',
                    }}>
                    {harrafNumber}
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={
                      andarNumbers.find(
                        andarNumberInList =>
                          andarNumberInList.number === harrafNumber[0],
                      )?.points || ''
                    }
                    style={styles.inputNo}
                    onChangeText={text => {
                      setAndarNumber({
                        number: harrafNumber.charAt(0),
                        points: text,
                      }),
                        setBetText(text);
                    }}
                    maxLength={
                      digitCountInMaximum > 0 ? digitCountInMaximum : 4
                    }
                    placeholder="---"
                  />
                </View>
              ))}
            </View>
          </View>
          <View>
            <View
              style={{
                backgroundColor: '#329040',
                padding: 15,
                marginBottom: 20,
                marginTop: 30,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                Bahar Haruf
              </Text>
            </View>
            {/* Table Body */}
            <View
              style={{...styles.table, ...styles.tableflex, paddingBottom: 80}}>
              {harrafNumbers.map(harrafNumber => (
                <View
                  key={harrafNumber}
                  style={{...styles.cell, ...styles.flexcell5}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#000000',
                      padding: 10,
                      backgroundColor: '#E1EFE6',
                    }}>
                    {harrafNumber}
                  </Text>
                  <TextInput
                    value={
                      baharNumbers.find(
                        baharNumberInList =>
                          baharNumberInList.number === harrafNumber[0],
                      )?.points || ''
                    }
                    keyboardType="numeric"
                    style={styles.inputNo}
                    onChangeText={text => {
                      setBaharNumber({
                        number: harrafNumber.charAt(0),
                        points: text,
                      }),
                        setBetText2(text);
                    }}
                    maxLength={
                      digitCountInMaximum > 0 ? digitCountInMaximum : 4
                    }
                    placeholder="---"
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}

      <InsufficientBalance
        showModal={showNoBalance}
        setShowModal={setShowNoBalance}
      />

      <LoaderWhite visiblity={loader} />

      {/* Modal End */}

      {/* <View style={{ ...styles.footerFix, marginTop: 30 }}>
        <TouchableOpacity
          //disabled={placeBet.isPending || placeBet.isSuccess || allBets().filter((bet) => bet.points).length === 0}
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

export default HarrafGame;
