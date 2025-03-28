import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  Modal,
  Linking,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import NavFooter from '../components/NavFooter';
import TextTicker from 'react-native-text-ticker';
import appStyles from '../styles/appStyles';
import useMarkets from '../hooks/useMarkets';
import {isTimeNotPassed} from '../utils/time';
import useHome, {usePlayerData, usePlayerDataFetch} from '../hooks/useHome';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import {useVerifyAadhaar, useVerifyPan} from '../hooks/useAddKYC';
import apiClient, {BaseURLCLUB} from '../constants/api-client';
import {showAlert} from '../components/Alert';
import {fetchMobile} from '../hooks/useWallet';
import Loader from '../components/Loader';
import DocumentPicker from 'react-native-document-picker';
import {ImageStyle, TextStyle} from 'react-native';
import Toast from 'react-native-simple-toast';
import KycModal from '../components/KycModal';
import { getButtonText } from '../utils/KycUtils';

const AllGameScreen = ({navigation}: any) => {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [modalVisibleWhatsApp, setModalVisibleWhatsApp] = useState(false);
  const [modalVisibleReferAndEarn, setModalReferAndEarn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [navTabsHomeName, setNavTabsHomeName] = useState('IdProof');
  const [mobile, setMobile] = useState('');
  const [loader, setLoader] = useState(false);
  // const playerInfo = usePlayerData();
const {refetch}= usePlayerDataFetch(mobile);
const playerInfo = usePlayerDataFetch(mobile);

  const {markets} = useMarkets();
  const {home} = useHome();

  interface Market {
    id: string;
    status: boolean;
    market: string;
    open_time: string;
    close_time: string;
  }

  //  useEffect(() => {
  //     fetchMobile(setMobile);
  //     refetch()
  //   }, []); 
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



    const onPlayClick = (market: Market) => {
      try {
        setLoader(true);
        const buttonText = getButtonText(playerInfo); 
        if (buttonText === 'KYC Verified!') {
          navigation.navigate('MoringStarScreen', { market });
        } else {
          // setModalVisible(true);
          Toast.show(buttonText, Toast.LONG); 
        }
      } catch (error) {
        console.error("Error in onPlayClick:", error);
        Toast.show('Something went wrong. Please try again.', Toast.LONG);
      } finally {
        setLoader(false);
      }
    };

    
 

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Header
            page={'Games'}
            setMenuVisibility={setMenuVisibility}
            isMenuVisible={isMenuVisible}
          />

          <View style={{flex: 1, flexDirection: 'row'}}>
            <Navbar
              navigation={navigation}
              isMenuVisible={isMenuVisible}
              modalVisibleWhatsApp={modalVisibleWhatsApp}
              setModalVisibleWhatsApp={setModalVisibleWhatsApp}
            />

            <ScrollView>
              <TouchableWithoutFeedback>
                <View>
                  <View style={{backgroundColor: 'white', padding: 20}} />
                  <View style={{marginTop: 0}}>
                    <View style={{backgroundColor: '#001C0D', padding: 20}}>
                      <Text
                        style={{color: 'white',textAlign: 'center',fontWeight: '800',fontSize: 20, }}>
                        All Games
                      </Text>
                    </View>

                    <View
                      style={{backgroundColor: 'white',padding: 20,display: 'flex',alignItems: 'center',justifyContent: 'space-between',flexDirection: 'row',}}>
                      <Text
                        style={{color: 'darkgreen',textAlign: 'left',fontWeight: '800',fontSize: 20,}}>
                        Market Name
                      </Text>
                      <Text
                        style={{color: 'darkgreen',textAlign: 'right',fontWeight: '800',}}>
                        Action
                      </Text>
                    </View>

                    <ScrollView scrollEnabled showsVerticalScrollIndicator>
                      <View>
                        {markets?.map(
                          (market: any) =>
                            market.status && (
                              <View
                                key={market.id}
                                style={{
                                  backgroundColor: '#E1EFE6',
                                  padding:20,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  marginBottom:10,
                                }}>
                                {market.market_status !== "Closed" ? (
                                  <>
                                    <View>
                                      <Text
                                        style={{
                                          fontSize: 15,
                                          color: '#000000',
                                          textAlign: 'left',
                                          fontWeight: '500',
                                        }}>
                                        {market.market}
                                      </Text>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        style={styles.Btn}
                                        onPress={() => onPlayClick(market)}>
                                        <Text style={styles.primaryBtn}>
                                          Play Games
                                        </Text>
                                        <View style={styles.bottomBorder} />
                                      </TouchableOpacity>
                                    </View>
                                  </>
                                ) : (
                                  <>
                                    <View>
                                      <Text
                                        style={{
                                          fontSize: 15,
                                          color: '#000000',
                                          textAlign: 'left',
                                          fontWeight: '500',
                                        }}>
                                        {market.market}
                                      </Text>
                                    </View>
                                    <View>
                                      <TouchableOpacity style={styles.Btn}>
                                        <Text style={styles.secondaryBtn}>
                                          Time Out
                                        </Text>
                                        <View style={styles.bottomBorder} />
                                      </TouchableOpacity>
                                    </View>
                                  </>
                                )}
                              </View>
                            ),
                        )}
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>

          {/* kyc modal */}
          <KycModal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            setModalVisible={setModalVisible}
            mobile={mobile}
            playerData={playerInfo}
          />
          {/* kyc modal */}

          <Loader visiblity={loader} />

          {isMenuVisible && (
            <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  {backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 0},
                ]}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
      </TouchableWithoutFeedback>

      <NavFooter />
    </>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default AllGameScreen;
