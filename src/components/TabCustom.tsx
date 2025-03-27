import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appStyles from '../styles/appStyles';
import JodiGame from '../screens/JodiGame';
import ManualGame from '../screens/ManualGame';
import HarrafGame from '../screens/HarrafGame';
import CrossingGame from '../screens/CrossingGame';
import CopyPasteGame from '../screens/CopyPasteGame';

const TabCustom = ({navigation, market, apiData, screenType}: any) => {
  //----------Tabs----------//
  const [navTabHome, setNavTab] = useState(false);
  const [navTabHomeName, setNavTabName] = useState('Tab1');
  const navTabHomeFunc = async (tabName: any) => {
    setNavTab(true);
    setNavTabName(tabName);
    screenType(tabName);
  };

  useEffect(() => {
    if(market){

      screenType(navTabHomeName);
    }
    console.log("this is tab custom ----------------------------true")
  }, [market]);

  const apiDataFun = (data: any) => {
    apiData(data);
  };

  const screenTypeFun = (data: any) => {
    // screenType(data);
  };

  //----------End----------//

  return (
    <View>
      <ScrollView horizontal contentContainerStyle={styles.customTab}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            // {minWidth: '17%'},
            navTabHomeName === 'Tab1' && styles.activeTabItem,
          ]}
          onPress={() => navTabHomeFunc('Tab1')}>
          <Text
            style={[
              styles.tabText,
              navTabHomeName === 'Tab1' && styles.activeTabText,
            ]}>
            Jodi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            // {minWidth: '17%'},
            navTabHomeName === 'Tab2' && styles.activeTabItem,
          ]}
          onPress={() => navTabHomeFunc('Tab2')}>
          <Text
            style={[
              styles.tabText,
              navTabHomeName === 'Tab2' && styles.activeTabText,
            ]}>
            Manual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            // {minWidth: '17%'},
            navTabHomeName === 'Tab3' && styles.activeTabItem,
          ]}
          onPress={() => navTabHomeFunc('Tab3')}>
          <Text
            style={[
              styles.tabText,
              // {minWidth: '17%'},
              navTabHomeName === 'Tab3' && styles.activeTabText,
            ]}>
            Harraf
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            // {minWidth: '17%'},
            navTabHomeName === 'Tab4' && styles.activeTabItem,
          ]}
          onPress={() => navTabHomeFunc('Tab4')}>
          <Text
            style={[
              styles.tabText,
              navTabHomeName === 'Tab4' && styles.activeTabText,
            ]}>
            Crossing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            // {minWidth: '20%'},
            navTabHomeName === 'Tab5' && styles.activeTabItem,
          ]}
          onPress={() => navTabHomeFunc('Tab5')}>
          <Text
            style={[
              styles.tabText,
              navTabHomeName === 'Tab5' && styles.activeTabText,
            ]}>
            Copy Paste
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.customTabContant}>
        <JodiGame
          navTabHomeName={navTabHomeName}
          market={market}
          apiData={apiDataFun}
          screenType={screenTypeFun}
        />

        <ManualGame
          navTabHomeName={navTabHomeName}
          market={market}
          apiData={apiDataFun}
          screenType={screenTypeFun}
        />

        <HarrafGame
          navTabHomeName={navTabHomeName}
          market={market}
          apiData={apiDataFun}
          screenType={screenTypeFun}
        />

        <CrossingGame
          navTabHomeName={navTabHomeName}
          market={market}
          screenType={screenTypeFun}
        />

        <CopyPasteGame
          navTabHomeName={navTabHomeName}
          market={market}
          screenType={screenTypeFun}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default TabCustom;
