import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import appStyles from '../../styles/appStyles';

interface NavMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string | null;
  onPress: () => void;
}

const NavMenuItem: React.FC<NavMenuItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.menuItem, { marginBottom: 15 }]} 
      onPress={onPress}
    >
      <View style={styles.menuItemContainer}>
        <View style={styles.menuItemContent}>
          <View style={styles.iconWrapper}>
            {icon}
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.titleText}>{title}</Text>
            {subtitle && (
              <Text style={styles.subtitleText}>{subtitle}</Text>
            )}
          </View>
        </View>
        <Text style={styles.arrowText}>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
 ...appStyles,
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#E5F6DF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    marginLeft: 10,
  },
  titleText: {
    fontSize: 16,
    color: '#023020',
    fontWeight: '800',
  },
  subtitleText: {
    paddingTop: 6,
    color: '#023020',
    fontSize: 13,
  },
  arrowText: {
    fontSize: 18,
    color: '#023020',
  },
});

export default NavMenuItem;