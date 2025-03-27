import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native';

interface NavSocialLinksProps {
  gameSetting: any;
  onWhatsapp: () => void;
  onInstagram: () => void;
  onFacebook: () => void;
}

const NavSocialLinks: React.FC<NavSocialLinksProps> = ({
  gameSetting,
  onWhatsapp,
  onInstagram,
  onFacebook,
}) => {
  return (
    <>
      <View style={styles.socialContainer}>
        <View style={styles.socialIconWrapper}>
          <TouchableOpacity onPress={onWhatsapp}>
            <Image
              source={require('../../images/whatsapp.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.socialIconWrapper}>
          <TouchableOpacity onPress={onInstagram}>
            <Image
              source={require('../../images/instagram.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.socialIconWrapper}>
          <TouchableOpacity onPress={onFacebook}>
            <Image
              source={require('../../images/facebook.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.websiteContainer}>
        <TouchableOpacity>
          <Text style={styles.websiteText}>
            www.thebgmgame.com
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  socialIconWrapper: {
    flexDirection: 'row',
    width: '32%',
    marginVertical: 8,
    justifyContent: 'center',
  },
  socialIcon: {
    // Add your icon styling here
    width: 40,
    height: 40,
  },
  websiteContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  websiteText: {
    color: '#4CB050',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default NavSocialLinks;