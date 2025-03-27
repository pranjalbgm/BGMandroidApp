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
import {showAlert} from '../components/Alert';
import InsufficientBalance from '../components/InsufficientBalance.modal';
import useCopyPasteGame from '../hooks/useCopyPasteGame';
import useWallet from '../hooks/useWallet';
import usePlaceBet from '../hooks/usePlaceBet';
import Toast from 'react-native-simple-toast';
import LoaderWhite from '../components/LoaderWhite';
import {usePlayerData} from '../hooks/useHome';
import useCountdownTimer from '../hooks/useCountdownTimer';

const CopyPasteGame = ({navTabHomeName, market, screenType}: any) => {
  const navigation = useNavigation();
  const playerData = usePlayerData();

  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [showNoBalance, setShowNoBalance] = useState(!sufficientBalance);

  const [isPalti, setIsPalti] = useState(true);
  const [inputNumber, setInputNumber] = useState('');
  const [points, setPoints] = useState('');
  const [loader, setLoader] = useState(false);

  const [error, setError] = useState('');

  const {
    jodis,
    createPairsAndReverse,
    deleteJodi,
    calculatCopyPastePointsTotal,
  } = useCopyPasteGame();

  const {wallet} = useWallet();
  const placeBet = usePlaceBet();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      screenType('copyPaste');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if(wallet){
      setSufficientBalance(
        wallet?.total_amount >= calculatCopyPastePointsTotal(points),
      );
    }
    
  }, [wallet, calculatCopyPastePointsTotal(points)]);

  useEffect(() => {
    error && showAlert('Failed', error);
  }, [error]);

  const copyPasteBets = () =>
    jodis.map(jodi => ({
      betKey: jodi.pair,
      points: jodi.points,
      betType: 'Jodi',
      jodiType: 'Jodi',
      market: market?.market,
    }));

  const handleAddCpJodis = () => {
    if (!inputNumber) {
      Toast.show('Please enter number.', Toast.LONG);
    } else if (!points) {
      Toast.show('Please enter amount.', Toast.LONG);
    } else {
      const isSuccess = createPairsAndReverse(inputNumber, points, isPalti);
      setError(isSuccess);
      inputNumber && points
        ? createPairsAndReverse(inputNumber, points, isPalti)
        : console.log('Invalid Inputs');
    }
  };

  // useEffect(() => {
  //   if (placeBet.isSuccess) {
  //     showAlert("Successful!", "Point Placed Successfully.")
  //     navigation.navigate('HomeScreen')
  //   } else if (placeBet.isError) {
  //     showAlert("Successful!", "Could not place bet...")
  //   }
  // }, [placeBet])

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
      // showAlert("Failed!", `Could not place bet..  ${placeBet.error?.response?.data?.error || ""
      // }`)
    }
  }, [placeBet.isSuccess, placeBet.isError, placeBet.isPending]);

  const handleSubmit = () => {
    // Assuming you have the points object available
    const pointsValue = points; // Access points based on manualField index

    if (pointsValue == null || isNaN(pointsValue)) {
      Toast.show('All bets must have valid numeric points.', Toast.LONG);
      return; // Early return if pointsValue is invalid
    }

    if (pointsValue < market.minimum) {
      Toast.show(`Minimum points to bet is ${market?.minimum}.`, Toast.LONG);
    } else if (playerData?.data?.block === 'yes') {
      Toast.show('You are blocked. Please contact the team.', Toast.LONG);
    } else {
      if (sufficientBalance) {
        placeBet.mutate(copyPasteBets());
      } else {
        setShowNoBalance(!showNoBalance);
        // toast.error("Insufficient balance to place the bet.");
        Toast.show('Insufficient balance to place the bet.', Toast.LONG);
      }
    }
  };

  const countDigits = num => {
    if (typeof num !== 'number' || isNaN(num)) {
      return 0;
    }
    return num.toString().replace('-', '').length;
  };

  const digitCountInMaximum =
    market && market.maximum ? countDigits(market.maximum) : 0;

  const {timeRemaining, setTargetTime} = useCountdownTimer();

  // Convert timeRemaining values from string to number for comparison
  const isMarketClosed =
    parseInt(timeRemaining?.hours || '0', 10) === 0 &&
    parseInt(timeRemaining?.minutes || '0', 10) === 0 &&
    parseInt(timeRemaining?.seconds || '0', 10) === 0;

  useEffect(() => {
    if (market?.close_time) {
      setTargetTime(market.close_time);
    }
  }, [market?.close_time, setTargetTime]);

  return (
    <View style={{display: navTabHomeName == 'Tab5' ? 'flex' : 'none'}}>
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={styles.nestedScrollView}>
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
                {calculatCopyPastePointsTotal(points)}
              </Text>
            </View>
          </View>
          <View style={{marginVertical: 15, paddingHorizontal: 20}}>
            <View style={{marginBottom: 15}}>
              <Text
                style={{
                  color: '#000000',
                  marginBottom: 10,
                  fontWeight: '500',
                }}>
                Number
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  keyboardType="numeric"
                  maxLength={9}
                  onChangeText={text => setInputNumber(text)}
                  value={inputNumber}
                  placeholder="Number"
                />
              </View>
            </View>
            <View>
              <RadioButton.Group
                onValueChange={value => setIsPalti(value)}
                value={isPalti}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'left',
                  }}>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton
                      value={true}
                      color="#4CB050" // Set the color of the radio button when selected (active) to green
                      uncheckedColor="#4CB050" // Set the color of the radio button when not selected to black
                    />
                    <Text style={styles.label}>With Palti</Text>
                  </View>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton
                      value={false}
                      color="#4CB050" // Set the color of the radio button when selected (active) to green
                      uncheckedColor="#4CB050" // Set the color of the radio button when not selected to black
                    />
                    <Text style={styles.label}>Without Palti</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            <View style={{marginBottom: 15}}>
              <Text
                style={{
                  color: '#000000',
                  marginBottom: 10,
                  fontWeight: '500',
                }}>
                Amount
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={text => setPoints(text)}
                  value={points}
                  placeholder="Enter Amount"
                  maxLength={digitCountInMaximum > 0 ? digitCountInMaximum : 4}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.Btn}
              onPress={() => handleAddCpJodis()}>
              <Text style={styles.primaryBtn}>Add</Text>
              <View style={styles.bottomBorder} />
            </TouchableOpacity>
          </View>

          {jodis.length !== 0 && (
            <ScrollView horizontal>
              <View>
                <View
                  style={{
                    backgroundColor: '#000000',

                    display: 'flex',
                    alignItems: 'center',
                    // justifyContent: 'space-between',
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
                    Number Type
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 145,
                    }}>
                    Number
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
                    Action
                  </Text>
                </View>

                {jodis?.map((jodi, index) => (
                  <View key={index}>
                    <View
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
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        Jodi
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {jodi.pair}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {jodi.points}
                      </Text>
                      <TouchableOpacity onPress={() => deleteJodi(jodi)}>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 145,
                          }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Modal */}

      <LoaderWhite visiblity={loader} />

      <InsufficientBalance
        showModal={showNoBalance}
        setShowModal={setShowNoBalance}
      />

      {/* Modal End */}

      {jodis.length !== 0 && (
        <View style={{...styles.footerFix, marginTop: 30}}>
          {/* <TouchableOpacity
          disabled={
            placeBet.isPending ||
            placeBet.isSuccess ||
            jodis.length === 0
          }
          style={styles.Btn}
          // onPress={() => {
          //   return sufficientBalance
          //     ? placeBet.mutate(copyPasteBets())
          //     : setShowNoBalance(!showNoBalance);
          // }}
          onPress={() => {
            if (sufficientBalance) {
              handleSubmit(); // Call the function
            } else {
              setShowNoBalance(!showNoBalance);
            }
          }}
          >
          <Text style={styles.primaryBtn}>Play</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.Btn}
            onPress={() => {
              if (isMarketClosed) {
                Toast.show(
                  'Market time is over. You cannot place bets.',
                  Toast.LONG,
                );

                setTimeout(() => {
                  navigation.navigate('AllGameScreen');
                }, 1000); // Delay time can be adjusted as needed
                return;
              }
              if (sufficientBalance) {
                handleSubmit();
              } else {
                setShowNoBalance(!showNoBalance);
              }
            }}
            disabled={
              placeBet.isPending || placeBet.isSuccess || jodis.length === 0
            }>
            <View style={styles.Btn}>
              <Text style={styles.primaryBtn}>
                {isMarketClosed ? 'Time Out' : 'Play'}
              </Text>
              <View style={styles.bottomBorder} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default CopyPasteGame;
