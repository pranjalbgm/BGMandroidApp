import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Image,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import HeaderThree from '../components/HeaderThree';
import NavFooter from '../components/NavFooter';
import appStyles from '../styles/appStyles';
import useTermsAndCondition from '../hooks/useTermsAndCondition';
import {RenderHTML} from 'react-native-render-html';

const TermsConditionScreen = () => {
  const {TermsAndCondition} = useTermsAndCondition();
  const {width} = useWindowDimensions();

  const heading = {
    html: TermsAndCondition?.heading || '<p>jkbhvghvu</p>',
  };
  const paragraph = {
    html: TermsAndCondition?.paragraph || '<p>rgtrhgrtghtgetrg</p>',
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderThree title={'Terms & Condition'} />
      <ScrollView>
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#cccccc',
          }}>
          {TermsAndCondition && (
            <RenderHTML
              contentWidth={width}
              source={heading}
              tagsStyles={{
                h6: {
                  fontSize: 18,
                  color: 'black',
                  marginVertical: 3,
                  paddingVertical: 6,
                  textAlign: 'center',
                },
              }}
            />
          )}
        </View>

        <View style={{padding: 20}}>
          {TermsAndCondition && (
            <RenderHTML
              contentWidth={width}
              source={paragraph}
              tagsStyles={{
                p: {
                  fontSize: 16,
                  margin: 0,
                  paddingVertical: 6,
                  color: 'black',
                },
                h1: {
                  margin: 0,
                  padding: 0,
                },
              }}
            />
          )}
        </View>
      </ScrollView>
      <NavFooter />
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default TermsConditionScreen;
