// Page.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
const HeaderThree = ({title,onGoBack}) => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    
    if (onGoBack) {
      onGoBack();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeScreen'); 
    }
  };
  return (
    <View style={styles.header}>
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={handleGoBack}>
          <Text style={{color: '#000000', marginRight: 5}}>
            <AntDesign name="arrowleft" size={22} color={'#000000'} />
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E1EFE6',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 72,
    color: '#000000',
    elevation: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
});
export default HeaderThree;
