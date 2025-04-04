import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-simple-toast';

import NavFooter from '../components/NavFooter';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import KycModal from '../components/KycModal';
import Loader from '../components/Loader';

import useMarkets from '../hooks/useMarkets';
import useHome, { usePlayerDataFetch } from '../hooks/useHome';
import { fetchMobile } from '../hooks/useWallet';
import { getButtonText } from '../utils/KycUtils';
import appStyles from '../styles/appStyles';

interface Market {
  id: string;
  status: boolean;
  market: string;
  market_status: string;
}

interface AllGameScreenProps {
  navigation: StackNavigationProp<any>;
}

const AllGameScreen: React.FC<AllGameScreenProps> = ({ navigation }) => {
  const [isMenuVisible, setMenuVisibility] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mobile, setMobile] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);

  const { markets } = useMarkets();
  const { refetch } = usePlayerDataFetch(mobile);
  const playerInfo = usePlayerDataFetch(mobile);

   useEffect(() => {
        const initializeMobile = async () => {
          const fetchedMobile = await fetchMobile(setMobile);
          if (fetchedMobile) {
            // playerInfo.mutate({ mobile: fetchedMobile });
            refetch(fetchedMobile)
          }
        };
        initializeMobile();
      }, []);

  const filteredMarkets = useMemo(
    () => markets?.filter((market: Market) => market.status),
    [markets]
  );

  const onPlayClick = useCallback(
    (market: Market) => {
      setLoader(true);
      try {
        const buttonText = getButtonText(playerInfo);
        if (buttonText === 'KYC Verified!') {
          navigation.navigate('MoringStarScreen', { market });
        } else {
          Toast.show(buttonText, Toast.LONG);
        }
      } catch (error) {
        console.error('Error in onPlayClick:', error);
        Toast.show('Something went wrong. Please try again.', Toast.LONG);
      } finally {
        setLoader(false);
      }
    },
    [playerInfo, navigation]
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
        <View style={styles.container}>
          <Header page="Games" setMenuVisibility={setMenuVisibility} isMenuVisible={isMenuVisible} />
          <View style={styles.content}>
            <Navbar navigation={navigation} isMenuVisible={isMenuVisible} />
            <ScrollView>
              <View style={styles.header}>
                <Text style={styles.headerText}>All Games</Text>
              </View>
              <View style={styles.marketHeader}>
                <Text style={styles.marketTitle}>Market Name</Text>
                <Text style={styles.marketAction}>Action</Text>
              </View>
              <ScrollView>
                <TouchableWithoutFeedback>
                <View>
                  {filteredMarkets?.map((market: Market) => (
                    <View key={market.id} style={styles.marketItem}>
                      <Text style={styles.marketName}>{market.market}</Text>
                      <TouchableOpacity
                       style={styles.Btn}
                        onPress={market.market_status !== 'Closed' ? () => onPlayClick(market) : undefined}
                      >
                        <Text style={market.market_status !== 'Closed' ? styles.primaryBtn : styles.secondaryBtn}>
                          {market.market_status !== 'Closed' ? 'Play Games' : 'Time Out'}
                        </Text>
                        {/* <View style={styles.bottomBorder} /> */}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </ScrollView>
          </View>

          <KycModal
            animationType="fade"
            transparent
            visible={modalVisible}
            setModalVisible={setModalVisible}
            mobile={mobile}
            playerData={playerInfo}
          />

          <Loader visiblity={loader} />
        </View>
      </TouchableWithoutFeedback>
      <NavFooter />
    </>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#001C0D',
    padding: 20,
  },
  headerText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 20,
  },
  marketHeader: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketTitle: {
    color: 'darkgreen',
    fontWeight: '800',
    fontSize: 20,
  },
  marketAction: {
    color: 'darkgreen',
    fontWeight: '800',
  },
  marketItem: {
    backgroundColor: '#E1EFE6',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  marketName: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  activeBtn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  inactiveBtn: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  activeBtnText: {
    color: 'white',
    fontWeight: '700',
  },
  inactiveBtnText: {
    color: 'white',
    fontWeight: '700',
  },
});

export default AllGameScreen;
