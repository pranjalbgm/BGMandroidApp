import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {usePlayerData} from '../hooks/useHome';
import {fetchMobile} from '../hooks/useWallet';
import ConvertTime from '../hooks/useConvertTime';
import Loader from '../components/Loader';
import useGamePosting from '../hooks/useGamePosting';
import useCreateGamePost from '../hooks/useCreateGamePost';
import HeaderThree from '../components/HeaderThree';
import Toast from 'react-native-simple-toast';
import GamePostFormModal from './GamePostFormModel';

export function separateDateAndTime(dateTimeString) {
  let datePart, timePart;
  if (dateTimeString.includes('T')) {
    [datePart, timePart] = dateTimeString.split('T');
  } else {
    [datePart, timePart] = dateTimeString.split(' ');
  }
  const [year, month, day] = datePart.split('-');
  return {date: `${day}-${month}-${year}`, time: timePart};
}

const GamePostPage = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  const [mobile, setMobile] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);

  const playerInfo = usePlayerData();
  const [playerData, setPlayerData] = useState(null);

  const {gamePosting, isLoading, refetch} = useGamePosting();
  const sendMessage = useCreateGamePost();

  useEffect(() => {
    if (playerInfo.isSuccess) {
      setPlayerData(playerInfo.data);
    }
  }, [playerInfo]);


   useEffect(() => {
          fetchMobile(setMobile);
        }, []); 
      
        useEffect(() => {
      
          if (mobile) {
            playerInfo.mutate({ mobile });
          }
        }, [mobile]);
    

  useEffect(() => {
    if (gamePosting) {
      setMessages(gamePosting);
      scrollViewRef.current?.scrollToEnd({animated: false});
    }
  }, [gamePosting]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      // console.("Cannot send an empty message");
      Toast.show('Cannot send an empty message', Toast.LONG);
      return;
    }

    setLoader(true);
    try {
      const formData = new FormData();
      formData.append('message_by', 'User');
      formData.append('name', playerData?.name || ' ');
      formData.append('mobile', mobile);
      formData.append('text', message);

      sendMessage.mutate(formData);
      if (sendMessage.isSuccess) {
        console.log('Message sent successfully', sendMessage);
        Toast.show('Message sent successfully', Toast.LONG);
      } else if (sendMessage.error) {
        console.log('Something went wrong', sendMessage.error);
      }

      setMessage('');
      refetch();
      //   scrollViewRef.current?.scrollToEnd({ animated: false });
    } catch (error) {
      console.error('Error while sending the message:', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderThree title={'Game Post'} />
      <View style={styles.messagesWrapper}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContainer}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : gamePosting?.length > 0 ? (
            messages.map((message, index) => (
              <View style={styles.container}>
      <Text style={styles.marketText}>
        <Text style={styles.bold}>{message?.market}</Text>
      </Text>

      <View>
        <View style={styles.row}>
          <Text style={styles.bold}>Tricks from - </Text>
          <Text>{message?.tricksfrom}</Text>
        </View>
        <Text>{message?.tricks}</Text>
      </View>

      <View style={styles.valuesContainer}>
        <Text>
          [{message?.singlevalue1}]
          <Text style={styles.spacing}> SINGLE </Text>[{message?.singlevalue2}]
        </Text>
        <Text>
          [{message?.spotvalue1}]
          <Text style={styles.spacing}> SPOT </Text>[{message?.spotvalue2}]
        </Text>
        <Text>
          [{message?.fixvalue1}]
          <Text style={styles.spacing}> FIX </Text>[{message?.fixvalue2}]
        </Text>
      </View>
    </View>
            ))
          ) : (
            <Text>No messages available</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <FontAwesome name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Loader visibility={loader} />
      {/* <GamePostFormModal
        gameSubmitChat={gameSubmitChat}
        showModal={gamePostFormOpen}
        handleClose={() => setGamePostFormOpen(false)}
        playerData={playerInfo}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#ffffff',
  // },
  messagesWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  messagesContainer: {
    flexGrow: 1,
  },
  message: {
    marginBottom: 10,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  userMessageContent: {
    backgroundColor: '#ddd',
  },
  otherMessageContent: {
    backgroundColor: '#4cb050',
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    marginTop: 5,
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
  container: {
    flex:1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 10,
  },
  marketText: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  valuesContainer: {
    marginTop: 8,
  },
  spacing: {
    width: 80, // Adjust as needed
    textAlign: "center",
  },
});

export default GamePostPage;
