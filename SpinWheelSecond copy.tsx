import React, {useEffect, useRef, useState} from 'react';
import {View, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import LuckyWheel, {LuckyWheelHandle} from 'react-native-lucky-wheel';
import Button from './Button';
import {usePlayerData} from './src/hooks/useHome';
import {Text} from 'react-native-render-html';
import {fetchMobile} from './src/hooks/useWallet';
import useSpinWin from './src/hooks/useSpinWin';
import useSpinUser from './src/hooks/useSpinUser';

const SpinWheelSecond = () => {
  const [mobile, setMobile] = useState('');
  const playerInfo = usePlayerData();
  const winSpin = useSpinWin();
  const {spinUser} = useSpinUser();
  const wheelRef = useRef<LuckyWheelHandle>(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isEndlessSpinningOn, setIsEndlessSpinningOn] = useState(true);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinError, setSpinError] = useState('');
  const [spinSuccess, setSpinSuccess] = useState('');
  const [winnerIndex, setWinnerIndex] = useState<number | undefined>(undefined);

  const handleSpinClick = () => {
    if (!mustSpin && playerInfo && playerInfo?.data?.spin_remaining !== 0) {
      // Perform spin logic here...
      const used = String(playerInfo?.data?.spin_used);
      const index = parseInt(used.charAt(used.length - 1));
      const newPrizeNumber = index;
      // Update spin count
      playerInfo.mutate({spin_used: index + 1});
      // Set mustSpin to true to start the wheel
      setMustSpin(true);
    } else if (playerInfo?.data?.spin_remaining === 0) {
      setSpinError('Refer someone to earn spin.');
    }
  };

  const onFinished = async winner => {
    await winSpin.mutateAsync({mobile: mobile, amount: winner});
    setSpinSuccess(winner);
    setTimeout(() => {
      setSpinSuccess('');
    }, 1200);
    playerInfo.mutate({mobile});
    setMustSpin(false);
  };

  useEffect(() => {
    if(!mobile)
    playerInfo?.data?.spin_remaining === 0 && setZeroSpin(true);
  }, [mobile,playerInfo.data?.spin_remaining]);

  useEffect(() => {
    if (!mobile) {
      fetchMobile(setMobile).then(mobile => playerInfo.mutate({mobile}));
    }
    console.log("spin wheel secondpage ------------------true")
  }, [mobile]);

  useEffect(() => {
    if (mustSpin) {
      wheelRef.current?.start();

      setTimeout(() => {
        wheelRef.current?.stop();
        setMustSpin(false);
      }, 2000);
    }
  }, [mustSpin]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <LuckyWheel
        ref={wheelRef}
        slices={
          isImageMode
            ? require('./data/slices-for-image.json')
            : require('./data/slices-for-svg.json')
        }
        onSpinningStart={() => {
          console.log('onSpinningStart');
        }}
        onSpinningEnd={winner => {
          console.log('onSpinningEnd', winner);
          onFinished(winner);
        }}
        size={300}
        source={isImageMode ? require('./assets/images/wheel.png') : null}
        enableGesture
        minimumSpinVelocity={0.6}
        winnerIndex={winnerIndex}
        waitWinner={isEndlessSpinningOn}
      />

      <View style={styles.buttons}>
        <Button onPress={handleSpinClick} title="Start" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default SpinWheelSecond;

// ----------------original code ----------------------

// import React, { useEffect, useState } from 'react';
// import { View, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
// import LuckyWheel from 'react-native-lucky-wheel'; // Ensure this is the correct import
// import Button from './Button';
// import { usePlayerData } from './src/hooks/useHome';
// import { Text } from 'react-native-render-html';
// import { fetchMobile } from './src/hooks/useWallet';
// import useSpinWin from './src/hooks/useSpinWin';
// import useSpinUser from './src/hooks/useSpinUser';

// const SpinWheelSecond = () => {
//   const [mobile, setMobile] = useState("");
//   const playerInfo = usePlayerData();
//   const winSpin = useSpinWin();
//   const { spinUser } = useSpinUser();
//   const [isImageMode, setIsImageMode] = useState(false);
//   const [isEndlessSpinningOn, setIsEndlessSpinningOn] = useState(true);
//   const [mustSpin, setMustSpin] = useState(false);
//   const [prizeNumber, setPrizeNumber] = useState(0);
//   const [spinError, setSpinError] = useState("");
//   const [spinSuccess, setSpinSuccess] = useState("");
//   const [winnerIndex, setWinnerIndex] = useState<number | undefined>(undefined);

//   const handleSpinClick = () => {
//     console.log("handleSpinClick triggered");
//     if (!mustSpin && playerInfo && playerInfo?.data?.spin_remaining !== 0) {
//       const used = String(playerInfo?.data?.spin_used);
//       const index = parseInt(used.charAt(used.length - 1));
//       const newPrizeNumber = index;
//       console.log(`Setting prize number to ${newPrizeNumber}`);
//       setPrizeNumber(newPrizeNumber);
//       setMustSpin(true);
//     } else if (playerInfo?.data?.spin_remaining === 0) {
//       setSpinError("Refer someone to earn spin.");
//     }
//   };

//   const onFinished = async (winner) => {
//     console.log(`onFinished called with winner: ${winner}`);
//     await winSpin.mutateAsync({ mobile: mobile, amount: winner });
//     setSpinSuccess(winner);
//     setTimeout(() => {
//       setSpinSuccess("");
//     }, 1200);
//     playerInfo.mutate({ mobile });
//     setMustSpin(false);
//   };

//   useEffect(() => {
//     if (playerInfo?.data?.spin_remaining === 0) {
//       setSpinError("Refer someone to earn spin.");
//     }
//   }, [playerInfo.data?.spin_remaining]);

//   useEffect(() => {
//     if (!mobile) {
//       fetchMobile(setMobile).then(mobile => playerInfo.mutate({ mobile }));
//     }
//   }, [mobile]);

//   useEffect(() => {
//     if (mustSpin) {
//       console.log('Setting winnerIndex to', prizeNumber);
//       setWinnerIndex(prizeNumber);
//     }
//   }, [mustSpin, prizeNumber]);

//   useEffect(() => {
//     if (winnerIndex !== undefined) {
//       console.log('Winner index set to', winnerIndex);
//       setMustSpin(false);
//     }
//   }, [winnerIndex]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />
//       <LuckyWheel
//         slices={
//           isImageMode
//             ? require('./data/slices-for-image.json')
//             : require('./data/slices-for-svg.json')
//         }
//         onSpinningStart={() => {
//           console.log('onSpinningStart');
//         }}
//         onSpinningEnd={(winner) => {
//           console.log('onSpinningEnd', winner);
//           onFinished(winner);
//         }}
//         size={300}
//         source={isImageMode ? require('./assets/images/wheel.png') : null}
//         enableGesture
//         minimumSpinVelocity={0.6}
//         winnerIndex={winnerIndex}
//         waitWinner={isEndlessSpinningOn}
//       />

//       <View style={styles.buttons}>
//         <Button
//           onPress={handleSpinClick}
//           title="Start"
//         />
//       </View>
//       {spinError ? <Text>{spinError}</Text> : null}
//       {spinSuccess ? <Text>{spinSuccess}</Text> : null}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//   },
//   buttons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   text: {
//     fontSize: 17,
//     fontWeight: 'bold',
//   },
// });

// export default SpinWheelSecond;

// ------------------New Code --------------------------------------

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

  // useEffect(() => {
  //   if (!mobile) {
  //     fetchMobile(setMobile).then(mobile => playerInfo.mutate({mobile}));
  //   }
  // }, [mobile]);

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
          source={isImageMode ? require('./assets/images/wheel.png') : null}
          enableGesture
          minimumSpinVelocity={0.6}
          prizeNumber={prizeNumber}
          waitWinner={isEndlessSpinningOn}
        />
        <TouchableOpacity onPress={handleSpinClick}>
          {console.log('clicked')}
          <View style={styles.buttons}>
            <Button title="Spin" disabled={zeroSpin} />
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
