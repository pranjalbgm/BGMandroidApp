import React, { useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import appStyles from '../styles/appStyles';
import useWallet from '../hooks/useWallet';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {getData} from '../constants/storage';
import axios from 'axios';
import {BaseURLCLUB} from '../constants/api-client';
import TextTicker from 'react-native-text-ticker';
import useHome from '../hooks/useHome';

const WalletPoints = ({page, isMenuVisible, setMenuVisibility}: any) => {
  const {wallet, isLoading, refetchWallet} = useWallet();
  const navigation = useNavigation();
  const {home} = useHome();

  const onRefresh = () => {
    refetchWallet();
    if (page == 'Home') {
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#001C0D',
        padding: 15,
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 2,
        }}>
        <TextTicker
          style={{
            color: '#ffffff',
            alignSelf: 'center',
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
      <View
        style={{
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'space-around',
          paddingTop: 10,
        }}>
        <Text style={{color: '#ffffff', alignSelf: 'flex-start'}}>
          Win Point :{wallet?.winning}
        </Text>
        <Text style={{color: '#ffffff'}}>
          Total Point :{wallet?.total_amount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default WalletPoints;
