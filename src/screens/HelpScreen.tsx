import React, {useState, useRef} from 'react';
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
  useWindowDimensions,
  LogBox,
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
import useHome from '../hooks/useHome';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import useHelp from '../hooks/useHelp';
import RenderHTML from 'react-native-render-html';
import Video, {VideoRef} from 'react-native-video';
import {imageApiClient} from '../constants/api-client';

const HelpScreen = ({navigation}: any) => {
  const [modalVisibleHelp, setModalVisibleHelp] = useState(false);
  const [modalVisibleWhatsApp, setModalVisibleWhatsApp] = useState(false);
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const {width} = useWindowDimensions();

  const {help} = useHelp();
  const {home} = useHome();

  const videoRef = useRef<VideoRef>(null);

  const content = {
    html: help?.content || '<p></p>',
  };

  const videos =
    help && help.video
      ? [1, 2, 3, 4, 5].map(num => help?.video[`video${num}`])
      : [];

  const video = require('../images/bbjDeposit.mp4');

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          <Header
            page={'Help'}
            setMenuVisibility={setMenuVisibility}
            isMenuVisible={isMenuVisible}
          />

          <View style={{flex: 1, flexDirection: 'row'}}>
            <Navbar
              navigation={navigation}
              isMenuVisible={isMenuVisible}
              modalVisibleWhatsApp={modalVisibleWhatsApp}
              setModalVisibleWhatsApp={setModalVisibleWhatsApp}
              modalVisibleHelp={modalVisibleHelp}
              setModalVisibleHelp={setModalVisibleHelp}
            />

            <ScrollView style={styles.scrollView}>
              <TouchableWithoutFeedback>
                <View>
                  <View style={{paddingBottom: 80}}>
                    <View style={{backgroundColor: '#004225', padding: 20}}>
                      <TextTicker
                        style={{
                          color: '#ffffff',
                          textAlign: 'center',
                          fontWeight: '500',
                        }}
                        duration={8000}
                        loop
                        bounce
                        repeatSpacer={50}
                        marqueeDelay={2500}>
                        {home?.ticker}
                      </TextTicker>
                    </View>

                    <RenderHTML
                      contentWidth={width}
                      source={content}
                      tagsStyles={{
                        p: {
                          fontSize: 18,
                          color: 'black',
                          paddingHorizontal: 6,
                          textAlign: 'center',
                        },
                        div: {
                          marginTop: 10,
                        },
                      }}
                    />

                    {videos.length > 0 ? (
                      <ScrollView>
                        {videos?.map(
                          vid =>
                            vid && (
                              <View style={{height: 200}}>
                                <Video
                                  key={vid}
                                  ref={videoRef}
                                  controls={true}
                                  paused={true}
                                  allowsExternalPlayback={true}
                                  style={{
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                  }}
                                  // source={{ uri: imageApiClient + vid }}
                                  source={video}
                                  onError={(error: string) =>
                                    console.log('Video error:', error)
                                  }
                                />
                              </View>
                            ),
                        )}
                      </ScrollView>
                    ) : (
                      <View>
                        <Text>Loading...</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.chatFix}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              bottom: 0,
              // left: 0,
              paddingBottom: 10,
              right: 0,
              zIndex: 10,
            }}>
            <TouchableOpacity onPress={() => setModalVisibleHelp(true)}>
              <View
                style={{
                  width: 55,
                  height: 55,
                  backgroundColor: 'green',
                  borderRadius: 100,
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'green',
                  elevation: 5,
                }}>
                <Text>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={30}
                    color="#ffffff"
                  />
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleHelp}
            onRequestClose={() => setModalVisibleHelp(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  height: 350,
                  width: '100%',
                  borderTopEndRadius: 15,
                  borderTopLeftRadius: 15,
                }}>
                <View style={styles.centeredView}>
                  <ScrollView>
                    <View style={styles.modalView}>
                      <View style={styles.box}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('WithdrawChat')}>
                          <Text style={styles.buttonText}>Admin</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>
                          पैसे निकालने मैं अगर कोई समस्या है तो withdraw chat पे
                          क्लिक करे।
                        </Text>
                      </View>
                      <View style={styles.box}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('ChatScreen')}>
                          <Text style={styles.buttonText}>Support</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>
                          पैसे ऐड करने मैं अगर आपको समस्या है तो deposit chat पे
                          क्लिक करे।
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                </View>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: '#cccccc',
                    padding: 15,
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisibleHelp(false)}
                    style={styles.button}>
                    <Text style={styles.text}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    flexDirection: 'column',
  },
  modalView: {
    width: 380,
    height: 220,
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: 15,
    textAlign: 'center',
  },
  buttonText: {
    textAlign: 'center',
    backgroundColor: 'darkgreen',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    color: '#ffffff',
  },

  box: {
    width: 150,
    textAlign: 'center',
  },
});
export default HelpScreen;
