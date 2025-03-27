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
import appStyles from '../styles/appStyles';

const FriendListScreen = () => {
  const navigation = useNavigation();
  //----------Input Form----------//
  const [textInput1, setTextInput1] = useState('');
  //----------End----------//
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderFive title={'Friend List'} />
      <ScrollView>
        <View style={{padding: 20}}>
          <View style={{marginBottom: 15}}>
            <Text
              style={{color: '#000000', marginBottom: 10, fontWeight: '500'}}>
              Search Friends
            </Text>
            <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15}}>
              <TextInput
                onChangeText={setTextInput1}
                value={textInput1}
                placeholder="Search Friend"
              />
            </View>
            <Text style={{color: '#000000', fontWeight: '500', marginTop: 10}}>
              Total Friend: 0
            </Text>
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
export default FriendListScreen;
