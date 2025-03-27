import AsyncStorage from '@react-native-async-storage/async-storage';
import {showAlert} from '../components/Alert';

interface IData<T> {
  key: string;
  data: T;
}

export const storeData = async <T>(data: IData<T>) => {
  try {
    console.log('Storing data', data);

    const jsonData = JSON.stringify(data.data);
    await AsyncStorage.setItem(data.key, jsonData);
    //showAlert('Success!', 'Saved data in memory');
  } catch (error: any) {
    showAlert('Failed Saving!', error);
  }
};

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    if (jsonData !== null) {
      try {
        return JSON.parse(jsonData) as T;
      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        showAlert('Failed Retrieving!', 'Error parsing JSON data');
        return null;
      }
    } else {
      return null;
    }
  } catch (error: any) {
    showAlert('Failed Retrieving!', error);
    return null;
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Removed data for key: ${key}`);
    // showAlert('Success!', 'Removed data from memory');
    return null;
  } catch (error: any) {
    console.error(`Failed to remove data for key: ${key}`, error);
    showAlert('Failed Retrieving!', error);
    return null;
  }
};
