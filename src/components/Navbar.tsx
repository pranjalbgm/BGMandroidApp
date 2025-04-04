import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ImageBackground,
  Linking,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import appStyles from '../styles/appStyles';
import {getData, removeData} from '../constants/storage';
import {fetchMobile} from '../hooks/useWallet';
import {useGameSettings, usePlayerData} from '../hooks/useHome';
import {Modal} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {TextInput} from 'react-native';
import {BaseURLCLUB} from '../constants/api-client';
import {showAlert} from './Alert';
import {useVerifyAadhaar, useVerifyPan} from '../hooks/useAddKYC';
import Loader from './Loader';
import Toast from 'react-native-simple-toast';
import KycModal from './KycModal';
import SpinAndEarn from './SpinAndEarnModel';
import ReferAndEarn from './ReferAndEarn';
import NavHeader from './NavHeader';
import NavMenuItem from './NavbarSeperateComponent/NavMenuItem';
import NavSocialLinks from './NavbarSeperateComponent/NavSocialLinks';


const Navbar = ({
  navigation,
  isMenuVisible,
  modalVisibleWhatsApp,
  setModalVisibleWhatsApp,
  modelVisibleSpin,
}: any) => {
  // =========> States
  const [mobile, setMobile] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modalVisibleSpin, setModalVisibleSpin] = useState(false);
  const [modalVisibleRefer, setModalVisibleRefer] = useState(false);
  const gameSetting = useGameSettings();
  const playerData = usePlayerData()
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  
  const closeModalSpin = () => {
    setModalVisibleSpin(false);
    console.log('yes this is clicked from navbar');
  };
 
  useEffect(() => {
    fetchMobile(setMobile);
  }, []);

  useEffect(() => {
    if (mobile) {
      playerData.mutate({ mobile });
    }
  }, [mobile]);
  // =========> Log Player OUT
  const handleLogout = async () => {
    await removeData('user');
    await removeData('token');
    const userAfterRemoval = await getData('user');
    console.log('User after removal:', userAfterRemoval);
    navigation.navigate('MpinScreen');
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(menuAnimation, {
        toValue: isMenuVisible ? 1 : 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: isMenuVisible ? 0.5 : 0, // Adjust the opacity value as needed
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isMenuVisible, menuAnimation, backgroundOpacity]);

  const menuSlide = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const menuItems = [
          {
            icon: <AntDesign name="mobile1" size={22} color="#023020" />,
            title: 'App Details',
            subtitle: null,
            onPress: () => navigation.navigate('AppDetailsScreen'),
          },
          {
            icon: <AntDesign name="lock" size={22} color="#023020" />,
            title: 'Change Mpin',
            subtitle: 'यहां से अपना MPIN बदलें।',
            onPress: () => navigation.navigate('EditMpin'),
          },
          {
            icon: <AntDesign name="lock" size={22} color="#023020" />,
            title: 'Add New Bank Page',
            subtitle: 'यहां से अपना MPIN बदलें।',
            onPress: () => navigation.navigate('AddNewBankPage'),
          },
          {
            icon: <MaterialCommunityIcons name="history" size={22} color="#023020" />,
            title: 'My Play History',
            subtitle: 'अपनी खेली हुई गेम देखने के लिए यहाँ दबाये।',
            onPress: () => navigation.navigate('DatewisePlayHistory'),
          },
          {
            icon: <AntDesign name="star" size={22} color="#023020" />,
            title: 'Game Post',
            subtitle: 'गेम की गैसिंग देखने के लिए यहां दबाए।',
            onPress: () => navigation.navigate('GamePostPage'),
          },
          {
            icon: <AntDesign name="bulb1" size={22} color="#023020" />,
            title: 'Tips And Tricks',
            subtitle: 'गेम की गैसिंग देखने के लिए यहां दबाए।',
            onPress: () => navigation.navigate('TipsAndTricks'),
          },
          {
            icon: <AntDesign name="gift" size={22} color="#023020" />,
            title: 'Bonus Report',
            subtitle: 'अपनी गेम का कमीशन देखने के लिए यहाँ दबाये |',
            onPress: () => navigation.navigate('BonusReportScreen'),
          },
          {
            icon: <MaterialIcons name="list-alt" size={22} color="#023020" />,
            title: 'Result History',
            subtitle: 'गेम का रिजल्ट देखने के लिए यहाँ दबाये',
            onPress: () => navigation.navigate('ResultHistoryScreen'),
          },
          {
            icon: <Octicons name="checklist" size={22} color="#023020" />,
            title: 'Terms And Condition',
            subtitle: null,
            onPress: () => navigation.navigate('TermsConditionScreen'),
          },
          {
            icon: <MaterialIcons name="share" size={22} color="#023020" />,
            title: 'Refer and Earn',
            subtitle: 'रेफर करें और स्पिन कमाएं।',
            onPress: () => setModalVisibleRefer(true),
          },
          {
            icon: <MaterialIcons name="rocket" size={22} color="#023020" />,
            title: 'Spin and Win',
            subtitle: 'स्पिन करें इनाम जीते।',
            onPress: () => setModalVisibleSpin(true),
          }
        ];

  const handleSocialLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <Animated.View style={[styles.menu, {left: menuSlide}]}>
      <ImageBackground
        source={require('../images/bg-img.png')}
        style={styles.backgroundImage}
        >
        <NavHeader
         mobile={mobile} 
         playerData={playerData}
         onKycPress={() => setModalVisible(true)}
         />
      </ImageBackground>

      <ScrollView>
      {menuItems.map((item, index) => (
          <NavMenuItem 
            key={index} 
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            onPress={item.onPress}
          />
        ))}

        <TouchableOpacity
          style={[
            styles.menuItem,
            {backgroundColor: '#4CB050', marginBottom: 15, borderRadius: 20},
          ]}
          onPress={() => handleLogout()}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <MaterialIcons name="logout" size={22} color="#ffffff" />
            </Text>
            <Text style={{fontSize: 16, color: '#ffffff', width: '70%'}}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>

        <NavSocialLinks 
          gameSetting={gameSetting} 
          onWhatsapp={() => handleSocialLink(gameSetting.data.contact_links.whatsapp_link)}
          onInstagram={() => handleSocialLink(gameSetting.data.contact_links.instagram)}
          onFacebook={() => handleSocialLink(gameSetting.data.contact_links.facebook)}
        />
        {/* <View style={{marginBottom: 20, marginTop: 20}}>
          <TouchableOpacity>
            <Text
              style={{
                color: '#4CB050',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              www.thebgmgame.com
            </Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>

      <ReferAndEarn
        visible={modalVisibleRefer}
        setModalVisibleRefer={setModalVisibleRefer}
      />
      <SpinAndEarn
        visible={modalVisibleSpin}
        closeModalSpin={closeModalSpin}
        setModalVisibleSpin={setModalVisibleSpin}
      />
      {/* kyc modal */}
      <KycModal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        setModalVisible={setModalVisible}
        mobile={mobile}
        playerData={playerData}
      />

      <Loader visiblity={loader} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});
export default Navbar;
