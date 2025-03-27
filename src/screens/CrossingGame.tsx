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
import useWallet from '../hooks/useWallet';
import usePlaceBet from '../hooks/usePlaceBet';
import useCrossingGame from '../hooks/useCrossingGame';
import {showAlert} from '../components/Alert';
import InsufficientBalance from '../components/InsufficientBalance.modal';
import Toast from 'react-native-simple-toast';
import LoaderWhite from '../components/LoaderWhite';
import {usePlayerData} from '../hooks/useHome';
import useCountdownTimer from '../hooks/useCountdownTimer';

const CrossingGame = ({navTabHomeName, market, screenType}: any) => {
  const navigation = useNavigation();

  const playerData = usePlayerData();

  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [showNoBalance, setShowNoBalance] = useState(!sufficientBalance);

  const [textOne, settextOne] = useState('');
  const [textTwo, settextTwo] = useState('');
  const [textThree, settextThree] = useState('');
  const [loader, setLoader] = useState(false);

  const {wallet} = useWallet();
  const placeBet = usePlaceBet();

  const {
    crossingFirstInput,
    crossingSecondInput,
    setCrossingFirstInput,
    setCrossingSecondInput,
    deleteCrossingJodi,
    crossingPoints,
    setCrossingPoints,
    crossingJodis,
    setCrossingJodis,
    buildCrossingJodi,
    calculateCrossingPointsTotal,
  } = useCrossingGame();

  useEffect(() => {
    setSufficientBalance(
      wallet?.total_amount >= calculateCrossingPointsTotal(),
    );
  }, [wallet, calculateCrossingPointsTotal()]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      screenType('Crossing');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const crossingJodiBets = () =>
    crossingJodis?.map(crossingJodi => ({
      betKey: crossingJodi,
      points: crossingPoints,
      betType: 'Jodi',
      jodiType: 'Jodi',
      market: market?.market,
    }));

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

  const onDone = () => {
    // (crossingFirstInput && crossingSecondInput && crossingPoints) && setCrossingJodis(prev =>
    //   buildCrossingJodi(crossingFirstInput, crossingSecondInput)
    // )

    if (!textOne || textTwo) {
      Toast.show('Please enter same digit number in both field.', Toast.LONG);
    } else if (!textThree) {
      Toast.show('Please enter number points.', Toast.LONG);
    } else {
      setCrossingJodis(prev =>
        buildCrossingJodi(crossingFirstInput, crossingSecondInput),
      );
    }
  };
  // crossingPoints
  // const invalidBet = apiData.find((bet) => {
  //   const points = parseInt(bet.points.toString(), 10);
  //   return isNaN(points) || points < market?.minimum || points > market?.maximum;
  // });

  const handleSubmit = () => {
    const pointsValue = crossingPoints;

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
        placeBet.mutate(crossingJodiBets());
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
    <View style={{display: navTabHomeName == 'Tab4' ? 'flex' : 'none'}}>
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
                {calculateCrossingPointsTotal()}
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
                  onChangeText={text => {
                    setCrossingFirstInput(text),
                      crossingFirstInput === crossingSecondInput &&
                        setCrossingSecondInput(text),
                      settextOne(text);
                  }}
                  value={crossingFirstInput}
                  maxLength={6}
                  placeholder="Number"
                />
              </View>
            </View>
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
                  onChangeText={text => {
                    setCrossingSecondInput(text), settextTwo(text);
                  }}
                  value={crossingSecondInput}
                  placeholder="Number"
                />
              </View>
            </View>
            <View style={{marginBottom: 15}}>
              <Text
                style={{
                  color: '#000000',
                  marginBottom: 10,
                  fontWeight: '500',
                }}>
                Number Points
              </Text>
              <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={text => {
                    setCrossingPoints(text), settextThree(text);
                  }}
                  value={crossingPoints}
                  placeholder="Points"
                  maxLength={digitCountInMaximum > 0 ? digitCountInMaximum : 4}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.Btn} onPress={() => onDone()}>
              <Text style={styles.primaryBtn}>
                {crossingJodis ? 'Update' : 'Add'}
              </Text>
              <View style={styles.bottomBorder} />
            </TouchableOpacity>
          </View>

          {crossingJodis && (
            <ScrollView horizontal>
              <View>
                <View
                  style={{
                    backgroundColor: '#000000',

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

                {crossingJodis?.map((jodi: any) => (
                  <View key={jodi}>
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
                        Crossing
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {jodi}
                      </Text>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          padding: 15,
                          minWidth: 145,
                        }}>
                        {crossingPoints}
                      </Text>
                      <TouchableOpacity
                        onPress={() => deleteCrossingJodi(jodi)}>
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

      {crossingJodis && (
        <View style={styles.footerFix}>
          {/* <TouchableOpacity
          disabled={placeBet.isPending || placeBet.isSuccess}
          style={styles.Btn}
          onPress={() => {
            if (sufficientBalance) {
              handleSubmit(); // Call the function
            } else {
              setShowNoBalance(!showNoBalance);
            }
          }}
          // onPress={() => {
          //   return sufficientBalance
          //     ? handleSubmit
          //     : setShowNoBalance(!showNoBalance);
          // }}
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
            // disabled={isMarketClosed}
          >
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

export default CrossingGame;
