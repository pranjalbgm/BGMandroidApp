import React, { useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appStyles from '../styles/appStyles';

const InsufficientBalance = ({showModal, setShowModal}: any) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
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
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closebutton}>
              <Text style={styles.textIcon}>
                <AntDesign name="close" size={24} color={'#707070'} />
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <View style={{padding: 20}}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 15,
                  }}>
                  <Ionicons
                    name="information-circle"
                    size={80}
                    color={'#ff000090'}
                  />
                </Text>

                <Text
                  style={{
                    color: '#000000',
                    fontWeight: '500',
                    textAlign: 'center',
                    fontSize: 18,
                  }}>
                  You Dont Have Sufficient Balance
                </Text>

                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 20,
                  }}>
                  <View style={{width: '48%'}}>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={() => setShowModal(false)}>
                      <Text style={styles.primaryBtn}>Ok</Text>
                      <View style={styles.bottomBorder} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default InsufficientBalance;
