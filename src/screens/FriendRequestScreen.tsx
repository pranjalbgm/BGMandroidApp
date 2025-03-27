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
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import HeaderFive from '../components/HeaderFive';
import NavFooter from '../components/NavFooter';
import HeaderThree from '../components/HeaderThree';
import appStyles from '../styles/appStyles';

const FriendRequestScreen = () => {
  const navigation = useNavigation();
  //----------Input Form----------//
  const [textInput1, setTextInput1] = useState('');
  //----------End----------//
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderThree title={'Friend Request'} />
      <ScrollView>
        <View style={{padding: 20}}>
          <View style={{marginBottom: 15}}>
            <Text
              style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
              Mobile Number
            </Text>
            <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
              <TextInput
                onChangeText={setTextInput1}
                value={textInput1}
                placeholder="Enter Mobile Number"
              />
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.Btn}>
              <Text style={styles.primaryBtn}>Send Request</Text>
              <View style={styles.bottomBorder} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <NavFooter />
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default FriendRequestScreen;
