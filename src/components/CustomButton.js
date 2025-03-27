import {View, Text, TouchableOpacity} from 'react-native';
import COLORS from './COLORS';

const CustomButton = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{width: '100%'}}>
      <View
        style={{
          width: '100%',
          height: 35,
          backgroundColor: COLORS.black,
          borderRadius: 90,
        }}>
        <View
          style={{
            width: '100%',
            height: 35,
            backgroundColor: COLORS.app_color,
            borderRadius: 90,
            marginTop: -5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              padding: 8,
              backgroundColor: '#4CB050',
              borderRadius: 40,
              color: 'white',
              zIndex: 2,
              position: 'relative',
              minWidth: 100,
              fontWeight: '500',
            }}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
