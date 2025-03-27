import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useCountdownTimer from '../hooks/useCountdownTimer';

interface Market {
  market?: string;
  close_time: number;
}

const HeaderTwo = ({
  market,
  navigation,
  isMarketClosed,
}: {
  market: Market;
  navigation: any;
  isMarketClosed: boolean;
}) => {
  const {timeRemaining, setTargetTime} = useCountdownTimer();

  // Convert timeRemaining values from string to number for comparison
  // const isMarketClosed =
  //   parseInt(timeRemaining?.hours || '0', 10) === 0 &&
  //   parseInt(timeRemaining?.minutes || '0', 10) === 0 &&
  //   parseInt(timeRemaining?.seconds || '0', 10) === 0;

  useEffect(() => {
    if (market?.close_time) {
      setTargetTime(market.close_time);
    }
    console.log("header 2 ----------------------------true")
  }, [market?.close_time]);

  return (
    <View style={styles.header}>
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => navigation.goBack()}>
          <Text style={{color: '#000000', marginRight: 5}}>
            <AntDesign name="arrowleft" size={22} color={'#000000'} />
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>{market.market}</Text>
      </View>
      <View>
        <Text
          style={{color: '#000000', textAlign: 'center', fontWeight: '500'}}>
          {' '}
          Time Left{' '}
        </Text>
        <Text
          style={{color: '#000000', textAlign: 'center', fontWeight: '500'}}>
          <Text style={styles.timerText}>
            {`${timeRemaining?.hours}:${timeRemaining?.minutes}:${timeRemaining?.seconds}`}
          </Text>{' '}
          | {isMarketClosed ? 'Closed' : 'Active'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E1EFE6',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 72,
    color: '#000000',
    elevation: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  timerText: {
    paddingLeft: 15,
    marginLeft: 10,
  },
});

export default HeaderTwo;
