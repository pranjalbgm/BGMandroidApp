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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appStyles from '../styles/appStyles';
import usePlaceBet from '../hooks/usePlaceBet';
import useWallet from '../hooks/useWallet';
import useSetJodis from '../hooks/useSetJodis';
import {showAlert} from '../components/Alert';
import {useNavigation} from '@react-navigation/native';
import InsufficientBalance from '../components/InsufficientBalance.modal';
import Loader from '../components/Loader';
import LoaderWhite from '../components/LoaderWhite';
import Toast from 'react-native-simple-toast';

const JodiGame = ({navTabHomeName, market, apiData, screenType}: any) => {
  const navigation = useNavigation();
  const jodiFields = Array.from({length: 100}, (_, index) =>
    index.toString().padStart(2, '0'),
  );

  const {wallet} = useWallet();
  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [showNoBalance, setShowNoBalance] = useState(!sufficientBalance);
  const [betText, setBetText] = useState('');

  const {jodiPoints, setJodiInput, jodis} = useSetJodis();
  const [loader, setLoader] = useState(false);
  const placeBet = usePlaceBet();

  useEffect(() => {
    setSufficientBalance(wallet?.total_amount >= jodiPoints);
    console.log("this is jodi game ----------------------------true")
  }, [wallet, jodiPoints]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      screenType('Jodi');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

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
      showAlert('Failed!', 'Could not place bet...');
      // console.log("sdfkjakv", placeBet)
    }
  }, [placeBet.isSuccess, placeBet.isError, placeBet.isPending]);

  const onDone = () => {
    if (betText) {
      if (sufficientBalance) {
        placeBet.mutate(jodis.filter(bet => bet.points));
      } else {
        setShowNoBalance(!showNoBalance);
      }
    } else {
      Toast.show('Please place a bet.', Toast.LONG);
    }
  };

  const onChange = (data: any) => {
    apiData(data);
  };

  const setJodiInputData = ({
    betKey,
    points,
    betType,
    jodiType = 'Jodi',
    market,
  }) => {
    const updatedJodis = [...jodis];
    const existingIndex = updatedJodis.findIndex(
      jodi => jodi.betKey === betKey,
    );

    if (points === '') {
      if (existingIndex !== -1) {
        updatedJodis.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        updatedJodis[existingIndex] = {
          betKey: betKey,
          points,
          betType,
          jodiType,
          market,
        };
      } else {
        updatedJodis.push({
          betKey: betKey,
          points,
          betType,
          jodiType,
          market,
        });
      }
    }

    apiData(updatedJodis);
  };

  const countDigits = num => {
    if (typeof num !== 'number' || isNaN(num)) {
      return 0;
    }
    return num.toString().replace('-', '').length;
  };

  const digitCountInMaximum =
    market && market.maximum ? countDigits(market.maximum) : 0;

  return (
    <View style={{display: navTabHomeName == 'Tab1' ? 'flex' : 'none'}}>
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
                {jodiPoints}
              </Text>
            </View>
          </View>

          <View style={{paddingBottom: 70}}>
            {/* Table Header */}
            {/* Table Body */}
            <View style={{...styles.table, ...styles.tableflex}}>
              {jodiFields.map(jodiField => (
                <View
                  style={{...styles.cell, ...styles.flexcell}}
                  key={jodiField}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#000000',
                      padding: 10,
                      backgroundColor: '#E1EFE6',
                    }}>
                    {jodiField}
                  </Text>
                  <TextInput
                    style={styles.inputNo}
                    onChangeText={text => {
                      setJodiInput({
                        betKey: jodiField,
                        points: text,
                        betType: 'Jodi',
                        market: market?.market,
                      }),
                        setBetText(text),
                        setJodiInputData({
                          betKey: jodiField,
                          points: text,
                          betType: 'Jodi',
                          market: market?.market,
                        });
                    }}
                    //value={betText}
                    maxLength={
                      digitCountInMaximum > 0 ? digitCountInMaximum : 4
                    }
                    placeholder="---"
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </View>
            {/* Add as many rows as needed */}
          </View>
        </View>
      </ScrollView>

      {/* Modal */}

      <InsufficientBalance
        showModal={showNoBalance}
        setShowModal={setShowNoBalance}
      />

      {/* Modal End */}

      {/* <TouchableOpacity
        style={{ position: 'absolute', width: '90%', alignSelf: 'center', top: "80%", }}
        onPress={() => onDone()}>
        <View
          style={styles.Btn}>
          <Text style={styles.primaryBtn}>Play</Text>
          <View style={styles.bottomBorder} />
        </View>
      </TouchableOpacity> */}

      <LoaderWhite visiblity={loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default JodiGame;
