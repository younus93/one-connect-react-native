import { createStackNavigator, createAppContainer } from "react-navigation";
import Friends from "../screens/friends";
import Profile from "../screens/profile";
import FriendAndRequest from "../screens/friendAndRequest";
import { Colors } from "../constants";

const navigatorConfig = {
  initialRouteName: "Friends",
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

const FriendsStack = createStackNavigator(
  {
    Friends: {
      screen: Friends
    },
    Profile: {
      screen: Profile
    },
    FriendAndRequest: {
      screen: FriendAndRequest
    }
  },
  navigatorConfig
);

export default FriendsStack;
