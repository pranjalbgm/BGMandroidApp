import {ActivityIndicator, View} from 'react-native';
import COLORS from './COLORS';

const Loader = ({visiblity}) => {
  return visiblity ? (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size={'large'} color={COLORS.app_color} />
    </View>
  ) : null;
};
export default Loader;
