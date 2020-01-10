import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard
} from "react-native";
import { DrawerActions } from "react-navigation-drawer";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import Icon from "react-native-vector-icons/FontAwesome5";
import I18n from "../service/i18n";
import Toast, { DURATION } from "react-native-easy-toast";
import Header from "./Header";
const UUID = require("uuid");
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class UserList extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });
  constructor(props) {
    super(props);
    this.props.navigation.setParams({ title: I18n.t("Notifications") });
    this.type = ["Birthdays", "Friend requests"];
    this.data = null;
    this.state = {
      birthdays: [],
      loading: true,
      updateToggle: false,
      section: this.props.section
    };
  }
  shouldComponentUpdate = nextProps => {
    console.log("shouldComponentUpdate", nextProps);
    return true;
  };
  componentDidMount() {
    console.log("hi3333", "hello");
    this.props.navigation.addListener("didFocus", this._refresh);
    this.props.navigation.setParams({ backButton: this._backButtonPressed });
    Manager.addListener("NOTIFICATION_S", this._notificationSuccess);
    Manager.addListener("NOTIFICATION_E", this._notificationError);
    Manager.addListener("NOTIFICATION_U", this._refresh);
    Manager.addListener("LANG_U", this._updateLanguage);
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
    console.log("hi333", data);
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

  _accept = id => {
    // Manager.friendRequest("/api/friend-request/accept", "POST", {
    //   professional_id: id
    // });
    // this._refresh();
    // this.refs.toast.show("Friend request accepted", 500, () => {});
    this.props._accept(id);
  };
  _deny = id => {
    console.log("Deny");
    // Manager.friendRequest("/api/friend-request/deny", "POST", {
    //   professional_id: id
    // });
    // this._refresh();
    // this.refs.toast.show("Friend request rejected", 500, () => {});
    this.props._deny(id);
  };
  _renderUsers = section => {
    console.log("friend messages : ", section);
    if (section && section.length > 0) {
      console.log("data availabe");
      return (
        <View>
          <View style={styles.friendReqSectionBody}>
            {section.map(item => {
              return (
                <View
                  key={`pelt-${Math.random(1)}`}
                  style={styles.friendReqBody}
                >
                  <Button
                    onPress={() => this._navigateUser(item)}
                    style={styles.item}
                  >
                    <View>
                      <Image
                        style={styles.image}
                        source={{ uri: item.profile_pic }}
                        resizeMode="cover"
                        onError={error => console.log(error)}
                      />
                      <Image
                        style={{
                          width: 120,
                          height: 120,
                          position: "absolute"
                        }}
                        source={require("../resources/ic_white_hex.png")}
                      />
                    </View>
                    <View style={styles.profileContainer}>
                      <Text style={styles.name}>
                        {item.f_name + " " + item.l_name}
                      </Text>

                      <Text style={styles.mutualFriendsCount}>
                        {item.extra_info}
                      </Text>
                      <Text style={styles.mutualFriendsCount}>
                        {item.friends_meta.mutual_friends_count}{" "}
                        {I18n.t("Mutual_friends")}
                      </Text>
                      <View style={styles.tags}>
                        {item.tags.map(tag => (
                          <Text style={styles.tag} key={UUID.v4()}>
                            {tag.name}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </Button>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.grey
                    }}
                  />
                </View>
              );
            })}
          </View>
          <Toast
            ref="toast"
            style={{ backgroundColor: Colors.onPrimary }}
            position="bottom"
            positionValue={200}
            fadeInDuration={200}
            fadeOutDuration={200}
            opacity={0.8}
            textStyle={{ color: Colors.primary }}
          />
        </View>
      );
    }
    return (
      <View style={styles.noItem}>
        <Text style={styles.itemText}>{I18n.t("No_birthday_alerts")}</Text>
      </View>
    );
  };

  render() {
    console.log("render", this.state.section);
    const { navigation } = this.props;

    if (!this.state.loading)
      return (
        <View style={{ width: "100%", height: "100%" }}>
          <Header
            navigation={navigation}
            title={navigation.getParam("title")}
            isBack={false}
          />
          <DismissKeyboard>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={styles.container}
            >
              <View style={styles.container}>
                {this._renderUsers(this.state.birthdays)}
              </View>
            </KeyboardAvoidingView>
          </DismissKeyboard>
        </View>
      );
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <Header navigation={navigation} title={navigation.getParam("title")} />
        <DismissKeyboard>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.container}
          >
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
          </KeyboardAvoidingView>
        </DismissKeyboard>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    paddingVertical: 0
  },
  friendReqBody: {
    backgroundColor: Colors.surface,
    paddingBottom: 10
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingVertical: 20
  },
  itemText: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center"
  },
  noItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingVertical: 20,
    justifyContent: "center"
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
    marginTop: 5,
    paddingLeft: 10
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.background,
    marginTop: 5
  },
  acceptButton: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 22
  },
  tags: {
    fontSize: 12,
    fontWeight: "300",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingRight: 10,
    flexShrink: 1
  },
  tag: {
    paddingLeft: 10
  },
  profileContainer: {
    flexShrink: 1
  }
});
