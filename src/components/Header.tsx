import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import appStyles from '../styles/appStyles';
import useWallet from '../hooks/useWallet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define types for props
interface HeaderProps {
  page: string;
  isMenuVisible: boolean;
  setMenuVisibility: (visible: boolean) => void;
}

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  NotificationScreen: undefined;
};

const Header: React.FC<HeaderProps> = ({ page, isMenuVisible, setMenuVisibility }) => {
  const { wallet } = useWallet();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isMenu, setMenu] = useState<boolean>(true);

  const onRefresh = () => {
    const state = navigation.getState();
    if (state) {
      const currentRoute = state.routes[state.index];
      if (currentRoute) {
        navigation.reset({
          index: 0,
          routes: [{ name: currentRoute.name as keyof RootStackParamList }],
        });
      }
    }
  };

  const handleMenuToggle = () => {
    setMenuVisibility(!isMenuVisible);
    setMenu(!isMenu);
  };

  return (
    <View style={styles.header}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (isMenuVisible) {
            setMenuVisibility(false);
            setMenu(true);
          }
        }}
      >
        <View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleMenuToggle}
          >
            <Text>
              {isMenu ? (
                <Octicons name="three-bars" size={22} color="#4CB050" />
              ) : (
                <Octicons name="x" size={22} color="#4CB050" />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.centerContent}>
        <Text style={styles.pageText}>{page}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.Btn}>
          <Text style={styles.primaryBtn}>Refresh</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity>
        <Text style={styles.pointsText}>
          Points: <Text style={{ color: 'darkgreen' }}>{wallet?.wallet}</Text>
        </Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
        <AntDesign name="bells" size={22} color={'#000000'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  menuButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
  },
  centerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pageText: {
    color: '#4CB050',
    marginHorizontal: 10,
    fontWeight: '500',
  },
  pointsText: {
    color: 'darkgreen',
    marginHorizontal: 10,
    fontWeight: '500',
  },
});

export default Header;
