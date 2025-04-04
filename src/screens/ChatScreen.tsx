import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Platform,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ToastAndroid, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import { useNavigation } from '@react-navigation/native';

// Import using the correct method
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import DocumentPicker from 'react-native-document-picker';
import WithdrawDepositChatSocket from '../Sockets/WithdrawDepositChatSocket';
import { fetchMobile } from '../hooks/useWallet';
import { usePlayerDataFetch } from '../hooks/useHome';
import HeaderThree from '../components/HeaderThree';

const audioRecorderPlayer = new AudioRecorderPlayer();

const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
};

export const separateDateAndTime = (dateTimeString) => {
  if (!dateTimeString) {
    return { date: undefined, time: undefined };
  }

  let datePart, timePart;

  if (dateTimeString.includes('T')) {
    [datePart, timePart] = dateTimeString.split('T');
  } else if (dateTimeString.includes(' ')) {
    [datePart, timePart] = dateTimeString.split(' ');
  } else {
    return { date: dateTimeString, time: undefined };
  }

  return { date: datePart, time: timePart };
};

const ChatScreen = () => {
  const [mobile, setMobile] = useState(null);
  const playerInfo = usePlayerDataFetch();
  const {refetch} = usePlayerDataFetch();
  const { control, handleSubmit, reset } = useForm();
  const [audioFile, setAudioFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null); // Track the file type
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [messagesData, setMessagesData] = useState([]);
  const [initialScrollComplete, setInitialScrollComplete] = useState(false);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  
  const {
    selectUserChat,
    selectedUser,
    sendMessage,
    chatType,
    depositmessages,
  } = WithdrawDepositChatSocket();

  // Debug logging
  useEffect(() => {
    console.log("Deposit messages total count:", depositmessages?.length);
  }, [depositmessages]);

  // Set messages to local state to ensure we control rendering
  useEffect(() => {
    if (depositmessages && depositmessages.length > 0) {
      setMessagesData([...depositmessages]);
    }
  }, [depositmessages]);

  useEffect(() => {
    fetchMobile(setMobile);
  }, []);

  useEffect(() => {
    if (mobile) {
      selectUserChat(mobile, "deposit");
    }
  }, [mobile]);

  useEffect(() => {
    if (mobile && !playerInfo.isLoading && !playerInfo.isSuccess) {
      refetch();
    }
  }, [mobile]);

  useEffect(() => {
    if (playerInfo.isSuccess) {
      setPlayerData(playerInfo.data);
    }
  }, [playerInfo]);

  // Improved scroll to bottom logic with better delay
  const scrollToBottom = (animated = true) => {
    if (flatListRef.current && messagesData?.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated });
      }, 300); // Increased delay to ensure list is fully rendered
    }
  };

  // Call scrollToBottom when messages data changes
  useEffect(() => {
    if (messagesData?.length > 0) {
      scrollToBottom();
    }
  }, [messagesData]);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Chat app needs access to your microphone to record audio messages',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setMicrophonePermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error(err);
        return false;
      }
    } else {
      // For iOS permission is checked during recording
      setMicrophonePermission(true);
      return true;
    }
  };

  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      showToast('Microphone permission denied');
      return;
    }

    try {
      const audioPath = Platform.select({
        ios: 'sound.m4a',
        android: `${RNFS.CachesDirectoryPath}/sound.mp3`,
      });
      
      await audioRecorderPlayer.startRecorder(audioPath);
      audioRecorderPlayer.addRecordBackListener(() => {});
      
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
      showToast('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setAudioFile(result);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
      showToast('Failed to stop recording');
    }
  };

  const getFileExtension = (uri) => {
    return uri.split('.').pop().toLowerCase();
  };

  const getFileTypeFromUri = (uri) => {
    const extension = getFileExtension(uri);
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const videoExtensions = ['mp4', 'mov', 'webm'];
    const audioExtensions = ['mp3', 'm4a', 'aac', 'wav'];
    const documentExtensions = ['pdf', 'doc', 'docx'];
    
    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    if (audioExtensions.includes(extension)) return 'audio';
    if (documentExtensions.includes(extension)) return 'document';
    
    return 'unknown';
  };

  const fileToBase64 = async (uri) => {
    try {
      // Handle content:// or file:// URIs properly
      let fileUri = uri;
      
      // For Android content URI, might need to get the actual path
      if (Platform.OS === 'android' && uri.startsWith('content://')) {
        try {
          // This is a simplified approach - for a complete solution you might need
          // to use a library that can resolve content URIs to file paths
          const filePath = uri.replace('content://', '/storage/emulated/0/');
          if (await RNFS.exists(filePath)) {
            fileUri = filePath;
          }
        } catch (error) {
          console.log('Error resolving content URI:', error);
          // Fall back to the original URI
        }
      }
      
      return await RNFS.readFile(fileUri, 'base64');
    } catch (error) {
      console.error('Error converting file to base64:', error);
      showToast('Error processing file. Try another file.');
      return null;
    }
  };

  // Fixed image picker function
  const pickImage = async () => {
    try {
      // Using the correct method for image picker
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'mixed',
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8,
      });
      
      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      
      if (result.errorCode) {
        console.error('ImagePicker Error: ', result.errorMessage);
        showToast('Error selecting image: ' + result.errorMessage);
        return;
      }
      
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Selected file:', asset.uri);
        
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (asset.fileSize > MAX_FILE_SIZE) {
          showToast('File size exceeds 5MB limit');
          return;
        }
        
        // Determine file type from asset
        const type = asset.type ? asset.type.split('/')[0] : getFileTypeFromUri(asset.uri);
        setFileType(type);
        setSelectedFile(asset.uri);
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      showToast('Error selecting image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      
      const fileDetails = await RNFS.stat(result[0].uri);
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      
      if (fileDetails.size > MAX_FILE_SIZE) {
        showToast('File size exceeds 5MB limit');
        return;
      }
      
      setFileType('document');
      setSelectedFile(result[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error('Error picking document:', err);
        showToast('Error selecting document');
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileType(null);
  };

  const onSubmit = async (data) => {
    if (!data.text && !audioFile && !selectedFile) {
      showToast('Please enter a message, select an image, or record an audio.');
      return;
    }

    let fileBase64 = '';
    let audioBase64 = '';
    let fileMimeType = '';

    if (selectedFile) {
      // Get the file extension
      const extension = getFileExtension(selectedFile);
      
      // Determine the correct MIME type based on file extension
      const mimeTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        mp4: 'video/mp4',
        mov: 'video/quicktime',
        pdf: 'application/pdf',
      };
      
      fileMimeType = mimeTypes[extension] || 'application/octet-stream';
      
      try {
        fileBase64 = await fileToBase64(selectedFile);
        if (fileBase64) {
          fileBase64 = `data:${fileMimeType};base64,${fileBase64}`;
        } else {
          showToast('Error processing file');
          return;
        }
      } catch (error) {
        console.error('Error processing file:', error);
        showToast('Error processing file');
        return;
      }
    }
    
    if (audioFile) {
      try {
        audioBase64 = await fileToBase64(audioFile);
        if (audioBase64) {
          audioBase64 = `data:audio/mp3;base64,${audioBase64}`;
        } else {
          showToast('Error processing audio');
          return;
        }
      } catch (error) {
        console.error('Error processing audio:', error);
        showToast('Error processing audio');
        return;
      }
    }

    const getISTDate = () => {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      return new Date(now.getTime() + istOffset).toISOString();
    };

    const messageData = {
      mobile_id: mobile,
      message_by: 'User',
      seen: false,
      name: playerData?.name || ' ',
      text: data.text || '',
      file: fileBase64,
      audio: audioBase64,
      created_at: getISTDate(),
    };

    // For immediate UI feedback with proper preview
    const localMessageData = {
      ...messageData,
      // For local preview, we use the direct file URI
      _localFileUri: selectedFile,
      _localFileType: fileType,
      _localAudioUri: audioFile,
    };
    
    // Add the message to local state first for immediate feedback
    setMessagesData(prev => [...prev, localMessageData]);
    
    // Then send via socket
    sendMessage(messageData);
    
    reset();
    setSelectedFile(null);
    setFileType(null);
    setAudioFile(null);
    
    // Scroll to bottom after sending message
    scrollToBottom();
  };

  const renderTextWithLinks = (text) => {
    if (!text) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <Text>
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <Text
                key={index}
                style={styles.link}
                onPress={() => Linking.openURL(part)}
              >
                {part}
              </Text>
            );
          }
          return <Text key={index}>{part}</Text>;
        })}
      </Text>
    );
  };

  const renderFileContent = (message) => {
    // First check if this is a local file that hasn't been sent yet
    if (message._localFileUri) {
      switch (message._localFileType) {
        case 'image':
          return (
            <Image
              source={{ uri: message._localFileUri }}
              style={styles.attachmentImage}
              resizeMode="contain"
            />
          );
        case 'video':
          return (
            <Video
              source={{ uri: message._localFileUri }}
              style={styles.videoAttachment}
              controls={true}
              resizeMode="contain"
            />
          );
        case 'document':
          return (
            <View style={styles.pdfContainer}>
              <MaterialIcons name="picture-as-pdf" size={50} color="#E74C3C" style={styles.pdfIcon} />
              <Text style={styles.pdfText}>PDF Document</Text>
            </View>
          );
      }
    }
  
    // For server files
    if (message?.file && typeof message.file === 'string') {
      // Handle both data URIs and direct URLs
      const isDataUri = message.file.startsWith('data:');
      const isHttpUrl = message.file.startsWith('http');
      
      // Handle image files
      if ((isDataUri && message.file.startsWith('data:image')) || 
          (isHttpUrl && /\.(jpg|jpeg|png|gif)$/i.test(message.file))) {
        return (
          <Image
            source={{ uri: message.file }}
            style={styles.attachmentImage}
            resizeMode="contain"
            onError={(e) => console.error("Image loading error:", e.nativeEvent.error)}
          />
        );
      }
  
      // Handle video files
      if ((isDataUri && message.file.startsWith('data:video')) ||
          (isHttpUrl && /\.(mp4|mov|webm)$/i.test(message.file))) {
        return (
          <Video
            source={{ uri: message.file }}
            style={styles.videoAttachment}
            controls={true}
            resizeMode="contain"
            onError={(e) => console.error("Video loading error:", e)}
          />
        );
      }
  
      // Handle PDF files
      if ((isDataUri && message.file.startsWith('data:application/pdf')) ||
          (isHttpUrl && /\.pdf$/i.test(message.file))) {
        return (
          <View style={styles.pdfContainer}>
            <MaterialIcons name="picture-as-pdf" size={50} color="#E74C3C" style={styles.pdfIcon} />
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => Linking.openURL(message.file)}
            >
              <MaterialIcons name="file-download" size={24} color="#fff" />
              <Text style={styles.downloadText}>View PDF</Text>
            </TouchableOpacity>
          </View>
        );
      }
      
      // Generic fallback for other file types
      if (isHttpUrl) {
        return (
          <View style={styles.pdfContainer}>
            <MaterialIcons name="insert-drive-file" size={40} color="#3498DB" />
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => Linking.openURL(message.file)}
            >
              <MaterialIcons name="file-download" size={24} color="#fff" />
              <Text style={styles.downloadText}>Open File</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  
    return null;
  };
  

  const renderAudioPlayer = (audioUri, isLocal = false) => {
    console.log("Audio URI type:", typeof audioUri);
    console.log("Audio URI preview:", audioUri ? audioUri.substring(0, 50) + "..." : "null");
    
    const playAudio = async (uri) => {
      try {
        console.log("Playing audio from:", isLocal ? "local file" : "remote URL");
        
        // Stop any currently playing audio first
        await audioRecorderPlayer.stopPlayer();
        
        // Play the audio
        await audioRecorderPlayer.startPlayer(uri);
        await audioRecorderPlayer.setVolume(1.0);
        
        // Add a listener to detect when audio finishes playing
        audioRecorderPlayer.addPlayBackListener((e) => {
          if (e.currentPosition === e.duration) {
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
          }
        });
      } catch (error) {
        console.error('Error playing audio:', error);
        showToast('Error playing audio: ' + error.message);
      }
    };
  
    return (
      <TouchableOpacity 
        style={styles.audioPlayer}
        onPress={() => playAudio(audioUri)}
      >
        <FontAwesome name="play-circle" size={24} color="#369e3a" />
        <Text style={styles.audioText}>Play Audio</Text>
      </TouchableOpacity>
    );
  };
  
  

  const renderMessageItem = ({ item: message }) => (
    <View
      style={[
        styles.messageContainer,
        message.message_by === 'Admin' ? styles.adminMessage : styles.userMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.message_by === 'Admin' ? styles.adminBubble : styles.userBubble,
        ]}
      >
        {/* Render file attachment - check for local first */}
        {renderFileContent(message)}
  
        {/* Render audio - check for local audio first */}
        {message._localAudioUri ? 
          renderAudioPlayer(message._localAudioUri, true) : 
          message.audio ? renderAudioPlayer(message.audio) : null}
  
        {/* Render text message */}
        {message.text && (
          <Text style={message.message_by === 'Admin' ? styles.adminText : styles.userText}>
            {renderTextWithLinks(message.text)}
          </Text>
        )}
  
        {/* Timestamp */}
        <Text
          style={[
            styles.timestamp,
            message.message_by === 'Admin' ? styles.adminTimestamp : styles.userTimestamp,
          ]}
        >
          {`${separateDateAndTime(message?.created_at).date || ''} ${separateDateAndTime(message?.created_at).time?.split('.')[0] || ''}`}
        </Text>
      </View>
    </View>
  );

  const debugBase64Content = (dataUri) => {
    if (!dataUri || typeof dataUri !== 'string') return;
    
    try {
      const contentType = dataUri.split(';')[0].split(':')[1];
      const base64 = dataUri.split(',')[1];
      const firstFewBytes = base64.substring(0, 20);
      
      console.log("Content type:", contentType);
      console.log("Base64 preview:", firstFewBytes + "...");
      console.log("Base64 length:", base64.length);
    } catch (error) {
      console.error("Invalid data URI format");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <HeaderThree title='Deposit Chat'/>

      <FlatList
        ref={flatListRef}
        style={styles.messagesList}
        data={messagesData}
        windowSize={21}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => `msg-${index}-${item?.id || item?.created_at || Date.now()}`}
        onContentSizeChange={() => {
          console.log("FlatList content size changed");
          if (!initialScrollComplete && messagesData.length > 0) {
            scrollToBottom(false);
            setInitialScrollComplete(true);
          }
        }}
        onLayout={() => {
          console.log("FlatList layout completed");
          if (!initialScrollComplete && messagesData.length > 0) {
            scrollToBottom(false);
            setInitialScrollComplete(true);
          }
        }}
        // Show all messages instead of just 20
        initialNumToRender={messagesData.length}
        maxToRenderPerBatch={messagesData.length}
        // windowSize={messagesData.length > 50 ? 50 : messagesData.length}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />

      {selectedFile && (
        <View style={styles.selectedFileContainer}>
          <TouchableOpacity style={styles.removeFileButton} onPress={handleRemoveFile}>
            <Text style={styles.removeFileText}>X</Text>
          </TouchableOpacity>
          {fileType === 'image' ? (
            <Image source={{ uri: selectedFile }} style={styles.selectedFileImage} />
          ) : fileType === 'document' ? (
            <View style={styles.selectedFilePdf}>
              <MaterialIcons name="picture-as-pdf" size={40} color="#E74C3C" />
              <Text style={styles.selectedFileText}>PDF Document</Text>
            </View>
          ) : (
            <View style={styles.selectedFileGeneric}>
              <MaterialIcons name="insert-drive-file" size={40} color="#3498DB" />
              <Text style={styles.selectedFileText}>File selected</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <FontAwesome
            name={isRecording ? 'stop-circle' : 'microphone'}
            size={24}
            color={isRecording ? '#ff0000' : '#000'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
          <MaterialIcons name="attach-file" size={24} color="#000" />
        </TouchableOpacity>
        
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Type Message"
              value={value}
              onChangeText={onChange}
              multiline
            />
          )}
          name="text"
          defaultValue=""
        />
        
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSubmit(onSubmit)}
        >
          <FontAwesome name="paper-plane" size={24} color="#25b12b" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 5,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  adminMessage: {
    alignItems: 'flex-start',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    padding: 15,
    borderRadius: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1,
    elevation: 2,
  },
  adminBubble: {
    backgroundColor: 'rgb(54, 158, 58)',
  },
  userBubble: {
    backgroundColor: 'rgb(236, 236, 236)',
  },
  adminText: {
    color: 'white',
  },
  userText: {
    color: 'black',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
  },
  adminTimestamp: {
    color: 'white',
  },
  userTimestamp: {
    color: 'gray',
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  videoAttachment: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  pdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  pdfIcon: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 5,
  },
  pdfText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
  },
  downloadButton: {
    backgroundColor: '#0d6efd',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
  },
  downloadText: {
    color: 'white',
    marginLeft: 5,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  audioText: {
    marginLeft: 5,
    color: '#25b12b',
    fontWeight: '500',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  selectedFileContainer: {
    padding: 10,
    backgroundColor: '#fff',
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  removeFileButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFileText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedFileImage: {
    height: 100,
    width: '100%',
    resizeMode: 'contain',
  },
  selectedFilePdf: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  selectedFileGeneric: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  selectedFileText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#212529',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  recordButton: {
    padding: 10,
  },
  attachButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    padding: 10,
  },
});

export default ChatScreen;