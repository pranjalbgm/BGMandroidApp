import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet 
} from 'react-native';

const ContactModal = ({ visible, onClose }) => {
  const socialPlatforms = [
    { name: 'Whatsapp', icon: require('../../images/whatsapp.png') },
    { name: 'Instagram', icon: require('../../images/instagram.png') },
    { name: 'Facebook', icon: require('../../images/facebook.png') },
    { name: 'Chrome', icon: require('../../images/chrome.png') },
    { name: 'Opera', icon: require('../../images/opera.png') }
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.platformContainer}>
              {socialPlatforms.map((platform, index) => (
                <View key={index} style={styles.platformItem}>
                  <TouchableOpacity>
                    <View style={styles.circleBtn}>
                      <Image 
                        source={platform.icon} 
                        style={styles.iconImage} 
                      />
                    </View>
                    <Text style={styles.platformName}>
                      {platform.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    height: 350,
    width: '100%',
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15
  },
  platformContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20
  },
  platformItem: {
    width: '32%',
    marginVertical: 8,
    alignItems: 'center'
  },
  circleBtn: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  platformName: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
    paddingTop: 5
  },
  cancelButtonContainer: {
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    padding: 15
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500'
  }
});

export default ContactModal;