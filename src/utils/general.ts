import {Linking} from 'react-native';
import {showAlert} from '../components/Alert';

export const openURL = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  try {
    if (supported) {
      // Open the link
      await Linking.openURL(url);
    } else {
      showAlert("Can't open url", `Don't know how to open this URL: ${url}`);
    }
  } catch (error) {
    console.log(error);
  }
};
