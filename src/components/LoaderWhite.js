import {ActivityIndicator, View, Text} from 'react-native';
import COLORS from './COLORS';

const LoaderWhite = ({visiblity}) => {
  return visiblity ? (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        flex: 1,
        height: '100%',
        width: '100%',
        marginTop: 80,
      }}>
      <View
        style={{
          height: 70,
          width: '85%',
          backgroundColor: COLORS.white,
          elevation: 10,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <ActivityIndicator
          size={'large'}
          color={COLORS.app_color}
          style={{marginStart: 20}}
        />
        <Text style={{fontSize: 15, marginStart: 10, color: COLORS.black}}>
          Loading..
        </Text>
      </View>
    </View>
  ) : null;
};
export default LoaderWhite;
