import React, {useState, useEffect} from 'react';
import {Animated, Easing, View} from 'react-native';
import Wheel from './Wheel';
import Pointer from './Pointer';

const WheelAnimator = () => {
  const [rotate, setRotate] = useState(new Animated.Value(0));
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const randomWinner = Math.floor(Math.random() * 10) + 1;
    setWinner(randomWinner);

    Animated.timing(rotate, {
      toValue: randomWinner * 36, // 36 degrees per section
      duration: 3000,
      easing: Easing.easeOut,
    }).start();
  }, []);

  return (
    <View>
      <Wheel />
      <Pointer style={{transform: [{rotate: rotate}]}} />
    </View>
  );
};

export default WheelAnimator;
