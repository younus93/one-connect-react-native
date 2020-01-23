import { createStackNavigator, createAppContainer } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import Button from "../custom/button";
import { Colors } from "../constants";

// Routes
import NewsFeed from "../screens/newsFeed";
import OpenFeed from "../screens/openFeed";
import Batch from "../screens/batch";
import Institution from "../screens/institution";
import Courses from "../screens/courses";
import BatchItem from "../screens/batchItem";
import BatchMates from "../screens/batchmates";
import Profile from "../screens/profile";
import ChangePassword from "../screens/changePassword";
import Privacy from "../screens/privacySetting";
import Terms from "../screens/termsCondition";
import I18n from "../service/i18n";

const navigatorConfig = {
  initialRouteName: "Profile",
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

const FeedStack = createStackNavigator(
  {
    NewsFeed: {
      screen: NewsFeed
    },
    OpenFeed: {
      screen: OpenFeed
    },
    Batch: {
      screen: Batch
    },
    Institution: {
      screen: Institution
    },
    Courses: {
      screen: Courses
    },
    BatchItem: {
      screen: BatchItem
    },
    BatchMates: {
      screen: BatchMates
    },
    Profile: {
      screen: Profile
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: () => ({
        title: I18n.t("Change_Password")
      })
    },
    Privacy: {
      screen: Privacy,
      navigationOptions: () => ({
        title: `PRIVACY`
      })
    },
    Terms: {
      screen: Terms,
      navigationOptions: () => ({
        title: `Terms & Conditions`
      })
    }
  },
  navigatorConfig
);

export default FeedStack;
