import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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

interface MoringStarScreenProps {
  navigation: any;
  route: {
    params: {
      market: Market;
    };
  };
}

interface ApiDataItem {
  points: number;
  betKey: string;
}

const MoringStarScreen: React.FC<MoringStarScreenProps> = ({
  navigation,
  route,
}) => {
  const {market} = route.params;
  const {timeRemaining, setTargetTime} = useCountdownTimer();
  const {jodiPoints} = useSetJodis();
  const placeBet = usePlaceBet();
  const {wallet} = useWallet();

  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [showNoBalance, setShowNoBalance] = useState(false);
  const [apiData, setApiData] = useState<ApiDataItem[]>([]);
  const [screenType, setScreenType] = useState<string>('');
  const [loader, setLoader] = useState(false);
  const [isPlayTriggered, setIsPlayTriggered] = useState(false);
  const [invalidBets, setInvalidBets] = useState<ApiDataItem[]>([]);

  // Set target time for the countdown timer
  useEffect(() => {
    if (market?.close_time) {
      setTargetTime(market.close_time);
    }
  }, [market?.close_time, setTargetTime]);

  // Update balance sufficiency when wallet or jodiPoints changes
  useEffect(() => {
    setSufficientBalance(wallet?.total_amount >= jodiPoints);
  }, [wallet, jodiPoints]);

  // Handle place bet state changes only when "Play" button is clicked
  useEffect(() => {
    if (!isPlayTriggered) {
      return;
    }

    if (placeBet.isPending) {
      setLoader(true);
    } else if (placeBet.isSuccess) {
      setLoader(false);
      setIsPlayTriggered(false);
      Toast.show('Bet Placed Successfully.', Toast.LONG);
      navigation.navigate('AllGameScreen');
    } else if (placeBet.isError) {
      setLoader(false);
      setIsPlayTriggered(false);
      Toast.show(
        `Could not place bet: ${placeBet.error?.response?.data?.error || 'Unknown error'}`,
        Toast.LONG,
      );
    }
  }, [
    placeBet.isPending,
    placeBet.isSuccess,
    placeBet.isError,
    isPlayTriggered,
    navigation,
  ]);

  useEffect(() => {
    if (screenType === 'Tab2') {
      const filteredBets = apiData.filter(bet => bet.betKey);
      const invalid = filteredBets.filter(
        bet => bet.betKey && bet.betKey.length !== 2,
      );
      setInvalidBets(invalid);
    } else {
      setInvalidBets([]);
    }
  }, [apiData, screenType]);

  const handlePlaceBet = () => {
    if (!apiData || apiData.length === 0) {
      Toast.show('Please add point.', Toast.LONG);
      return;
    }

    if (!sufficientBalance) {
      setShowNoBalance(true);
      return;
    }

    const invalidBet = apiData.find(bet => {
      const points = parseInt(bet.points.toString(), 10);
      return (
        isNaN(points) || points < market?.minimum || points > market?.maximum
      );
    });

    if (invalidBet) {
      if (isNaN(invalidBet.points)) {
        Toast.show('All bets must have valid numeric points.', Toast.LONG);
      } else {
        const minimumPoints =
          screenType === 'Tab3' ? market?.minimum * 10 : market?.minimum;

        if (invalidBet.points < minimumPoints) {
          Toast.show(`Minimum points to bet is ${minimumPoints}.`, Toast.LONG);
        } else if (invalidBet.points > market?.maximum) {
          Toast.show(`Maximum points to bet is ${market?.maximum}`, Toast.LONG);
        }
      }
      return; // Exit early if any condition above is met
    }

    let filteredBets: ApiDataItem[] = [];
    if (screenType === 'Tab1' || screenType === 'Tab3') {
      filteredBets = apiData.filter(bet => bet.points);
      if (filteredBets.length > 0) {
        setIsPlayTriggered(true); // Mark that the button was clicked
        placeBet.mutate(filteredBets);
      } else {
        Toast.show('No valid bets to place.', Toast.LONG);
      }
    } else if (screenType === 'Tab2') {
      if (invalidBets.length > 0) {
        Toast.show(
          'Jodi should have 2 digits, not less than that.',
          Toast.LONG,
        );
        console.log('this is invalidbets -------->', invalidBets);
      } else {
        filteredBets = apiData.filter(bet => bet.betKey);
        if (filteredBets.length > 0) {
          setIsPlayTriggered(true);
          placeBet.mutate(filteredBets);
        } else {
          Toast.show('No valid bets to place.', Toast.LONG);
        }
      }
    }
  };

  // const { timeRemaining, setTargetTime } = useCountdownTimer();

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
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderTwo
        navigation={navigation}
        market={market}
        isMarketClosed={isMarketClosed}
      />
      <ScrollView>
        <View style={{marginTop: 20}}>
          <TabCustom
            market={market}
            apiData={(data: ApiDataItem[]) => setApiData(data)}
            screenType={(type: string) => setScreenType(type)}
          />
        </View>
      </ScrollView>

      {(screenType === 'Tab1' ||
        screenType === 'Tab2' ||
        screenType === 'Tab3') && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: '90%',
            alignSelf: 'center',
            bottom: 20,
          }}
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
            handlePlaceBet();
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
      )}

      <Loader visibility={loader} />
      <InsufficientBalance
        showModal={showNoBalance}
        setShowModal={setShowNoBalance}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default MoringStarScreen;
