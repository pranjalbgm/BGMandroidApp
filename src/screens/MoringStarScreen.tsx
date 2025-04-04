import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';

import HeaderTwo from '../components/HeaderTwo';
import TabCustom from '../components/TabCustom';
import appStyles from '../styles/appStyles';
import useCountdownTimer from '../hooks/useCountdownTimer';
import useSetJodis from '../hooks/useSetJodis';
import usePlaceBet from '../hooks/usePlaceBet';
import Loader from '../components/Loader';
import InsufficientBalance from '../components/InsufficientBalance.modal';
import useWallet from '../hooks/useWallet';

interface Market {
  close_time: number;
  minimum: number;
  maximum: number;
}

interface ApiDataItem {
  points: number;
  betKey?: string;
}

interface MoringStarScreenProps {
  navigation: any;
  route: {
    params: {
      market: Market;
    };
  };
}

const MoringStarScreen: React.FC<MoringStarScreenProps> = ({ navigation, route }) => {
  const { market } = route.params;
  const { timeRemaining, setTargetTime } = useCountdownTimer();
  const { jodiPoints } = useSetJodis();
  const placeBet = usePlaceBet();
  const { wallet } = useWallet();

  const [showNoBalance, setShowNoBalance] = useState(false);
  const [apiData, setApiData] = useState<ApiDataItem[]>([]);
  const [screenType, setScreenType] = useState<string>('');
  const [loader, setLoader] = useState(false);
  const [isPlayTriggered, setIsPlayTriggered] = useState(false);

  useEffect(() => {
    if (market?.close_time) {
      setTargetTime(market.close_time);
    }
  }, [market?.close_time, setTargetTime]);

  const sufficientBalance = useMemo(() => wallet?.total_amount >= jodiPoints, [wallet, jodiPoints]);
  
  const invalidBets = useMemo(() => {
    if (screenType === 'Tab2') {
      return apiData.filter(bet => bet.betKey && bet.betKey.length !== 2);
    }
    return [];
  }, [apiData, screenType]);

  useEffect(() => {
    if (isPlayTriggered) {
      if (placeBet.isPending) {
        setLoader(true);
      } else {
        setLoader(false);
        setIsPlayTriggered(false);
        if (placeBet.isSuccess) {
          Toast.show('Bet Placed Successfully.', Toast.LONG);
          navigation.navigate('AllGameScreen');
        } else if (placeBet.isError) {
          Toast.show(`Could not place bet: ${placeBet.error?.response?.data?.error || 'Unknown error'}`, Toast.LONG);
        }
      }
    }
  }, [placeBet.isPending, placeBet.isSuccess, placeBet.isError, isPlayTriggered, navigation]);

  const handlePlaceBet = useCallback(() => {
    if (!apiData.length) {
      return Toast.show('Please add points.', Toast.LONG);
    }

    if (!sufficientBalance) {
      return setShowNoBalance(true);
    }

    const invalidBet = apiData.find(bet => {
      const points = parseInt(bet.points.toString(), 10);
      return isNaN(points) || points < market.minimum || points > market.maximum;
    });

    if (invalidBet) {
      return Toast.show(
        isNaN(invalidBet.points)
          ? 'All bets must have valid numeric points.'
          : invalidBet.points < market.minimum
          ? `Minimum bet is ${market.minimum}.`
          : `Maximum bet is ${market.maximum}.`,
        Toast.LONG
      );
    }

    const filteredBets = screenType === 'Tab2' ? apiData.filter(bet => bet.betKey) : apiData.filter(bet => bet.points);

    if (screenType === 'Tab2' && invalidBets.length) {
      return Toast.show('Jodi should have 2 digits.', Toast.LONG);
    }

    if (filteredBets.length) {
      setIsPlayTriggered(true);
      placeBet.mutate(filteredBets);
    } else {
      Toast.show('No valid bets to place.', Toast.LONG);
    }
  }, [apiData, market, screenType, invalidBets, sufficientBalance, placeBet]);

  const isMarketClosed = useMemo(() => {
    return parseInt(timeRemaining?.hours || '0', 10) === 0 &&
           parseInt(timeRemaining?.minutes || '0', 10) === 0 &&
           parseInt(timeRemaining?.seconds || '0', 10) === 0;
  }, [timeRemaining]);

  return (
    <View style={styles.container}>
      <HeaderTwo navigation={navigation} market={market} isMarketClosed={isMarketClosed} />
      <ScrollView>
        <View style={styles.contentWrapper}>
          <TabCustom market={market} apiData={setApiData} screenType={setScreenType} />
        </View>
      </ScrollView>
      {(screenType === 'Tab1' || screenType === 'Tab2' || screenType === 'Tab3') && (
        <TouchableOpacity
          style={[styles.playButton, { opacity: isPlayTriggered ? 0.5 : 1 }]}
          onPress={() => {
            if (isMarketClosed) {
              Toast.show('Market time is over.', Toast.LONG);
              return setTimeout(() => navigation.navigate('AllGameScreen'), 1000);
            }
            if (!isPlayTriggered) {
              handlePlaceBet();
            }
          }}
          disabled={isPlayTriggered}>
          <View style={styles.btn}>
            <Text style={styles.primaryBtn}>{isMarketClosed ? 'Time Out' : 'Play'}</Text>
          </View>
        </TouchableOpacity>
      )}
      <Loader visiblity={loader} />
      <InsufficientBalance showModal={showNoBalance} setShowModal={setShowNoBalance} />
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  container: { flex: 1, backgroundColor: '#ffffff' },
  contentWrapper: { marginTop: 20 },
  playButton: { position: 'absolute', width: '90%', alignSelf: 'center', bottom: 20 },
});

export default MoringStarScreen;
