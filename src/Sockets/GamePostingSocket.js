import { useEffect, useState } from 'react';
import { socket } from "../constants/api-client";
import Toast from 'react-native-simple-toast';

import useGamePosting from '../hooks/useGamePosting';
import { usePlayerDataFetch } from '../hooks/useHome';
import { fetchMobile } from '../hooks/useWallet';

const useSocket = () => {
    const { gamePosting:gamePostingPrevData, refetch:refetchmessage } = useGamePosting();  // Fetch previous data
    const [mobile, setMobile] = useState('');
    const { data:playerData, refetch} = usePlayerDataFetch(mobile);
      useEffect(() => {
        const initializeMobile = async () => {
          const fetchedMobile = await fetchMobile(setMobile);
          if (fetchedMobile && mobile) {
            // playerInfo.mutate({ mobile: fetchedMobile });
            refetch()
          }
        };
        initializeMobile();
      }, []);
    
    const username = playerData?.name;


    // Initialize messages with previous game posting data
    const [messages, setMessages] = useState([]);
    const [pinnedMessage, setPinnedMessage] = useState([]);

    const [connectionStatus, setConnectionStatus] = useState(false);

    useEffect(() => {
        if (gamePostingPrevData && gamePostingPrevData.length > 0) {
            setMessages(gamePostingPrevData);
        }
    }, [gamePostingPrevData]);

    const handleConnect = () => {
        setConnectionStatus(true);
        if (username) {
            socket.emit('registerUser', username);
            socket.emit("joinGamePostingChat", { mobile: mobile });  
            Toast.show('Connected to the server and registered user', Toast.LONG);
            refetch()
        }
    };

    useEffect(() => {
        if (!socket || typeof socket.on !== 'function') {
            return;
        }

        const handleDisconnect = () => {
            setConnectionStatus(false);
            Toast.show('Disconnected from the server', Toast.LONG);
        };

        const handleMessage = (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);  
            
        };

        const handlePinnedMsg = ({ message, username }) => {
                setPinnedMessage({ message, username }); 
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on("receivedGamePostingMessage", handleMessage);
        socket.on("pinMessage",handlePinnedMsg);

        if (socket.connected && username) {
            socket.emit('registerUser', username);
            Toast.show('Connected to the server and registered user', Toast.LONG);
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off("receivedGamePostingMessage", handleMessage);
            socket.off("pinMessage");
        };
    }, [username]);

    const gameSubmitChat = (message) => {
        if (!message) {
            Toast.show('Please fill the inputs correctly', Toast.LONG);
            return;
        }
        if (!connectionStatus) {
            socket.on('connect', handleConnect);
        }
        socket.emit("sendGamePostingMessage", message);
    };
    const gamePinnedChat = (message) => {
        if (!message) {
            Toast.show('Please fill the inputs correctly', Toast.LONG);
            return;
        }
        if (!connectionStatus) {
            socket.on('connect', handleConnect);
        }
        console.log("this is username",username)
        socket.emit("pinMessage", { message, username });
    };


    return {
        gameSubmitChat,
        messages,
        gamePinnedChat,
        pinnedMessage,
        refetchmessage,
    };
};

export default useSocket;

















// import { useEffect, useState } from 'react';
// import { socket } from "../constants/api-client";
// import { toast } from 'react-toastify';
// import { useUser } from '../constants/UserContext';
// import useGamePosting, { useGamePostingQuery } from '../hooks/useGamePosting';
// import { usePlayerDataFetch } from '../hooks/useHome';

// const useSocket = () => {
//     const { gamePosting:gamePostingPrevData } = useGamePosting();  // Fetch previous data
//     const { mobileNumber } = useUser();
//        const { data:playerData, refetch} = usePlayerDataFetch(mobileNumber);
//        const { gamePostingquery, fetchNextPage, hasNextPage, isFetchingNextPage } = useGamePostingQuery();
//     const username = playerData?.name;
//     // console.log("----------------------------------",gamePostingquery)


//     // Initialize messages with previous game posting data
//     const [messages, setMessages] = useState([]);
//     const [pinnedMessage, setPinnedMessage] = useState([]);

//     const [connectionStatus, setConnectionStatus] = useState(false);

//     useEffect(() => {
//         if (gamePostingquery.length !== messages.length) {
//             setMessages([...gamePostingquery]);
//         }
//     }, [gamePostingquery]);
    
    

//     const handleConnect = () => {
//         setConnectionStatus(true);
//         if (username) {
//             socket.emit('registerUser', username);
//             socket.emit("joinGamePostingChat", { mobile: mobileNumber });  
//             toast.success('Connected to the server and registered user');
//             refetch()
//         }
//     };

//     useEffect(() => {
//         if (!socket || typeof socket.on !== 'function') {
//             return;
//         }

//         const handleDisconnect = () => {
//             setConnectionStatus(false);
//             toast.error('Disconnected from the server');
//         };

//         const handleMessage = (newMessage) => {
//             setMessages((prev) => [...prev, newMessage]);  
            
//         };

//         const handlePinnedMsg = ({ message, username }) => {
//                 setPinnedMessage({ message, username }); 
//         };

//         socket.on('connect', handleConnect);
//         socket.on('disconnect', handleDisconnect);
//         socket.on("receivedGamePostingMessage", handleMessage);
//         socket.on("pinMessage",handlePinnedMsg);

//         if (socket.connected && username) {
//             socket.emit('registerUser', username);
//             toast.success('Connected to the server and registered user');
//         }

//         return () => {
//             socket.off('connect', handleConnect);
//             socket.off('disconnect', handleDisconnect);
//             socket.off("receivedGamePostingMessage", handleMessage);
//             socket.off("pinMessage");
//         };
//     }, [username]);

//     const gameSubmitChat = (message) => {
//         if (!message) {
//             toast.error('Please fill the inputs correctly');
//             return;
//         }
//         if (!connectionStatus) {
//             socket.on('connect', handleConnect);
//         }
//         socket.emit("sendGamePostingMessage", message);
//     };
//     const gamePinnedChat = (message) => {
//         if (!message) {
//             toast.error('Please fill the inputs correctly');
//             return;
//         }
//         if (!connectionStatus) {
//             socket.on('connect', handleConnect);
//         }
//         console.log("this is username",username)
//         socket.emit("pinMessage", { message, username });
//     };


//     return {
//         gameSubmitChat,
//         messages,
//         gamePinnedChat,
//         pinnedMessage,
//         fetchNextPage, 
//         hasNextPage,
//         isFetchingNextPage
//     };
// };

// export default useSocket;
