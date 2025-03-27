import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LuckyWheel, {LuckyWheelHandle} from 'react-native-lucky-wheel';
import Button from './Button';
import {usePlayerData} from './src/hooks/useHome';
import {fetchMobile} from './src/hooks/useWallet';
import useSpinWin from './src/hooks/useSpinWin';

const SpinWheelSecond = () => {
  const [mobile, setMobile] = useState('');
  const playerInfo = usePlayerData();
  const winSpin = useSpinWin();
  const wheelRef = useRef<LuckyWheelHandle>(null);
  const mustSpinRef = useRef(false); // Create ref for mustSpin
  const [isImageMode, setIsImageMode] = useState(false);
  const [isEndlessSpinningOn, setIsEndlessSpinningOn] = useState(true);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinError, setSpinError] = useState('');
  const [spinSuccess, setSpinSuccess] = useState('');
  const [zeroSpin, setZeroSpin] = useState(false);

  const handleSpinClick = () => {
    console.log('Spin button clicked');
    console.log('mustSpinRef.current:', mustSpinRef.current);
    console.log('Remaining spins:', playerInfo?.data?.spin_remaining);

    if (
      wheelRef.current &&
      playerInfo &&
      playerInfo?.data?.spin_remaining !== 0
    ) {
      const used = String(playerInfo?.data?.spin_used);
      const index = parseInt(used.charAt(used.length - 1));
      const newPrizeNumber = index;

      setPrizeNumber(newPrizeNumber);
      mustSpinRef.current = true;
      setIsImageMode;
      console.log('Starting spin with prize number:', newPrizeNumber);
      wheelRef.current.spin(); // Explicitly call the spin method
    } else if (playerInfo?.data?.spin_remaining === 0) {
      setSpinError('Refer someone to earn spin.');
    }
  };

  const onFinished = async winner => {
    await winSpin.mutateAsync({mobile, amount: winner});
    setSpinSuccess(winner);
    setTimeout(() => {
      setSpinSuccess('');
    }, 1200);
    playerInfo.mutate({mobile});
    mustSpinRef.current = false; // Reset ref value
  };

  useEffect(() => {
    if (!mobile) {
      fetchMobile(setMobile).then(mobile => playerInfo.mutate({mobile}));
    }
    console.log("spin wheel second2 ----------------------true")
  }, [mobile]);

  useEffect(() => {
    if (playerInfo?.data?.spin_remaining === 0) {
      setZeroSpin(true);
    }
  }, [playerInfo.data?.spin_remaining]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text style={styles.textSpin}>
        SPINS LEFT 👉{' '}
        {playerInfo?.data?.spin_remaining ||
          (!zeroSpin ? 'Calculating spins left..' : 0)}
      </Text>
      <View style={{marginTop: 20}}>
        <LuckyWheel
          ref={wheelRef}
          slices={
            isImageMode
              ? require('./data/slices-for-image.json')
              : require('./data/slices-for-svg.json')
          }
          onSpinningStart={() => console.log('onSpinningStart')}
          onSpinningEnd={() => {
            const amount = `${String(prizeNumber + 1)}0`;
            console.log('Spinning end, winner amount:', amount);
            onFinished(amount);
          }}
          size={300}
          //source={isImageMode ? require('./assets/images/wheel.png') : null}
          enableGesture
          minimumSpinVelocity={0.6}
          prizeNumber={prizeNumber}
          waitWinner={isEndlessSpinningOn}
        />
        <TouchableOpacity onPress={handleSpinClick}>
          {console.log('clicked')}
          <View style={styles.buttons}>
            <Button title="Spi" disabled={zeroSpin} />
          </View>
        </TouchableOpacity>
      </View>
      {spinError ? <Text style={styles.text}>{spinError}</Text> : null}
      {spinSuccess ? <Text style={styles.text}>{spinSuccess}</Text> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textSpin: {
    marginTop: 130,
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SpinWheelSecond;
