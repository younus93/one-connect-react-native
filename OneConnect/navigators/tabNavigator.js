import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import FeedStack from "./feedStackNavigator";
import ProfileStack from "./profileStackNavigator";
import SearchStack from "./searchStack";
import NotificationStack from "./notificationStack";
import FriendsStack from "./friendsStack";
import I18n from "../service/i18n";
import Manager from "../service/dataManager";

import { Colors } from "../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  label: {
    color: Colors.yellowDark,
    fontSize: 12,
    padding: 0,
    fontWeight: "900"
  }
});

class Lable extends React.Component {
  constructor(props) {
    super(props);
    Manager.addListener("LANG_U", this._updateLanguage);
    this.title = props.title;
    this.state = {
      lable: props.lable
    };
  }
  componentWillUnmount() {
    Manager.removeListener("LANG_U", this._updateLanguage);
  }

  _updateLanguage = () => {
    console.log("updating tab lable", this.title, I18n.t(this.title));
    this.setState({
      lable: I18n.t(this.title)
    });
  };

  render() {
    console.log("lable is : ", this.state.lable);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{this.state.lable}</Text>
      </View>
    );
  }
}

const Tabs = createAppContainer(
  createMaterialBottomTabNavigator(
    {
      FeedStack: {
        screen: FeedStack,
        navigationOptions: {
          //   tabBarOnPress: ({ defaultHandler }) => {
          //     defaultHandler();
          //     modifyHeader("Feed");
          //   },
          tabBarLabel: <Text style={styles.label}>●</Text>,
          tabBarIcon: ({ tintColor }) => (
            <View>
              <Icon style={[{ color: tintColor }]} size={25} name="home" />
            </View>
          )
        }
      },
      ProfileStack: {
        screen: ProfileStack,
        navigationOptions: {
          //   tabBarOnPress: ({ defaultHandler }) => {
          //     defaultHandler();
          //     modifyHeader("Notification");
          //   },
          tabBarLabel: <Text style={styles.label}>●</Text>,
          tabBarIcon: ({ tintColor }) => (
            <View>
              <Icon style={[{ color: tintColor }]} size={25} name="user" />
            </View>
          )
        }
      },
      SearchStack: {
        screen: SearchStack,
        navigationOptions: {
          //   tabBarOnPress: ({ defaultHandler }) => {
          //     defaultHandler();
          //     modifyHeader("Groups");
          //   },
          tabBarLabel: <Text style={styles.label}>●</Text>,
          tabBarIcon: ({ tintColor }) => (
            <View>
              <Icon style={[{ color: tintColor }]} size={25} name="search" />
            </View>
          )
        }
      },
      NotificationStack: {
        screen: NotificationStack,
        navigationOptions: {
          //   tabBarOnPress: ({ defaultHandler }) => {
          //     defaultHandler();
          //     modifyHeader("Friends");
          //   },
          tabBarLabel: <Text style={styles.label}>●</Text>,
          tabBarIcon: ({ tintColor }) => (
            <View>
              <Icon style={[{ color: tintColor }]} size={25} name="bell" />
            </View>
          )
        }
      },
      FriendsStack: {
        screen: FriendsStack,
        navigationOptions: {
          //   tabBarOnPress: ({ defaultHandler }) => {
          //     defaultHandler();
          //     modifyHeader("Chat");
          //   },
          tabBarLabel: <Text style={styles.label}>●</Text>,
          tabBarIcon: ({ tintColor }) => (
            <View>
              <Icon
                style={[{ color: tintColor }]}
                size={20}
                name="user-friends"
              />
            </View>
          )
        }
      }
    },
    {
      initialRouteName: "FeedStack",
      backBehavior: "history",
      resetOnBlur: true,
      activeColor: Colors.yellowDark,
      inactiveColor: Colors.onSecondary,
      barStyle: {
        backgroundColor: Colors.white,
        shadowOpacity: 0.4,
        left: 0,
        bottom: 0,
        right: 0
      }
    }
  )
);

export default Tabs;
