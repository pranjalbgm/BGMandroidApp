import React, {useState,  useRef} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import HeaderThree from '../components/HeaderThree';
import appStyles from '../styles/appStyles';
import useAppDetails from '../hooks/useAppDetails';

const AppDetailsScreen = () => {
  const navigation = useNavigation();
  const {details} = useAppDetails();
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderThree title={'App Details'} />
      <ScrollView>
        <View style={{padding: 20}}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <Image
              source={require('../images/comlogo.png')}
              style={styles.logoimageCenter}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ECECEC',
              padding: 20,
              marginBottom: 15,
              borderWidth: 2,
              borderColor: 'darkgreen',
            }}>
            <Text
              style={{
                color: '#000000',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              TM No : {details?.tm_no}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#ECECEC',
              padding: 20,
              marginBottom: 15,
              borderWidth: 2,
              borderColor: 'darkgreen',
            }}>
            <Text
              style={{
                color: '#000000',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              ISO Number: {details?.iso}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#ECECEC',
              padding: 20,
              marginBottom: 15,
              borderWidth: 2,
              borderColor: 'darkgreen',
            }}>
            <Text
              style={{
                color: '#000000',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              TAN : {details?.tan}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#ECECEC',
              padding: 20,
              marginBottom: 15,
              borderWidth: 2,
              borderColor: 'darkgreen',
            }}>
            <Text
              style={{
                color: '#000000',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              URN : {details?.urn}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#ECECEC',
              padding: 20,
              marginBottom: 15,
              borderWidth: 2,
              borderColor: 'darkgreen',
            }}>
            <Text
              style={{
                color: '#000000',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              GST: {details?.gst}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#ECECEC',
              padding: 20,
              marginBottom: 15,
              borderWidth: 2,
              borderColor: 'darkgreen',
            }}>
            <Text
              style={{
                color: '#000000',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              PAN: {details?.pan}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default AppDetailsScreen;
