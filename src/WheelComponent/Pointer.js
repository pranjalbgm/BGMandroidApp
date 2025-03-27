import React from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const Pointer = () => {
  const pointerStyle = {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    position: 'absolute',
    top: 140,
    left: 140,
  };

  return <View style={pointerStyle} />;
};

export default Pointer;
