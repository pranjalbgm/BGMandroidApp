// Page.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  Button,
  Image,
} from 'react-native';
import {useState} from 'react';
import {Link, useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';

const WelcomeModal = ({visible, onClose}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          onClose();
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: '#000000',
              minHeight: 250,
              width: '92%',
              borderTopEndRadius: 15,
              borderTopLeftRadius: 15,
              position: 'relative',
              borderRadius: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: -45,
              }}>
              <TouchableOpacity onPress={onClose} style={styles.closebutton}>
                <Text style={styles.textIcon}>
                  <AntDesign name="close" size={24} color={'#707070'} />
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View>
                <View style={{padding: 20}}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontWeight: '500',
                      textAlign: 'center',
                      lineHeight: 25,
                    }}>
                    बाबा जी एप्लिकेशन में आपको अगर कुछ भी प्रॉब्लम्स होती है या
                    कुछ समझ नहीं आता तो आप हमें तुरंत वत्स ऐप करे और हमसे सहायता
                    करे
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 20,
                    }}>
                    <View style={{width: '36%'}}>
                      <View>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#ffffff',
                            textAlign: 'center',
                            fontWeight: '500',
                          }}>
                          Whatsapp
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#ffffff',
                            textAlign: 'center',
                            fontWeight: '500',
                            paddingTop: 5,
                          }}>
                          6367529290
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: '28%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../images/comlogo.png')}
                        style={styles.logoimage}
                      />
                    </View>
                    <View style={{width: '36%'}}>
                      <View>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#ffffff',
                            textAlign: 'center',
                            fontWeight: '500',
                          }}>
                          Whatsapp
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#ffffff',
                            textAlign: 'center',
                            fontWeight: '500',
                            paddingTop: 5,
                          }}>
                          6367529290
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Image
                      source={require('../images/namaste.png')}
                      style={{marginRight: 5}}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#ffffff',
                        fontWeight: '500',
                      }}>
                      जय अघोरी बाबा की
                    </Text>
                    <Image
                      source={require('../images/namaste.png')}
                      style={{marginLeft: 5}}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  circleBtn: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 100,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    padding: 15,
  },
  iconimage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 0,
  },
  text: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  closebutton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 100,
    elevation: 5,
  },
  textIcon: {
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoimage: {
    // textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default WelcomeModal;
