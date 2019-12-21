import React from "react";
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
// import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
// import { Transition } from 'react-native-reanimated';

import Drawer from "./navigators/drawerNavigator";
import LoginScreen from "./screens/login";
import SignUpScreen from "./screens/signup";
import AuthLoading from "./screens/authLoading";
import ForgotPassword from "./screens/forgotPassword";
import { mapping, light as lightTheme } from "@eva-design/eva";
import { ApplicationProvider, Layout } from "react-native-ui-kitten";

const navigatorConfig = {
  initialRouteName: "AuthLoading"
  // transition: (
  //     <Transition.Together>
  //         <Transition.Out
  //         type="slide-top"
  //         durationMs={200}
  //         interpolation="easeIn"
  //         />
  //         <Transition.In type="slide-bottom" durationMs={400} />
  //         <Transition.In type="fade" durationMs={300} />
  //     </Transition.Together>
  // ),
};

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: {
      screen: AuthLoading
    },
    Login: {
      screen: LoginScreen
    },
    SignUp : {
      screen: SignUpScreen
    },
    Drawer: {
      screen: Drawer
    },
    ForgotPassword: {
        screen: ForgotPassword
    }
  },
  navigatorConfig
);

const AppContainer = createAppContainer(RootNavigator);
class App extends React.Component {
  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener;
    // this.notificationOpenedListener;
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('fcmToken:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('fcmToken:', fcmToken);
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // const { title, body } = notification;
      console.log('onNotification:');
      
        // const localNotification = new firebase.notifications.Notification({
        //   sound: 'sampleaudio',
        //   show_in_foreground: true,
        // })
        // .setSound('sampleaudio.wav')
        // .setNotificationId(notification.notificationId)
        // .setTitle(notification.title)
        // .setBody(notification.body)
        // .android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
        // .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
        // .android.setColor('#000000') // you can set a color here
        // .android.setPriority(firebase.notifications.Android.Priority.High);

        // firebase.notifications()
        //   .displayNotification(localNotification)
        //   .catch(err => console.error(err));
    });

    const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
      .setDescription('Demo app description')
      .setSound('sampleaudio.wav');
    firebase.notifications().android.createChannel(channel);

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //   const { title, body } = notificationOpen.notification;
    //   console.log('onNotificationOpened:');
    //   Alert.alert(title, body)
    // });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.log('getInitialNotification:');
      Alert.alert(title, body)
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log("JSON.stringify:", JSON.stringify(message));
    });
  }

  render() {
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <AppContainer />
      </ApplicationProvider>
    );
  }
}
export default App;
