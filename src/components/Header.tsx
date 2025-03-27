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

const Header = ({page, isMenuVisible, setMenuVisibility}: any) => {
  const {wallet, isLoading, refetchWallet} = useWallet();
  const navigation = useNavigation();
  const [isMenu, setMenu] = useState(true);

  const [key, setKey] = useState(0);

  // const onRefresh = () => {r
  //   // refetchWallet()
  //   console.log("this is clicked ")
  //   setKey((prevKey) => prevKey + 1)
  //   if (page == 'Home') {

  //   }
  // }

  const onRefresh = () => {
    const state = navigation.getState(); // Get the current navigation state
    if (state) {
      const currentRoute = state.routes[state.index]; // Safely access the current route
      if (currentRoute) {
        navigation.reset({
          index: 0,
          routes: [{name: currentRoute.name}], // Reload the same route
        });
      }
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={{
          backgroundColor: '#ffffff',
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 5,
        }}
        onPress={() => {
          setMenuVisibility(!isMenuVisible), setMenu(!isMenu);
        }}>
        <Text>
          {isMenu ? (
            <Octicons name="three-bars" size={22} color="#4CB050" /> // Hamburger menu icon
          ) : (
            <Octicons name="x" size={22} color="#4CB050" /> // Cross icon
          )}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: '#4CB050',
            marginHorizontal: 10,
            fontWeight: '500',
          }}>
          {page}
        </Text>
        <TouchableOpacity onPress={() => onRefresh()} style={styles.Btn}>
          <Text style={styles.primaryBtn}>Refresh</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity>
        <Text
          style={{
            color: 'darkgreen',
            marginHorizontal: 10,
            fontWeight: '500',
          }}>
          Points:
          <Text style={{color: 'darkgreen'}}>{wallet?.wallet}</Text>
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('NotificationScreen')}>
        <Text style={{color: '#ffffff'}}>
          <AntDesign name="bells" size={22} color={'#000000'} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default Header;
