// Page.js
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import {RadioButton} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';

const FormInput = () => {
  const [text, setText] = useState('');
  const handleInputChange = inputText => {
    setText(inputText);
  };
  const [selectedValue, setSelectedValue] = useState('option1');
  const [isSelected, setSelection] = useState(false);
  const [checked, setChecked] = useState('first');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };
  return (
    <View>
      <View>
        <TextInput
          placeholder="Enter text here"
          onChangeText={handleInputChange}
          value={text}
        />
      </View>
      <View style={styles.container}>
        <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          style={styles.checkbox}
        />
        <Text style={styles.label}>Checkbox Example</Text>
      </View>
      <View>
        <View>
          <Text>Choose an option:</Text>
          <RadioButton.Group
            onValueChange={newValue => setChecked(newValue)}
            value={checked}>
            <View>
              <RadioButton.Item label="First" value="first" />
            </View>
            <View>
              <RadioButton.Item label="Second" value="second" />
            </View>
          </RadioButton.Group>
        </View>
        <Text>Selected option: {checked}</Text>
      </View>
      <View>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text>{isEnabled ? 'Enabled' : 'Disabled'}</Text>
      </View>
      <View style={styles.containerarea}>
        <TextInput
          style={styles.inputarea}
          multiline
          numberOfLines={4} // Set the number of lines to show initially
          placeholder="Type your text here"
          value={text}
          onChangeText={newText => setText(newText)}
        />
      </View>
      <View>
        <Picker
          selectedValue={selectedValue}
          onValueChange={itemValue => setSelectedValue(itemValue)}>
          <Picker.Item label="Option 1" value="option1" />
          <Picker.Item label="Option 2" value="option2" />
          <Picker.Item label="Option 3" value="option3" />
        </Picker>
        <Text>Selected value: {selectedValue}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  containerarea: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'stretch',
  },
  inputarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 150, // Set a fixed height if needed
  },
});
export default FormInput;
