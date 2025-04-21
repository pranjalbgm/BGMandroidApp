import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderThree from '../components/HeaderThree';
import NavFooter from '../components/NavFooter';
import appStyles from '../styles/appStyles';
import useNotification from '../hooks/useNotification';
import {fetchMobile} from '../hooks/useWallet';
import useCreateNotificatonSeen from '../hooks/useCreateNotificatonSeen';
import {imageApiClient} from '../constants/api-client';
import Video, {VideoRef} from 'react-native-video';

const NotificationScreen = () => {
  const {notifications, error, isLoading} = useNotification();
  const [mobile, setMobile] = useState('');

  const seeNotif = useCreateNotificatonSeen();

  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
           fetchMobile(setMobile);
         }, []); 
       
         useEffect(() => {
       
           if (mobile) {
             seeNotif.mutate({ mobile });
           }
         }, [mobile]);

  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderThree title={'Notification'} />
      {isLoading ? (
        // Show loading spinner while data is loading
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        // Show error message if there's an issue fetching data
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Error loading notifications. Please try again later.
          </Text>
        </View>
      ) : notifications && notifications.length > 0 ? (
        // Show notifications if available
        <ScrollView>
          <View style={{marginVertical: 20}}>
            {notifications?.map((notification:any) => (
              <View
                key={notification.id}
                style={{
                  backgroundColor: '#ECECEC',
                  padding: 20,
                  marginBottom: 20,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'left',
                    alignItems: 'flex-start',
                    marginBottom: 10,
                  }}>
                  <Image
                    source={require('../images/point.png')}
                    style={{marginRight: 10}}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#000000',
                      textAlign: 'left',
                      fontWeight: '500',
                      width: '92%',
                    }}>
                    {notification.heading}
                  </Text>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'left',
                    alignItems: 'flex-start',
                    marginBottom: 10,
                  }}>
                  <Image
                    source={require('../images/point.png')}
                    style={{marginRight: 10}}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#000000',
                      textAlign: 'left',
                      fontWeight: 400,
                      width: '92%',
                    }}>
                    {notification.message}
                  </Text>
                </View>

                {notification.link && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(notification.link).catch(err =>
                        console.error("Couldn't load page", err),
                      )
                    }
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'left',
                      alignItems: 'flex-start',
                      marginBottom: 10,
                    }}>
                    <Image
                      source={require('../images/point.png')}
                      style={{marginRight: 10}}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#0d6efd',
                        textAlign: 'left',
                        fontWeight: 400,
                        width: '92%',
                      }}>
                      {notification.link}
                    </Text>
                  </TouchableOpacity>
                )}

                {notification.file && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'left',
                      alignItems: 'flex-start',
                      marginBottom: 10,
                    }}>
                    {notification.file.endsWith('.mp3') && (
                      <audio controls>
                        <source
                          src={imageApiClient + notification.file}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    {(notification.file.endsWith('.png') ||
                      notification.file.endsWith('.jpg') ||
                      notification.file.endsWith('.jpeg') ||
                      notification.file.endsWith('.gif')) && (
                      <Image
                        source={{uri: imageApiClient + notification.file}}
                        style={{
                          marginRight: 10,
                          width: '100%',
                          height: 200,
                          borderRadius: 10,
                        }}
                      />
                    )}
                    {(notification.file.endsWith('.mp4') ||
                      notification.file.endsWith('.webm') ||
                      notification.file.endsWith('.ogg')) && (
                      <Video
                        ref={videoRef}
                        controls={true}
                        paused={true}
                        allowsExternalPlayback={true}
                        style={{
                          width: '100%',
                          height: 200,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                        }}
                        source={{uri: imageApiClient + notification.file}}
                      />
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        // Show "No Data Found" message if there are no notifications
        <View style={styles.center}>
          <Text style={styles.noDataText}>No notifications found.</Text>
        </View>
      )}
      <NavFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default NotificationScreen;
