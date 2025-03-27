import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import HeaderThree from '../components/HeaderThree';
import appStyles from '../styles/appStyles';
import {usePlayerData} from '../hooks/useHome';
import {fetchMobile} from '../hooks/useWallet';
import ConvertTime from '../hooks/useConvertTime';
import {imageApiClient} from '../constants/api-client';
import ImagePicker from 'react-native-image-crop-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-blob-util';
import Video from 'react-native-video';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {useWithdrawChat} from '../hooks/useChat';
import Loader from '../components/Loader';

const audioRecorderPlayer = new AudioRecorderPlayer();

export function separateDateAndTime(dateTimeString) {
  let datePart, timePart;
  if (dateTimeString.includes('T')) {
    [datePart, timePart] = dateTimeString.split('T');
  } else {
    [datePart, timePart] = dateTimeString.split(' ');
  }
  const [year, month, day] = datePart.split('-');
  const formattedDate = `${day}-${month}-${year}`;
  return {date: formattedDate, time: timePart};
}

const ChatScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [mobile, setMobile] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState('');
  const playerInfo = usePlayerData();
  const [playerData, setPlayerData] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [playSeconds, setPlaySeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null); // Track current playing audio
  const [audioState, setAudioState] = useState({});
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [loader, setLoader] = useState(false);

  // const { chatScreen, sendMessage } = useWithdrawChat({ user: mobile });
  const {chatScreen, isLoadingChatScreen, sendMessage} = useWithdrawChat({
    user: mobile,
  });

  console.log('this is chatScreen data', chatScreen);

  const dirs = RNFetchBlob.fs.dirs;
  const audioFilePath = Platform.select({
    ios: 'hello.m4a',
    android: `${dirs.CacheDir}/hello.mp3`,
  });

  let recordingInterval;

  const onStartRecord = async () => {
    setIsRecordingActive(true); // Start recording
    try {
      const uri = await audioRecorderPlayer.startRecorder(audioFilePath);
      audioRecorderPlayer.addRecordBackListener(e => {
        // Update recording time
        const currentTime = audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        );
        setRecordingTime(currentTime);
      });
      console.log('Recording started at:', uri);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const onStopRecord = async () => {
    setIsRecordingActive(false); // Stop recording
    clearInterval(recordingInterval); // Clear the interval
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      console.log('Recording stopped. File saved at:', result);

      if (result) {
        setAudioFile(result);
        handleSendMessage(); // Set the audio file path directly
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  const onStartPlay = async audioPath => {
    if (currentAudio && currentAudio !== audioPath) {
      await onStopPlay(); // Stop currently playing audio
    }

    try {
      const msg = await audioRecorderPlayer.startPlayer(audioPath);
      const volume = await audioRecorderPlayer.setVolume(1.0);
      setIsPlaying(true);
      setCurrentAudio(audioPath); // Set the current playing audio

      audioRecorderPlayer.addPlayBackListener(e => {
        const updatedAudioState = {...audioState};
        updatedAudioState[audioPath] = {
          playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
          duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
          playSeconds: e.currentPosition / 1000,
          durationSeconds: e.duration / 1000,
        };
        setAudioState(updatedAudioState);

        if (e.currentPosition >= e.duration) {
          onStopPlay(); // Stop playing when audio ends
        }
        return;
      });
      console.log(msg);
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
    setIsPlaying(false);
  };

  const onStopPlay = async () => {
    await audioRecorderPlayer.stopPlayer();
    setIsPlaying(false);
    setCurrentAudio(null); // Reset current audio
    audioRecorderPlayer.removePlayBackListener();
  };

  const onSeek = async value => {
    const seekTime = value * durationSeconds * 1000;
    await audioRecorderPlayer.seekToPlayer(seekTime);
  };

 useEffect(() => {
            fetchMobile(setMobile);
          }, []); 
        
          useEffect(() => {
        
            if (mobile) {
              playerInfo.mutate({ mobile });
            }
          }, [mobile]);
 

  useEffect(() => {
    if (chatScreen) {
      try {
        setMessages(chatScreen);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: false});
        }, 1500);
      } catch (error) {
        console.error('Failed to update messages:', error);
      }
    }
  }, [chatScreen]);

  // useEffect(() => {
  //   playerInfo.isSuccess && setPlayerData(playerInfo.data);
  // }, [playerInfo]);

  const uploadImage = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then(image => {
      console.log(image);
      setSelectedImage(image.path);
      handleSendMessage();
    });
  };

  const handleSendMessage = async () => {
    setLoader(true);
    if (message.trim() !== '' || selectedImage || audioFile) {
      const newMessage = {text: message, user: 1, time: new Date()};

      try {
        const formData = new FormData();
        formData.append('message_by', 'User');
        // formData.append('name', playerData?.name || " ");
        formData.append('mobile', mobile);
        formData.append('text', newMessage.text);
        formData.append('seen', false);

        if (audioFile) {
          formData.append('audio', {
            uri: Platform.OS === 'android' ? `file://${audioFile}` : audioFile,
            type: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp3',
            name: Platform.OS === 'ios' ? 'hello.m4a' : 'hello.mp3',
          });
        }

        if (selectedImage) {
          formData.append('file', {
            uri: selectedImage,
            type: 'image/jpeg',
            name: 'image.jpg',
          });
        }

        console.log('FormData before sending:', formData);
        // for (const [key, value] of formData.entries()) {
        //   console.log(`${key}: ${value}`);
        // }
        try {
          const response = await sendMessage.mutateAsync(formData);
          console.log('Message sent successfully:', response);

          if (response) {
            console.log('Response data:', response);
          } else {
            console.warn('Response data is undefined or null.');
          }

          await chatScreen.refetch();
        } catch (error) {
          console.error('Error while sending the message:', error);
        }
        scrollViewRef?.current.scrollToEnd({animated: false});
        setMessage('');
        setSelectedImage(null);
        setRecordingTime('00:00');
        setAudioFile(null);
        setTimeout(() => {
          setLoader(false);
        }, 200);
      } catch (error) {
        setLoader(false);
        // Handle errors
      }
    } else {
      setLoader(false);
      console.log('Cannot send an empty message');
    }
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].user === 'User') {
      const timeout = setTimeout(() => {
        setMessages([...messages]);
        scrollViewRef.current?.scrollToEnd({animated: false});
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [messages]);

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderThree title={'Admin'} />

      <View style={{flex: 1, padding: 20, justifyContent: 'flex-end'}}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={styles.messagesContainer}>
          {isLoadingChatScreen ? (
            // Use a Loader component instead of just text for a better UX
            <Text>Loading.....</Text> // Or replace this with <Loader visibility={true} />
          ) : chatScreen && chatScreen.length > 0 ? (
            messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.message,
                  msg.message_by === 'User'
                    ? styles.user1MessageContainer
                    : styles.user2MessageContainer,
                ]}>
                <View
                  style={[
                    styles.messageContent,
                    msg.message_by === 'User'
                      ? styles.user1MessageContent
                      : styles.user2MessageContent,
                  ]}>
                  {msg.text && (
                    <Text
                      style={[
                        styles.messageText,
                        msg.user === 'User'
                          ? styles.user1MessageText
                          : styles.user2MessageText,
                      ]}>
                      {msg.text}
                    </Text>
                  )}

                  {msg.audio && (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (currentAudio === imageApiClient + msg.audio) {
                              onPausePlay();
                            } else {
                              onStartPlay(imageApiClient + msg.audio);
                            }
                          }}>
                          <FontAwesomeIcon
                            name={
                              currentAudio === imageApiClient + msg.audio &&
                              isPlaying
                                ? 'pause'
                                : 'play'
                            }
                            size={20}
                            color="black"
                          />
                        </TouchableOpacity>
                        <Slider
                          style={{width: 200, height: 40}}
                          minimumValue={0}
                          maximumValue={1}
                          value={
                            isFinite(
                              audioState[imageApiClient + msg.audio]
                                ?.durationSeconds,
                            ) &&
                            isFinite(
                              audioState[imageApiClient + msg.audio]
                                ?.playSeconds,
                            )
                              ? audioState[imageApiClient + msg.audio]
                                  ?.playSeconds /
                                audioState[imageApiClient + msg.audio]
                                  ?.durationSeconds
                              : 0
                          }
                          minimumTrackTintColor="#111000"
                          maximumTrackTintColor="#000000"
                          onSlidingComplete={value =>
                            onSeek(value, imageApiClient + msg.audio)
                          }
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text>
                          {audioState[imageApiClient + msg.audio]?.playTime ||
                            '00:00'}
                        </Text>
                        <Text>
                          {audioState[imageApiClient + msg.audio]?.duration ||
                            '00:00'}
                        </Text>
                      </View>
                    </View>
                  )}

                  {msg.file && (
                    <View>
                      {(msg.file.endsWith('.png') ||
                        msg.file.endsWith('.jpg') ||
                        msg.file.endsWith('.jpeg') ||
                        msg.file.endsWith('.gif')) && (
                        <Image
                          source={{uri: imageApiClient + msg.file}}
                          style={{width: '100%', height: 200}}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                  )}

                  {msg.file && (
                    <View>
                      {(msg.file.endsWith('.mp4') ||
                        msg.file.endsWith('.webm') ||
                        msg.file.endsWith('.ogg')) && (
                        <Video
                          source={{uri: imageApiClient + msg.file}}
                          style={styles.video}
                          resizeMode="cover"
                          controls
                        />
                      )}
                    </View>
                  )}

                  <Text
                    style={[
                      styles.timeText,
                      msg.user === 1
                        ? styles.user1TimeText
                        : styles.user2TimeText,
                    ]}>
                    {`${separateDateAndTime(msg?.created_at).date} ${ConvertTime(separateDateAndTime(msg?.created_at).time)}`}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text>No messages available</Text> // Display a message if no chats exist
          )}
        </ScrollView>
      </View>
      {isRecordingActive && (
        <View
          style={{
            backgroundColor: 'black',
            width: '35%',
            padding: 5,
            borderRadius: 10,
          }}>
          <Text style={{color: 'white'}}>Recording : {recordingTime}</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={{
            flex: 1,
            borderRadius: 90,
            padding: 10,
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.2)',
          }}
          value={message}
          onChangeText={text => setMessage(text)}
          placeholder="Type a message..."
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <FontAwesome name="send" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordingButton}
          onPressIn={onStartRecord}
          onPressOut={onStopRecord}>
          <FontAwesomeIcon name="microphone" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.fileButton} onPress={uploadImage}>
          <MaterialIcons name="attach-file" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <Loader visiblity={loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  messagesContainer: {
    flex: 1,
  },
  message: {
    marginBottom: 10,
  },
  user1MessageContainer: {
    alignItems: 'flex-end',
  },
  user2MessageContainer: {
    alignItems: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  user1MessageContent: {
    backgroundColor: '#ddd',
  },
  user2MessageContent: {
    backgroundColor: '#4cb050',
  },
  messageText: {
    fontSize: 16,
  },
  user1MessageText: {
    color: '#000',
  },
  user2MessageText: {
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    marginTop: 5,
  },
  user1TimeText: {
    color: '#666',
  },
  user2TimeText: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ECECEC',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ECECEC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  recordingButton: {
    backgroundColor: '#FF4500',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  fileButton: {
    backgroundColor: '#32CD32',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  audioIndicator: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 5,
  },
});

export default ChatScreen;
