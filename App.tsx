import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import AllGameScreen from './src/screens/AllGameScreen';
import MoringStarScreen from './src/screens/MoringStarScreen';
import AppDetailsScreen from './src/screens/AppDetailsScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import PlayHistoryScreen from './src/screens/PlayHistoryScreen';
import WalletAddAmountScreen from './src/screens/WalletAddAmountScreen';
import FriendListScreen from './src/screens/FriendListScreen';
import TermsConditionScreen from './src/screens/TermsConditionScreen';
import HelpScreen from './src/screens/HelpScreen';
import BonusReportScreen from './src/screens/BonusReportScreen';
import BonusChildDetails from './src/screens/BonusChildDetails';
import ResultHistoryScreen from './src/screens/ResultHistoryScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import FriendRequestScreen from './src/screens/FriendRequestScreen';
import ChatScreen from './src/screens/ChatScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import WithdrawChat from './src/screens/WithdrawChat';
import ReferAndEarn from './src/components/ReferAndEarn';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import gamePostPage from './src/screens/GamePostPage';
import GamePostPage from './src/screens/GamePostPage';
import LoginWithMpin from './src/screens/LoginWithMpin';
import DatewisePlayHistory from './src/screens/DatewisePlayHistory';
import EditMpin from './src/screens/EditMpin';
import ForgotPassword from './src/screens/ForgotPassword';
import TipsAndTricks from './src/screens/TipsAndTricks';
import AddNewBankPage from './src/screens/AddNewBankPage';

// export const queryClient = new QueryClient();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      // cacheTime: 1000 * 60 * 10, // Cache stays for 10 minutes
      refetchOnWindowFocus: false, // Prevents auto-fetch on window focus
      retry: 1, // API request will retry only once if it fails
      refetchOnMount: false, // Prevents refetching when component mounts
      refetchOnReconnect: false, // Prevents refetching when the network reconnects
    },
    mutations: {
      retry: 1, // Mutations will retry only once
    },
  },
});


const Stack = createStackNavigator();
const App = () => {
  // Log a non-fatal error
  crashlytics().recordError(new Error('Test error'));

  // Log a custom key-value pair
  crashlytics().setAttribute('user_email', 'user@example.com');

  // Log a crash (useful for testing)
  crashlytics().crash();

  analytics().logEvent('event_name', {
    param: 'value',
  });

  

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="MpinScreen">
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AllGameScreen"
              component={AllGameScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MoringStarScreen"
              component={MoringStarScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AppDetailsScreen"
              component={AppDetailsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PlayHistoryScreen"
              component={PlayHistoryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EditMpin"
              component={EditMpin}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddNewBankPage"
              component={AddNewBankPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DatewisePlayHistory"
              component={DatewisePlayHistory}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WalletAddAmountScreen"
              component={WalletAddAmountScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FriendListScreen"
              component={FriendListScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TermsConditionScreen"
              component={TermsConditionScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TipsAndTricks"
              component={TipsAndTricks}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="HelpScreen"
              component={HelpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BonusReportScreen"
              component={BonusReportScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BonusChildDetails"
              component={BonusChildDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ResultHistoryScreen"
              component={ResultHistoryScreen}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen
              name="ReferAndEarnScreen"
              component={ReferAndEarn}
              options={{ headerShown: false }}
            /> */}
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MpinScreen"
              component={LoginWithMpin}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FriendRequestScreen"
              component={FriendRequestScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="WithdrawChat"
              component={WithdrawChat}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="GamePostPage"
              component={GamePostPage}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
