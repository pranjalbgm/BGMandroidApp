import {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import LuckyWheel, {LuckyWheelHandle} from 'react-native-lucky-wheel';
import COLORS from '../components/COLORS';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import apiClient, {BaseURLCLUB} from '../constants/api-client';
import {usePlayerData} from '../hooks/useHome';

const SLICES = [
  {text: '10'},
  {text: '20'},
  {text: '30'},
  {text: '40'},
  {text: '50'},
  {text: '60'},
  {text: '70'},
  {text: '80'},
  {text: '90'},
  {text: '100'},
];

const SpinnerWheel = ({spinleft, mobileNumber}) => {
  const playerInfo = usePlayerData();

  const [spinData, setSpinData] = useState(spinleft);
  const [spinWinner, setSpinWinner] = useState(0);
  const [loader, setLoader] = useState(false);
  const [mobile, setMobile] = useState(mobileNumber);

  const wheelRef = useRef(null);

  // Fetch player data if not loaded
  useEffect(() => {
    if (mobile && !playerInfo.isLoading && !playerInfo.isSuccess) {
      playerInfo.mutate({mobile});
    }
  }, [mobile]);

  // Set spin winner and update player info on success
  useEffect(() => {
    if (playerInfo.isSuccess && playerInfo.data) {
      const sampleNumber = playerInfo.data.spin_used;
      const lastDigit = Number.isInteger(sampleNumber)
        ? sampleNumber % 10
        : sampleNumber.toString().slice(-1);
      setSpinWinner(lastDigit);
    }
  }, [playerInfo.isSuccess, playerInfo.data]);

  const spinerApi = async data => {
    setLoader(true);

    const params = {mobile, amount: data.text};

    try {
      const response = await axios.post(
        BaseURLCLUB + '/create-spin-bonus/',
        params,
      );

      if (response.data) {
        Toast.show(response.data.message, Toast.LONG);

        // Decrease spin count immediately on success
        setSpinData(prevSpinData => Math.max(prevSpinData - 1, 0));

        // Update winner index
        setSpinWinner(prevWinner => prevWinner + 1);
      } else {
        Toast.show(response.data.message, Toast.LONG);
      }
    } catch (error) {
      Toast.show('Error while spinning. Please try again.', Toast.LONG);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* Spin Left Display */}
      <View
        style={{
          backgroundColor: COLORS.app_color,
          paddingHorizontal: 25,
          paddingVertical: 10,
          borderRadius: 90,
        }}>
        <Text style={{fontSize: 18, color: COLORS.white, fontWeight: '700'}}>
          {'SPIN LEFT 👉 ' + spinData}
        </Text>
      </View>

      {/* Lucky Wheel Component */}
      <LuckyWheel
        ref={wheelRef}
        slices={SLICES}
        onSpinningEnd={data => spinerApi(data)}
        enableGesture
        minimumSpinVelocity={0.6}
        winnerIndex={spinWinner === 0 ? 0 : spinWinner - 1}
        enableInnerShadow
        textStyle={{fontSize: 20}}
        enableOuterDots
        size={320}
      />

      {/* Spin Button */}
      <TouchableOpacity
        disabled={spinData <= 0}
        style={{
          backgroundColor: COLORS.app_color,
          paddingHorizontal: 25,
          paddingVertical: 10,
          borderRadius: 90,
          marginTop: 20,
          opacity: spinData > 0 ? 1 : 0.6,
        }}
        onPress={() => wheelRef?.current?.start()}>
        <Text style={{fontSize: 18, color: COLORS.white, fontWeight: '700'}}>
          🔥Spin🔥
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpinnerWheel;
