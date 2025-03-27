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
  TouchableWithoutFeedback,
} from 'react-native';
import {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import appStyles from '../styles/appStyles';

const GamePlayedSuccessfully = () => {
  //----------Modal----------//
  const [modalVisibleHistory, setModalVisibleHistory] = useState(false);

  const closeModal = () => {
    setModalVisibleHistory(false);
  };
  //----------End----------//

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <TouchableOpacity
          style={styles.Btn}
          onPress={() => setModalVisibleHistory(true)}>
          <Text style={styles.secondaryBtn}>Game</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleHistory}
        onRequestClose={() => setModalVisibleHistory(false)}>
        <TouchableWithoutFeedback onPress={closeModal}>
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
                minHeight: 200,
                width: '92%',
                borderTopEndRadius: 15,
                borderTopLeftRadius: 15,
                position: 'relative',
                borderRadius: 10,
              }}>
              <View>
                <View>
                  <View style={{padding: 20}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        paddingBottom: 20,
                      }}>
                      <AntDesign name="checksquare" size={36} color="#4CB050" />
                    </Text>

                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: '500',
                        textAlign: 'center',
                        fontSize: 20,
                      }}>
                      Game Played Successfully{'\n'}
                      Check in History
                    </Text>

                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingTop: 15,
                        paddingHorizontal: 30,
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: '500',
                        }}>
                        Market:
                      </Text>

                      <Text
                        style={{
                          color: '#999999',
                        }}>
                        Morning Star
                      </Text>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingTop: 15,
                        paddingHorizontal: 30,
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: '500',
                        }}>
                        Game:
                      </Text>

                      <Text
                        style={{
                          color: '#999999',
                        }}>
                        Jodi
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center', // Change 'flex-center' to 'center'
                      padding: 20,
                      borderTopWidth: 1, // Change 'borderwidthTop' to 'borderTopWidth'
                      borderTopColor: '#cccccc', // Change 'bordercolorTop' to 'borderTopColor'
                    }}>
                    <TouchableOpacity
                      style={styles.Btn}
                      onPress={() => setModalVisibleHistory(true)}>
                      <Text style={styles.primaryBtn}>Print</Text>
                      <View style={styles.bottomBorder} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default GamePlayedSuccessfully;
