import { createStackNavigator, createAppContainer } from "react-navigation";
import Notification from "../screens/notification";
import UserList from "../custom/userList";
import Profile from "../screens/profile";
import OpenFeed from "../screens/openFeed";
import { Colors } from "../constants";

const navigatorConfig = {
  initialRouteName: "Notification",
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: Colors.primary,
      borderBottomWidth: 0
    },
    headerTitleStyle: {
      fontSize: 17
    },
    headerTintColor: Colors.onPrimary,
    headerTitleAllowFontScaling: false,
    headerBackTitle: null
  }
};

const NotificationStack = createStackNavigator(
  {
    Notification: {
      screen: UserList
    },
    OpenFeed: {
      screen: OpenFeed
    },
    Profile: {
      screen: Profile
    }
  },
  navigatorConfig
);

export default NotificationStack;
