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

const navigatorConfig = {
  initialRouteName: "NewsFeed",
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
    }
  },
  navigatorConfig
);

export default FeedStack;
