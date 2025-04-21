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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import appStyles from '../styles/appStyles';
import {getData} from '../constants/storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      (async function getUserData() {
        var user = await getData('user');
        console.log('From Login Screen', user);
        // user !== null ? navigation.navigate('HomeScreen') : navigation.navigate('LoginScreen')

        if (user != null) {
          navigation.reset({index: 0, routes: [{name: 'HomeScreen' as never}]});
        } else {
          navigation.reset({index: 0, routes: [{name: 'LoginScreen'} as never]});
        }
      })();
    }, 1500);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff', padding: 20}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      />
      <ScrollView>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Image
            source={require('../images/app_ic.png')}
            style={[ {height: 140, width: 140}]}
          />
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Image source={require('../images/welcomeboard.png')} />
        </View>
      </ScrollView>
      {/* <View>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text
            style={{color: '#4CB050', textAlign: 'center', fontWeight: '500'}}>
            Skip
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default SplashScreen;
