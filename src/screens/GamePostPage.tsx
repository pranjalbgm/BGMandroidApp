import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  Platform
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
// import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGamePostSeen } from "../hooks/useGamePosting";
import useCreateGamePost from "../hooks/useCreateGamePost";
import { usePlayerDataFetch } from "../hooks/useHome";
import ConvertTime from "../hooks/useConvertTime";
import useAddEmojiReaction from "../hooks/useAddEmojiReaction";
import useAddCustomReaction from "../hooks/useAddCustomReaction";
import GamePostFormModal from "./GamePostFormModel";
import { separateDateAndTime } from "./BonusReportScreen";
import useSocket from "../Sockets/GamePostingSocket";
import { fetchMobile } from "../hooks/useWallet";
import HeaderThree from "../components/HeaderThree";
import appStyles from "../styles/appStyles";
import { TextInput } from "react-native-gesture-handler";
import EmojiPickerModal from "../components/EmojiPickerModal";
import useMarkets from "../hooks/useMarkets";

type RootStackParamList = {
  GamePosting: { marketName: string };
};

type GamePostingRouteProp = RouteProp<RootStackParamList, 'GamePosting'>;

interface Message {
  _id: string;
  name: string;
  mobile: string;
  market: string;
  tricksfrom: string;
  dateFrom: string;
  dateTo: string;
  tricks: string[];
  singlevalue1: string;
  singlevalue2: string;
  spotvalue1: string;
  spotvalue2: string;
  fixvalue1: string;
  fixvalue2: string;
  createdAt: string;
  created_time: string;
  reactions: {
    [key: string]: {
      count: number;
      users: string[];
    };
  };
  customReactions: {
    [key: string]: {
      count: number;
      users: string[];
    };
  };
}

interface PinnedMessage {
  message: Message;
  username: string;
}


const GamePosting: React.FC = () => {
  const route = useRoute<GamePostingRouteProp>();
  const navigation = useNavigation();
 
  // const { gameSubmitChat, messages, gamePinnedChat, pinnedMessage } = useSocket();
  const {
    gameSubmitChat,
    messages,
    gamePinnedChat,
    pinnedMessage,
    refetchmessage,
  }: {
    gameSubmitChat: (msg: Message) => void;
    messages: Message[];
    gamePinnedChat: (id: string) => void;
    pinnedMessage: PinnedMessage | null;
    refetchmessage: any,
  } = useSocket();
  const [mobile, setMobile] = useState('');
  // Fetch Mobile and Update Player Info
  const markets = useMarkets();
 

  const messagesEndRef = useRef<ScrollView>(null);
  const messageRefs = useRef<{[key: string]: React.RefObject<View>}>({});

  const GamePostSeen = useGamePostSeen({ mobile });
  const gamepost = useCreateGamePost();
  const addEmojiReaction = useAddEmojiReaction();
  const addCustomReaction = useAddCustomReaction();
  const [gamePostFormOpen, setGamePostFormOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);


  const [showEmojiInput, setShowEmojiInput] = useState(false);
const emojiInputRef = useRef<TextInput>(null);
const [emojiText, setEmojiText] = useState("");
const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
const [loading, setLoading] = useState(true);


const openEmojiKeyboard = (messageId: string) => {
  setActiveMessageId(messageId);
  setShowEmojiInput(true);
  setTimeout(() => {
    emojiInputRef.current?.focus();
  }, 100);
};

const handleEmojiInputChange = (text: string) => {
  if (text.length > 0 && activeMessageId) {
    handleEmojiClick(activeMessageId, text);
    setEmojiText("");
    setShowEmojiInput(false);
    setActiveMessageId(null);
  } else {
    setEmojiText(text); // still updating to clear the input
  }
};

  const {
    data: playerInfo,
    error,
    isLoading: isPlayerDataLoading,
    refetch: refetchPlayer,
    isSuccess: isPlayerDataSuccess,
  } = usePlayerDataFetch(mobile);

  // Initialize message refs
  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      messages.forEach(message => {
        if (!messageRefs.current[message._id]) {
          messageRefs.current[message._id] = React.createRef<View>();
        }
      });
    }
  }, [messages]);

  const handleEmojiClick = async (messageId: string, emoji: string) => {
    try {
    const res = await addEmojiReaction.mutateAsync({ mobile: mobile, messageId, emoji });
    if (res?.data?.success) {
      refetchmessage();
    }

  } catch (error) {
    console.error("Custom reaction error:", error);
  } finally {
    setReplyingMessageId(null);
  }
      // {
      //   onSuccess: () => {
      //     // Refetch would be implemented in your hook
      //   },
      //   onError: (error) => console.error("Emoji reaction error:", error),
      // }
  };

  const handleSelect = async (text: string, messageId: string) => {
    try {
      const res = await addCustomReaction.mutateAsync({
        mobile,
        messageId,
        reaction: text,
      });
  
      if (res?.data?.success) {
        refetchmessage();
      }
  
    } catch (error) {
      console.error("Custom reaction error:", error);
    } finally {
      setReplyingMessageId(null);
    }
  };
  
  
  const handleClick = (messageId: string) => {
    setReplyingMessageId(replyingMessageId === messageId ? null : messageId);
  };

  const handlePinnedMsg = (message: Message) => {
    if (playerInfo?.kyc === "no") {
      // Toast.show({
      //   type: 'error',
      //   text1: 'Please complete Your KYC first',
      // });
    } else {
      gamePinnedChat(message);
    }
  };

  const handlePinnedMsgClick = () => {
    if (pinnedMessage?.message?._id && messagesEndRef.current) {
      const messageId = pinnedMessage.message._id;
      const messageRef = messageRefs.current[messageId];
      
      if (messageRef?.current) {
        messageRef.current.measureLayout(
          // @ts-ignore - This is a type error in RN types but should work
          messagesEndRef.current,
          (_x: number, y: number) => {
            messagesEndRef.current?.scrollTo({ y, animated: true });
          },
          () => console.log("Failed to measure layout")
        );
      }
    }
  };

  // useEffect(() => {
  //   if (fetchMobile) {
  //     refetchPlayer();
  //   }
  // }, [fetchMobile]);

  useEffect(() => {
    if (mobile) {
      GamePostSeen.mutate(mobile);
    }
  }, [mobile]);

  useEffect(() => {
    if (messagesEndRef.current && messages && Array.isArray(messages) && messages.length > 0) {
      messagesEndRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const initializeMobile = async () => {
      const fetchedMobile = await fetchMobile(setMobile);
      if (fetchedMobile && mobile) {
        // playerInfo.mutate({ mobile: fetchedMobile });
        refetchPlayer()
      }
    };
    initializeMobile();
  }, []);
  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      setLoading(false);
    }
  }, [messages]);
  
  const renderEmojis = (messageId: string) => {
    const predefinedEmojis = ["😂", "❤️", "👍", "🔥", "😢"];
    
    return (
      <View style={styles.emojiWrapper}>
        <View style={styles.predefinedEmojis}>
          {predefinedEmojis.map((emoji, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.emojiBtn}
              onPress={() => handleEmojiClick(messageId, emoji)}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
  
  <TouchableOpacity
  style={styles.emojiPickerIcon}
  onPress={() => setShowEmojiPicker(true)}
>
  <MaterialCommunityIcons name="plus" size={18} color="black" />
</TouchableOpacity>
</View>
<EmojiPickerModal
  visible={showEmojiPicker}
  onClose={() => setShowEmojiPicker(false)}
  onSelect={(emoji) => handleEmojiClick(messageId, emoji)}
/>
      </View>
      
    );
  };

  const renderPinnedMessage = () => {
    if (!pinnedMessage?.message?._id) return null;
    
    return (
      <TouchableOpacity style={styles.pinnedChat} onPress={handlePinnedMsgClick}>
        <View style={styles.boxPinnedInner}>
          <MaterialCommunityIcons name="pin" size={20} color="black" />
          <View style={styles.boxInnerContainer}>
            <View style={styles.pinnedMessageHeader}>
              <View style={styles.postHost}>
                <Text style={styles.pinnedByText}>Pinned by - {pinnedMessage.username}</Text>
                <Text style={styles.postByText}>
                  Post by - <Text>{pinnedMessage.message.name}</Text>
                </Text>
                <Text>market - {pinnedMessage.message.market}</Text>
              </View>
              <View style={styles.dateTimeContainer}>
                <MaterialCommunityIcons name="calendar" size={14} color="black" />
                <Text style={styles.dateText}>
                  {separateDateAndTime(pinnedMessage.message.createdAt).date}
                </Text>
                <MaterialCommunityIcons name="clock" size={14} color="black" />
                <Text style={styles.timeText}>
                  {ConvertTime(separateDateAndTime(pinnedMessage.message.createdAt).time)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderReactions = (message: Message) => {
    if (!message.reactions) return null;
    
    return (
      <View style={styles.emojiReactions}>
        {Object.entries(message.reactions).map(([emoji, data], idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.reactionBtn}
            onPress={() => handleEmojiClick(message._id, emoji)}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
            <Text style={styles.emojiCount}>{data.count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReplyOptions = (message: Message) => {
    if (replyingMessageId !== message._id) return null;
    
    return (
      <View style={styles.replyOptionsContainer}>
        <TouchableOpacity
          style={styles.replyOption}
          onPress={() => handleSelect("congratulations", message._id)}
        >
          <Text style={styles.replyOptionText}>🎉 Congratulations</Text>
          {message?.customReactions?.congratulations && (
            <Text style={styles.replyCount}>
              {message.customReactions.congratulations.count}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.replyOption}
          onPress={() => handleSelect("nice", message._id)}
        >
          <Text style={styles.replyOptionText}>👍 Nice</Text>
          {message?.customReactions?.nice && (
            <Text style={styles.replyCount}>
              {message.customReactions.nice.count}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.replyOption}
          onPress={() => handleSelect("good", message._id)}
        >
          <Text style={styles.replyOptionText}>😊 Good</Text>
          {message?.customReactions?.good && (
            <Text style={styles.replyCount}>
              {message.customReactions.good.count}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
     <HeaderThree title='Game Post'/>

      {renderPinnedMessage()}

      <ScrollView
        ref={messagesEndRef}
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
    <View style={styles.loaderContainer}>
      <MaterialCommunityIcons  name="loading" size={22}  color="#0000ff" />
      <Text style={styles.loadingText}>Loading messages...</Text>
    </View>
  ) : messages && Array.isArray(messages) && messages.length > 0 ? (
    messages.map((message, index) => (
      <View
      key={index}
      ref={messageRefs.current[message._id]}
      style={[
        styles.boxses,
        {
          alignItems:
            message.mobile === mobile ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View style={styles.boxInner}>
        <View style={styles.boxInnerWrapper}>
          <View style={styles.messageHeader}>
            <View style={styles.postContainer}>
              {playerInfo?.game_host === "yes" && (
                <TouchableOpacity onPress={() => handlePinnedMsg(message)}>
                  <MaterialCommunityIcons name="pin" size={20} color="black" />
                </TouchableOpacity>
              )}
              <Text style={styles.postHostText}>Post by</Text>
              <Text style={styles.nameText}>{message?.name}</Text>

            </View>
            
            <View style={styles.boxRightArea}>
              <Text style={styles.marketNameText}>
                Market Name - <Text style={styles.marketText}>{message?.market}</Text>
              </Text>
              <View style={styles.tricksInfoContainer}>
                <Text style={styles.tricksFromText}>
                  <Text style={styles.boldText}>tricks from - </Text>
                  {message?.tricksfrom}
                </Text>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>
                    <Text style={styles.boldText}>From - </Text>
                    {message.dateFrom}
                  </Text>
                  <Text style={styles.dateText}>
                    <Text style={styles.boldText}>To - </Text>
                    {message.dateTo}
                  </Text>
                </View>
              </View>
            </View>


            {renderReactions(message)}
          </View>

          <View style={styles.messageTricks}>
            {message?.tricks?.map((trick, index) => (
              <Text key={index} style={styles.trickText}>
                {trick}
              </Text>
            ))}
            <View style={styles.valuesContainer}>
              <Text style={styles.valueRow}>
                [{message.singlevalue1}]
                <Text style={styles.valueLabel}> SINGLE </Text>
                [{message.singlevalue2}]
              </Text>
              <Text style={styles.valueRow}>
                [{message.spotvalue1}]
                <Text style={styles.valueLabel}> SPOT </Text>
                [{message.spotvalue2}]
              </Text>
              <Text style={styles.valueRow}>
                [{message.fixvalue1}]
                <Text style={styles.valueLabel}> FIX </Text>
                [{message.fixvalue2}]
              </Text>
            </View>
          </View>

          {renderEmojis(message._id)}
        </View>
        <View style={styles.dateTimeFooter}>
          <MaterialCommunityIcons name="calendar" size={14} color="black" />
          <Text style={styles.dateText}>
            {separateDateAndTime(message.createdAt).date}
          </Text>
          <MaterialCommunityIcons name="clock" size={14} color="black" />
          <Text style={styles.timeText}>
            {ConvertTime(separateDateAndTime(message.created_time).time)}
          </Text>
        </View>
      </View>

      <View>
        <TouchableOpacity
          style={[
            styles.replyButton,
            {
              alignSelf: message.mobile === mobile ? "flex-end" : "flex-start",
            },
          ]}
          onPress={() => handleClick(message._id)}
        >
          <Text style={styles.replyText}>reply</Text>
        </TouchableOpacity>
        {renderReplyOptions(message)}
      </View>
    </View>
    ))
  ) : (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>No Data Available</Text>
    </View>
  )}
        {/* {messages && Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message, index) => (
            <View
              key={index}
              ref={messageRefs.current[message._id]}
              style={[
                styles.boxses,
                {
                  alignItems:
                    message.mobile === mobile ? "flex-end" : "flex-start",
                },
              ]}
            >
              <View style={styles.boxInner}>
                <View style={styles.boxInnerWrapper}>
                  <View style={styles.messageHeader}>
                    <View style={styles.postContainer}>
                      {playerInfo?.game_host === "yes" && (
                        <TouchableOpacity onPress={() => handlePinnedMsg(message)}>
                          <MaterialCommunityIcons name="pin" size={20} color="black" />
                        </TouchableOpacity>
                      )}
                      <Text style={styles.postHostText}>Post by</Text>
                      <Text style={styles.nameText}>{message?.name}</Text>

                    </View>
                    
                    <View style={styles.boxRightArea}>
                      <Text style={styles.marketNameText}>
                        Market Name - <Text style={styles.marketText}>{message?.market}</Text>
                      </Text>
                      <View style={styles.tricksInfoContainer}>
                        <Text style={styles.tricksFromText}>
                          <Text style={styles.boldText}>tricks from - </Text>
                          {message?.tricksfrom}
                        </Text>
                        <View style={styles.dateContainer}>
                          <Text style={styles.dateText}>
                            <Text style={styles.boldText}>From - </Text>
                            {message.dateFrom}
                          </Text>
                          <Text style={styles.dateText}>
                            <Text style={styles.boldText}>To - </Text>
                            {message.dateTo}
                          </Text>
                        </View>
                      </View>
                    </View>


                    {renderReactions(message)}
                  </View>

                  <View style={styles.messageTricks}>
                    {message?.tricks?.map((trick, index) => (
                      <Text key={index} style={styles.trickText}>
                        {trick}
                      </Text>
                    ))}
                    <View style={styles.valuesContainer}>
                      <Text style={styles.valueRow}>
                        [{message.singlevalue1}]
                        <Text style={styles.valueLabel}> SINGLE </Text>
                        [{message.singlevalue2}]
                      </Text>
                      <Text style={styles.valueRow}>
                        [{message.spotvalue1}]
                        <Text style={styles.valueLabel}> SPOT </Text>
                        [{message.spotvalue2}]
                      </Text>
                      <Text style={styles.valueRow}>
                        [{message.fixvalue1}]
                        <Text style={styles.valueLabel}> FIX </Text>
                        [{message.fixvalue2}]
                      </Text>
                    </View>
                  </View>

                  {renderEmojis(message._id)}
                </View>
                <View style={styles.dateTimeFooter}>
                  <MaterialCommunityIcons name="calendar" size={14} color="black" />
                  <Text style={styles.dateText}>
                    {separateDateAndTime(message.createdAt).date}
                  </Text>
                  <MaterialCommunityIcons name="clock" size={14} color="black" />
                  <Text style={styles.timeText}>
                    {ConvertTime(separateDateAndTime(message.created_time).time)}
                  </Text>
                </View>
              </View>

              <View>
                <TouchableOpacity
                  style={[
                    styles.replyButton,
                    {
                      alignSelf: message.mobile === mobile ? "flex-end" : "flex-start",
                    },
                  ]}
                  onPress={() => handleClick(message._id)}
                >
                  <Text style={styles.replyText}>reply</Text>
                </TouchableOpacity>
                {renderReplyOptions(message)}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Data Available</Text>
          </View>
        )} */}
      </ScrollView>

      {playerInfo?.game_host === "yes" && (
        <TouchableOpacity
          style={styles.addPostButton}
          onPress={() => setGamePostFormOpen(true)}
        >
          <Text style={styles.addPostText}>add Post</Text>
        </TouchableOpacity>
      )}

      {gamePostFormOpen && (
        <GamePostFormModal
          gameSubmitChat={gameSubmitChat}
          showModal={gamePostFormOpen}
          handleClose={() => setGamePostFormOpen(false)}
          playerData={playerInfo}
          markets={markets?.markets}
        />
      )} 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
 
});

export default GamePosting;