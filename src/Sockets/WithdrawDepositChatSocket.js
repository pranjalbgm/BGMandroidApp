import { useEffect, useState } from "react";
import { socket } from "../constants/api-client";
import { toast } from "react-toastify";
import { fetchMobile } from "../hooks/useWallet";
import Toast from 'react-native-simple-toast';


const WithdrawDepositChatSocket = () => {
  const [depositUsers, setDepositUsers] = useState([]);
  const [withdrawUsers, setWithdrawUsers] = useState([]);
  const [depositmessages, setDepositMessages] = useState([]);
  const [withdraw_message, setwithdraw_message] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatType, setChatType] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [mobile, setMobile] = useState('');
  useEffect(() => {
      const initializeMobile = async () => {
        const fetchedMobile = await fetchMobile(setMobile);
      };
      initializeMobile();
    }, []);

  const getISTDate = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(now.getTime() + istOffset).toISOString();
  };
  const handleConnect = () => {
    setConnectionStatus(true);
    Toast.show("Connected to Chat", Toast.LONG); 
    socket.emit("user_join", mobile);
    socket.emit("fetchDepositUsers");
    socket.emit("fetchWithdrawUsers");
  };
  useEffect(() => {
    if (!socket || typeof socket.on !== "function") return;

    const handleDisconnect = () => {
      setConnectionStatus(false);
      Toast.show("Disconnected from server", Toast.LONG); 
    };

    const handleDepositMessages = (chatMessages) => {
        
      setDepositMessages((prevMessages) =>
        Array.isArray(chatMessages)
          ? [...prevMessages, ...chatMessages]
          : [...prevMessages, chatMessages]
      );
    };

    const handleNewDepositMessage = (newMessage) => {
      if (!newMessage) return;
      setDepositMessages((prevMessages) => {
        if (
          prevMessages.some((msg) => msg.timestamp === newMessage.timestamp)
        ) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    };
    const handleWithdrawMessages = (chatMessages) => {
      setwithdraw_message((prevMessages) =>
        Array.isArray(chatMessages)
          ? [...prevMessages, ...chatMessages]
          : [...prevMessages, chatMessages]
      );
    };

    const handlenewWithdrawMessage = (newMessage) => {
      if (!newMessage) return;
      setwithdraw_message((prevMessages) => {
        if (
          prevMessages.some((msg) => msg.timestamp === newMessage.timestamp)
        ) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    };
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    if (socket.connected) {
      socket.emit("user_join", mobile);
      Toast.show("connected", Toast.LONG); 
    }
    socket.on("receiveDepositMessages", handleDepositMessages);
    socket.on("receiveWithdrawMessages", handleWithdrawMessages);
    socket.on("newDepositMessage", handleNewDepositMessage);
    socket.on("newWithdrawMessage", handlenewWithdrawMessage);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receiveDepositMessages", handleDepositMessages);
      socket.off("receiveWithdrawMessages", handleWithdrawMessages);
      socket.off("newDepositMessage", handleNewDepositMessage);
      socket.off("newWithdrawMessage", handlenewWithdrawMessage);
    };
  }, [socket]);
  const CHUNK_SIZE = 1024 * 50;
  const sendFile = (fileBase64, selectedUser) => {
    return new Promise((resolve, reject) => {
      const totalChunks = Math.ceil(fileBase64.length / CHUNK_SIZE);
      let currentChunk = 0;
      const sendNextChunk = () => {
        if (currentChunk < totalChunks) {
          const start = currentChunk * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, fileBase64.length);
          const fileChunk = fileBase64.substring(start, end);
          socket.emit("file-chunk", {
            mobile_id: selectedUser,
            file: fileChunk,
            currentChunk,
            totalChunks,
          });
          currentChunk++;
          setTimeout(sendNextChunk, 10);
        } else {
          resolve(true);
        }
      };
      socket.on("file-error", (error) => {
        reject(error.message || "File upload failed ❌");
      });
      sendNextChunk();
    });
  };
  const ALLOWED_TYPES = [
    "application/pdf",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];
  const validateFileType = (fileBase64) => {
    const match = fileBase64.match(/^data:(.*?);base64,/);
    console.log(match, "match");
    if (!match) return false;
    const mimeType = match[1];
    return ALLOWED_TYPES.includes(mimeType);
  };
  const selectUserChat = (mobile, type) => {
    if (socket.connected) {
      socket.emit("user_join", mobile);
      Toast.show("connected", Toast.LONG); 
    }
    setSelectedUser(mobile);
    setChatType(type);

    if (type === "deposit") {
      socket.emit("joinDepositChat", { mobile });
      socket.emit("fetchDepositMessages", { mobile_id: mobile });
    } else if (type === "withdraw") {
      socket.emit("joinWithdrawChat", { mobile });
      socket.emit("fetchWithdrawMessages", { mobile_id: mobile });
    }
  };

  const sendMessage = async (messageData) => {
    if (socket.connected) {
      socket.emit("user_join", mobile);
    }
    if (
      !messageData ||
      (!messageData.text && !messageData.file && !messageData.audio)
    ) {
      Toast.show("Message cannot be empty", Toast.LONG); 
      return;
    }
    if (!selectedUser) {
      Toast.show("No user selected", Toast.LONG); 
      return;
    }
    const newMessage = {
      mobile_id: selectedUser,
      text: messageData.text || "",
      file: messageData.file || null,
      audio: messageData.audio || null,
      message_by: messageData.message_by,
      name: messageData.name,
      seen: messageData.seen,
      isSender: messageData.isSender,
      timestamp: new Date().toISOString(),
      created_at: getISTDate(),
    };
    const { file } = newMessage;
    const isValidFile = file ? validateFileType(file) : false;
    if (chatType === "deposit") {
      setDepositMessages((prevMessages) => [...prevMessages, newMessage]);
    //   console.log("recieved form soceet---------",depositmessages)
      if (isValidFile) {
        const success = await sendFile(file, selectedUser);
        if (success) {
          newMessage.file = true;
        }
      }
      socket.emit("sendDepositMessage", {
        mobile_id: selectedUser,
        messageData: newMessage,
      });
    } else if (chatType === "withdraw") {
      setwithdraw_message((prevMessages) => [...prevMessages, newMessage]);
      if (isValidFile) {
        const success = await sendFile(file, selectedUser);
        if (success) {
          newMessage.file = true;
        }
      }
      socket.emit("sendWithdrawMessage", {
        mobile_id: selectedUser,
        messageData: newMessage,
      });
    }
  };

  return {
    depositUsers,
    withdrawUsers,
    selectUserChat,
    depositmessages,
    withdraw_message,
    sendMessage,
    selectedUser,
    chatType,
  };
};

export default WithdrawDepositChatSocket;
