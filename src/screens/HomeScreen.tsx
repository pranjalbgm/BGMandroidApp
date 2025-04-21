import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Image,
  Modal,
  Linking,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Component Imports
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NavFooter from '../components/NavFooter';
import WalletPoints from '../components/walletPoints';
import WelcomeModal from '../components/WelcomeModal';
import KycModal from '../components/KycModal';
import Loader from '../components/Loader';
import ContactModal from '../components/HomepageComponent/ContactModal';

// Hook Imports
import useMarkets from '../hooks/useMarkets';
import useHome, {  usePlayerDataFetch } from '../hooks/useHome';
import useLatestResult from '../hooks/useLatestResult';
import useWallet, { fetchMobile } from '../hooks/useWallet';

// Utility Imports
import { getTodayDate, isTimeNotPassed } from '../utils/time';
import ConvertTime from '../hooks/useConvertTime';
import { openURL } from '../utils/general';
import appStyles from '../styles/appStyles';
import Toast from 'react-native-simple-toast';
import { getButtonText } from '../utils/KycUtils';

// Type Definitions
interface Market {
  id: number;
  market: string;
  market_status:string;
  open_time: string;
  close_time: string;
  result_time: string;
  status: boolean;
  previous_result?: {
    bet_key: number;
  };
  latest_result?: {
    bet_key: number;
    created_at: string
  };
}

interface PlayerInfo {
  kyc?: string;
  mobile?: string;
}

interface HomeData {
  greeting_banner?: string;
}

interface LatestResult {
  market_name?: string;
  bet_key?: number;
}

interface MarketItemProps {
  market: Market;
  onPlayClick: (market: Market) => void;
}

// Market Display Component
const MarketItem: React.FC<MarketItemProps> = React.memo(({ market, onPlayClick }) => {
  const activemarket = market?.market_status !== "Closed"
  const isMarketActive = activemarket
  
  return (
    <TouchableOpacity 
      onPress={() => isMarketActive && onPlayClick(market)}
      style={[
        styles.gametable, 
        { backgroundColor: isMarketActive ? '#77c37a' : '#FF3333' }
      ]}
    >
      <View style={styles.marketHeader}>
      <Text style={isMarketActive ? styles.marketTitleActive : styles.marketTitleInactive}>
        {market.market}
      </Text>
        <View style={styles.marketDetailsContainer}>
          {[
            { label: 'Open Time', value: ConvertTime(market.open_time) },
            { label: 'Close Time', value: ConvertTime(market.close_time) },
            { label: 'Result Time', value: ConvertTime(market.result_time) },
            { 
              label: 'Previous Time', 
              value: market.latest_result?.created_at.slice(0, 10) ===
                          getTodayDate()
                            ? market.previous_result?.bet_key
                              ? market.previous_result.bet_key
                                  .toString()
                                  .padStart(2, "0")
                              : "XX"
                            : market.latest_result?.bet_key
                            ? market.latest_result.bet_key
                                .toString()
                                .padStart(2, "0")
                            : "XX",
              style: { color: '#E26928' }
            },
            { 
              label: 'Today Result', 
              value: market.latest_result?.created_at.slice(0, 10) ===
              getTodayDate()
                ? market.latest_result?.bet_key
                  ? market.latest_result.bet_key
                      .toString()
                      .padStart(2, "0")
                  : "XX"
                : "XX",
              style: { 
                backgroundColor: 'green', 
                color: '#ffffff',
                fontWeight: '900',
                padding: 5 
              }
            }
          ].map((item, index) => (
            <View key={index}>
              <Text style={[styles.marketDetailLabel, item.style]}>{item.label}</Text>
              <Text style={[styles.marketDetailValue, item.style]}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Main HomeScreen Component
const HomeScreen: React.FC = () => {
  const navigation:any = useNavigation();
  const { width } = useWindowDimensions();

  // State Management
  const [mobile, setMobile] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [isMenuVisible, setMenuVisibility] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleWhatsApp, setModalVisibleWhatsApp] = useState<boolean>(false);

  // Hooks
  const playerInfo = usePlayerDataFetch(mobile);
  const {refetch} = usePlayerDataFetch(mobile);
  const { wallet } = useWallet();
  const { markets } = useMarkets();
  const { home } = useHome();
  const { latestResult } = useLatestResult();

  // Fetch Mobile and Update Player Info
  useEffect(() => {
    const initializeMobile = async () => {
      const fetchedMobile = await fetchMobile(setMobile);
      if (fetchedMobile && mobile) {
        // playerInfo.mutate({ mobile: fetchedMobile });
        refetch()
      }
    };
    initializeMobile();
  }, []);

  // Play Click Handler with KYC Check
  const onPlayClick = (market: Market) => {
    setLoader(true);
  
    const buttonText = getButtonText(playerInfo); // Get the status message
  
    if (buttonText === 'KYC Verified!') {
      navigation.navigate('MoringStarScreen', { market });
    } else {
      // setModalVisible(true);
      Toast.show(buttonText, Toast.LONG); // Show the appropriate message
    }
  
    setLoader(false);
  };
  

  // Render Methods
  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <View style={styles.quickActionColumn}>
        <View style={{marginBottom: 15}}>
        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
          <Text style={styles.callBtn}>Deposit</Text>
          <View style={styles.callBtnIcon}>
            <Ionicons
              name="logo-whatsapp"
              size={22}
              color="green"
            />
          </View>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('WithdrawChat')}>
          <Text style={styles.callBtn}>Withdraw</Text>
          <View style={styles.callBtnIcon}>
          <Ionicons
              name="logo-whatsapp"
              size={22}
              color="green"
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../images/app_ic.png')}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.quickActionColumn}>
        <View style={{marginBottom: 15}}>
        <TouchableOpacity 
          style={styles.Btn}
          onPress={() => navigation.navigate('AllGameScreen')}
        >
          <Text style={styles.primaryBtn}>Other Game</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
      <View style={styles.container}>
        <Header
          page={'Home'}
          setMenuVisibility={setMenuVisibility}
          isMenuVisible={isMenuVisible}
        />

        <View style={styles.contentContainer}>
          <Navbar
            navigation={navigation}
            isMenuVisible={isMenuVisible}
            modalVisibleWhatsApp={modalVisibleWhatsApp}
            setModalVisibleWhatsApp={setModalVisibleWhatsApp}
          />

<ScrollView 
            style={styles.fullScreenScrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableWithoutFeedback>
              <View>
            <WalletPoints />
            {renderQuickActions()}

            {/* Greeting Banner */}
            <RenderHtml
              contentWidth={width}
              source={{html: home?.greeting_banner || '<p></p>'}}
              tagsStyles={{
                h6: {
                  fontSize: 16,
                  margin: 0,
                  paddingVertical: 6,
                  textAlign: 'center',
                  fontWeight: '300',
                  color: 'black',
                },
              }}
            />

            {/* Latest Result Section */}
            <View style={styles.latestResultContainer}>
              <Text style={styles.resultTitle}>{latestResult?.market_name} Result</Text>
              <Text style={styles.resultNumber}>{latestResult?.bet_key}</Text>
            </View>

             {/* New External Link Section */}
          <View style={styles.externalLinkContainer}>
            <View style={styles.externalLinkTitleContainer}>
              <View style={styles.fireSideImage}>
              <Image
                source={require('../images/fire.png')}
                />
                </View>
              <Text style={styles.externalLinkTitle}>
                सबसे पहले रिजल्ट देखने के लिए क्लिक करें
              </Text>
              <View style={styles.fireSideImage}>
              <Image
                source={require('../images/fire.png')}
                />
                </View>
            </View>
            <View style={styles.externalLinkButtonContainer}>
              <TouchableOpacity
                style={styles.Btn}
                onPress={() =>
                  Linking.openURL(
                    'https://bgmgame.in/',
                  ).catch(err =>
                    console.error("Couldn't load page", err)
                  )
                }
              >
                <Text style={styles.secondaryBtn}>Click Link</Text>
                <View style={styles.bottomBorder} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={{marginTop: 20}}>
            <View
              style={styles.liveresultouterwrapper}>
              <Text
                style={styles.liveresultcontainer}>
                BGM Game Live Result Of {getTodayDate()}
              </Text>
            </View>
          </View>
          

            {/* Markets Section */}
          <View>
          {markets?.filter((market: Market) => market.status).map((market: Market) => (
            <MarketItem 
              key={market.id} 
              market={market} 
              onPlayClick={onPlayClick} 
            />
          ))}
          </View>


            <WelcomeModal visible={false} onClose={() => {}} />
            </View>
              </TouchableWithoutFeedback>
          </ScrollView>
        </View>

        {/* Modals */} 
        <ContactModal 
          visible={modalVisibleWhatsApp}
          onClose={() => setModalVisibleWhatsApp(false)}
        />
        <KycModal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          setModalVisible={setModalVisible}
          playerData= {playerInfo}
          mobile={mobile}
        />
        <Loader visiblity={loader} />

        {isMenuVisible && (
          <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
            <Animated.View style={styles.menuOverlay} />
          </TouchableWithoutFeedback>
        )}

        <NavFooter />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  container: { flex: 1, backgroundColor: '#ffffff' },
  contentContainer: { flex: 1, flexDirection: 'row' },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 0
  },
  quickActionsContainer: {
    backgroundColor: '#E1EFE6',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  quickActionColumn: { width: '36%' },
  logoContainer: { 
    width: '28%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  logoImage:{
    height: 70, 
    width: 70,
  },
  gametable: { 
    marginBottom: 10 
  },
  marketHeader: { 
    backgroundColor: '#77c37a', 
    padding: 10 
  },
  marketDetailsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10
  },
  marketTitleActive: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketTitleInactive: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketDetailLabel: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center'
  },
  marketDetailValue: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center'
  },
  latestResultContainer: {
    backgroundColor: '#ECECEC',
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 4,
    borderColor: 'darkgreen'
  },
  resultTitle: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500'
  },
  resultNumber: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 24
  },
  fullScreenScrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  marketsContainer: {
    paddingHorizontal: 10, 
  },
});

export default HomeScreen;