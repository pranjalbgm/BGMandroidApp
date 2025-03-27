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
const TabsModal = () => {
  //----------Modal----------//
  const [modalVisible, setModalVisible] = useState(false);
  //----------End----------//
  //----------Tabs----------//
  const [navTabsHomeName, setNavTabsHomeName] = useState('PersonalInfo');
  const navTabsHomeFunc = tabName => {
    setNavTabsHomeName(tabName);
  };
  //----------End----------//
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title="Open Full Screen Modal"
        onPress={() => setModalVisible(true)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  navTabsHomeName === 'PersonalInfo' && styles.activeTabItem,
                ]}
                onPress={() => navTabsHomeFunc('PersonalInfo')}>
                <Text
                  style={[
                    styles.tabText,
                    navTabsHomeName === 'PersonalInfo' && styles.activeTabText,
                  ]}>
                  Personal Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  navTabsHomeName === 'IdProof' && styles.activeTabItem,
                ]}
                onPress={() => navTabsHomeFunc('IdProof')}>
                <Text
                  style={[
                    styles.tabText,
                    navTabsHomeName === 'IdProof' && styles.activeTabText,
                  ]}>
                  Id Proof
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  navTabsHomeName === 'BankDetails' && styles.activeTabItem,
                ]}
                onPress={() => navTabsHomeFunc('BankDetails')}>
                <Text
                  style={[
                    styles.tabText,
                    navTabsHomeName === 'BankDetails' && styles.activeTabText,
                  ]}>
                  Bank Details
                </Text>
              </TouchableOpacity>
            </ScrollView>
            <ScrollView>
              <View style={styles.tabContentContainer}>
                {navTabsHomeName === 'PersonalInfo' && <View />}
                {navTabsHomeName === 'IdProof' && <View />}
                {navTabsHomeName === 'BankDetails' && <View />}
              </View>
            </ScrollView>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    minHeight: '50%',
    width: '100%',
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  tabItem: {
    padding: 15,
  },
  activeTabItem: {
    backgroundColor: '#e0e0e0',
  },
  tabText: {
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'blue',
  },
  tabContentContainer: {
    padding: 15,
  },
  modalButtonContainer: {
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    padding: 15,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
export default TabsModal;
