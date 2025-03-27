import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';

interface DocumentPickerOptions {
  mediaType?: 'photo' | 'video' | 'mixed';
  maxWidth?: number;
  maxHeight?: number;
}

export const pickDocument = async (
  setImageFunction: (image: any) => void, 
  type: string = '0', 
  options: DocumentPickerOptions = {}
) => {
  try {
    const result = await launchImageLibrary({
      mediaType: options.mediaType || 'photo',
      includeBase64: false,
      maxHeight: options.maxHeight || 500,
      maxWidth: options.maxWidth || 500,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (result.errorMessage) {
      Toast.show(`Image picker error: ${result.errorMessage}`, Toast.LONG);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      
      // Validate file size (optional)
      if (selectedImage.fileSize && selectedImage.fileSize > 5 * 1024 * 1024) { // 5MB limit
        Toast.show('File size should be less than 5MB', Toast.LONG);
        return;
      }

      // Additional type-specific validations could be added here
      setImageFunction(selectedImage);
    }
  } catch (error) {
    console.error('Document picker error:', error);
    Toast.show('Error selecting document', Toast.LONG);
  }
};

// Optional: Add more specific document pickers if needed
export const pickProfileImage = (setImageFunction: (image: any) => void) => 
  pickDocument(setImageFunction, 'profile', { 
    mediaType: 'photo', 
    maxWidth: 500, 
    maxHeight: 500 
  });

export const pickAadharImage = (setImageFunction: (image: any) => void) => 
  pickDocument(setImageFunction, 'aadhar');