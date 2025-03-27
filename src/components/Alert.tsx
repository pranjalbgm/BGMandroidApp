import React from 'react';
import {View, StyleSheet, Button, Alert} from 'react-native';

export const showAlert = (title: string, message?: string, isSuccess = false) =>
  Alert.alert(title, message);
