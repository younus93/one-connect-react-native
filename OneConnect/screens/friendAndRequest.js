import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Dimensions,
  Image
} from "react-native";
import { DrawerActions } from "react-navigation-drawer";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import Icon from "react-native-vector-icons/FontAwesome5";
import I18n from "../service/i18n";
// import Toast, { DURATION } from "react-native-easy-toast";
import Toast from "react-native-simple-toast";
import UserList from "../custom/userList";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import SearchUserList from "../custom/searchUserList";
import FriendRequestList from "../custom/FriendRequests";
import Friends from "./friends";
import Header from "../custom/Header";

export default class FriendAndRequest extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    header: null
  });

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ title: I18n.t("Friends") });
    this.type = ["Friends", "Requests"];
    this.data = null;
    this.state = {
      birthdays: [],
      loading: true,
      updateToggle: false,
      index: 0,
      routes: [
        { key: "first", title: I18n.t("Friends") },
        { key: "second", title: I18n.t("Requests") }
      ]
    };
  }

  componentDidMount() {
    console.log("notification component did mount");
    this.props.navigation.setParams({ backButton: this._backButtonPressed });
    Manager.addListener("NOTIFICATION_S", this._notificationSuccess);
    Manager.addListener("NOTIFICATION_E", this._notificationError);
    Manager.addListener("NOTIFICATION_U", this._refresh);
    Manager.addListener("F_REQUEST_S", this._friendRequestSuccess);
    Manager.addListener("LANG_U", this._updateLanguage);

    Manager.notification(`/api/notifications`, "GET");
    this.props.navigation.setParams({ hamPressed: this._hamPressed });
  }

  componentWillUnmount() {
    Manager.removeListener("NOTIFICATION_S", this._notificationSuccess);
    Manager.removeListener("NOTIFICATION_E", this._notificationError);
    Manager.removeListener("NOTIFICATION_U", this._refresh);
    Manager.removeListener("LANG_U", this._updateLanguage);
  }

  _updateLanguage = () => {
    this.props.navigation.setParams({ title: I18n.t("Notifications") });
    this.setState(previousState => {
      updateToggle: !previousState.updateToggle;
    });
  };

  _hamPressed = () => {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  };

  _refresh = () => {
    console.log("refreshing notification");
    this.data = null;
    this.state = {
      loading: true
    };
    Manager.notification(`/api/notifications`, "GET");
  };

  _notificationSuccess = data => {
    console.log("Notifications are success");
    this.data = data.data;
    console.log(data);
    this.setState({
      loading: false,
      incomingFriendships: data.data.incomingFriendships,
      birthdays: data.data.birthdays.map(item => {
        let user = {};
        user.id = item.searchable.basic.id;
        user.f_name = item.searchable.basic.f_name;
        user.l_name = item.searchable.basic.l_name;
        user.profile_pic = item.searchable.basic.profile_pic;
        user.tags = item.searchable.tags;
        user.friends_meta = item.searchable.friends_meta;
        user.url = item.url;
        user.extra_info = item.birthdayString;
        return user;
      })
    });
    console.log(this.state);
  };

  _notificationError = error => {
    console.log("notification error : ", error);
  };

  _backButtonPressed = () => {
    console.log("back button pressed");
    const backAction = NavigationActions.back({
      key: null
    });
    this.props.navigation.dispatch(backAction);
  };

  _navigateUser = item => {
    this.props.navigation.navigate("Profile", { url: item.url });
  };
  _renderBirthdays = section => {};
  // return(
  //     <View style={{
  //         backgroundColor: Colors.background,
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         opacity: 1,
  //         width: '100%',
  //     }}>
  //         <Text style={{color: Colors.secondaryDark, fontSize: 16,fontWeight: '700', opacity: 0.4}}>You don't have any friend's birthday today.</Text>
  //     </View>
  // )

  _navigatePost = item => {
    this.props.navigation.navigate("OpenFeed", { item: item.searchable });
  };

  // _navigateMate = item => {
  //   console.log("pressed items :", item);
  //   this.props.navigation.navigate("Profile", {
  //     url: item
  //   });
  // };

  FirstRoute = () => {
    console.log("First Route");
    console.log(this.state);
    return <Friends navigation={this.props.navigation}></Friends>;
  };

  SecondRoute = () => {
    console.log("Seond route");
    console.log(this.state);
    if (this.state.incomingFriendships.length > 0)
      return (
        <FriendRequestList
          incomingFriendships={this.state.incomingFriendships}
          navigation={this.props.navigation}
        ></FriendRequestList>
      );
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{I18n.t("No_friend_requests")}</Text>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    if (!this.state.loading)
      return (
        <View style={{ width: "100%", height: "100%" }}>
          <Header
            title={I18n.t("Friends")}
            navigation={navigation}
            isBack={false}
          />
          <ScrollView>
            <TabView
              navigationState={this.state}
              renderScene={SceneMap({
                first: this.FirstRoute,
                second: this.SecondRoute
              })}
              onIndexChange={index => this.setState({ index })}
              initialLayout={{ width: Dimensions.get("window").width }}
              style={styles.container}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: Colors.yellowDark }}
                  style={{ backgroundColor: Colors.primaryLight }}
                  labelStyle={{ color: "#000000" }}
                />
              )}
            />
          </ScrollView>
        </View>
      );
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <Header
          title={I18n.t("Friends")}
          navigation={navigation}
          isBack={false}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10
          }}
        >
          <ActivityIndicator
            animating={this.state.loading}
            size="large"
            color={Colors.secondaryDark}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  bodyHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurface,
    opacity: 0.4
  },
  sectionBody: {
    paddingVertical: 20,
    backgroundColor: Colors.surface
  },
  friendReqSectionBody: {
    paddingVertical: 20
  },
  friendReqBody: {
    backgroundColor: Colors.primaryLight,
    marginBottom: 10,
    paddingBottom: 10
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface
  },
  itemText: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: "400"
  },
  header: {
    // flex: 1,
    flexDirection: "row",
    // justifyContent: 'flex-start',
    alignItems: "center",
    height: 46,
    backgroundColor: Colors.surface
  },
  search: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textInput: {
    height: "100%",
    width: "100%",
    fontSize: 18,
    paddingLeft: 5
  },
  drawerButton: {
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 20
  },
  image: {
    borderRadius: 60,
    width: 120,
    height: 120
  },
  mate: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    paddingLeft: 10,
    flexDirection: "row"
  },
  mutualFriendsCount: {
    fontSize: 12,
    fontWeight: "300",
    paddingLeft: 11
  },
  buttons: {
    justifyContent: "space-between",
    flexDirection: "row",
    textAlign: "center",
    marginTop: 5,
    width: "70%"
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.background,
    marginTop: 5
  },
  acceptButton: {
    justifyContent: "space-between",
    textAlign: "center",
    flexDirection: "row",
    width: "50%",
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 10
  },
  tags: {
    fontSize: 12,
    fontWeight: "300"
  },
  tag: {
    paddingLeft: 10
  }
});
