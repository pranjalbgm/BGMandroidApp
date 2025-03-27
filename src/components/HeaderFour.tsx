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
const HeaderFour = ({title}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => navigation.goBack()}>
          <Text style={{color: '#000000', marginRight: 5}}>
            <AntDesign name="arrowleft" size={22} color={'#000000'} />
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.Btn}>
          <Text style={styles.primaryBtn}>Refresh</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity>
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
  Btn: {
    position: 'relative',
  },
  primaryBtn: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#4CB050',
    borderRadius: 40,
    color: 'white',
    zIndex: 2,
    position: 'relative',
    minWidth: 100,
    fontWeight: '500',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 40,
  },
});
export default HeaderFour;
