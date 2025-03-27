// Page.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect} from 'react';
import {Link, useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../styles/appStyles';

const NavFooter = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const oncuurentloction = route.name;
  const [activeScreen, setActiveScreen] = useState('HomeScreen');
  const handleNavigation = screenName => {
    setActiveScreen(screenName);
    navigation.navigate(screenName);
  };

  // Define your active and inactive icons
  // Define your active and inactive icons
  const activeIcons = {
    home: (
      <Ionicons
        name="home-sharp"
        size={22}
        color="#ffffff"
        style={{textAlign: 'center'}}
      />
    ),
    games: (
      <Ionicons
        name="game-controller"
        size={22}
        color="#ffffff"
        style={{textAlign: 'center'}}
      />
    ),
    wallet: (
      <Ionicons
        name="wallet"
        size={22}
        color="#ffffff"
        style={{textAlign: 'center'}}
      />
    ),
    help: (
      <Ionicons
        name="help-circle"
        size={22}
        color="#ffffff"
        style={{textAlign: 'center'}}
      />
    ),
  };

  const inactiveIcons = {
    home: (
      <Ionicons
        name="home-outline"
        size={22}
        color="#ffffff"
        style={{textAlign: 'center'}}
      />
    ),
    games: (
      <Ionicons
        name="game-controller-outline"
        size={22}
        color="#ffffff"
        style={{textAlign: 'center'}}
      />
    ),
    wallet: (
      <Ionicons
        name="wallet-outline"
        size={22}
        color="#ffffff"
        style={{textAlign: 'center'}}
      />
    ),
    help: (
      <MaterialCommunityIcons
        name="help-circle-outline"
        size={22}
        color="#ffffff"
        style={{textAlign: 'center'}}
      />
    ),
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={{padding: 15}}
        onPress={() => handleNavigation('HomeScreen')}>
        {oncuurentloction === 'HomeScreen'
          ? activeIcons.home
          : inactiveIcons.home}
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 3,
            color: oncuurentloction === 'HomeScreen' ? '#ffffff' : '#ffffff',
          }}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{padding: 15}}
        onPress={() => handleNavigation('AllGameScreen')}>
        {oncuurentloction === 'AllGameScreen'
          ? activeIcons.games
          : inactiveIcons.games}
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 3,
            color: oncuurentloction === 'AllGameScreen' ? '#ffffff' : '#ffffff',
          }}>
          Games
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{padding: 15}}
        onPress={() => handleNavigation('WalletAddAmountScreen')}>
        {oncuurentloction === 'WalletAddAmountScreen'
          ? activeIcons.wallet
          : inactiveIcons.wallet}
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 3,
            color:
              oncuurentloction === 'WalletAddAmountScreen'
                ? '#ffffff'
                : '#ffffff',
          }}>
          Wallet
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{padding: 15}}
        onPress={() => handleNavigation('HelpScreen')}>
        {oncuurentloction === 'HelpScreen' || oncuurentloction === 'ChatScreen'
          ? activeIcons.help
          : inactiveIcons.help}
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 3,
            color:
              oncuurentloction === 'HelpScreen' ||
              oncuurentloction === 'ChatScreen'
                ? '#ffffff'
                : '#ffffff',
          }}>
          Help
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default NavFooter;
