import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Image
} from "react-native";
import { DrawerActions } from "react-navigation-drawer";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import Icon from "react-native-vector-icons/FontAwesome5";
import I18n from "../service/i18n";
import Toast, { DURATION } from "react-native-easy-toast";
import UserList from "../custom/userList";
export default class Notification extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    headerLeft: (
      <Button
        style={{ borderRadius: 20 }}
        onPress={navigation.getParam("hamPressed")}
      >
        <Icon
          name="bars"
          size={22}
          color={Colors.onPrimary}
          style={{ padding: 10 }}
        />
      </Button>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 15
    }
  });

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ title: I18n.t("Notifications") });
    this.type = ["Birthdays", "Friend requests"];
    this.data = null;
    this.state = {
      loading: true,
      updateToggle: false
    };
  }

  componentDidMount() {
    console.log("notification component did mount");
    this.props.navigation.setParams({ backButton: this._backButtonPressed });
    Manager.addListener("NOTIFICATION_S", this._notificationSuccess);
    Manager.addListener("NOTIFICATION_E", this._notificationError);
    Manager.addListener("NOTIFICATION_U", this._refresh);
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
    console.log("notification data : ", data);
    this.data = data.data;
    this.setState({
      loading: false,
      incomingFriendships: data.data.incomingFriendships
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
  _renderBirthdays = section => {
    console.log("birthday section : ", section);
    if (section && section.length > 0) {
      console.log("data availabe");
      return (
        <View>
          <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
            <Text style={styles.bodyHeader}>Birthdays</Text>
          </View>
          <View style={styles.sectionBody}>
            {section.map(item => {
              return (
                <Button
                  onPress={() => this._navigateUser(item)}
                  key={`pelt-${Math.random(1)}`}
                  style={[styles.item]}
                >
                  <View>
                    <Image
                      style={styles.image}
                      source={{ uri: item.searchable.basic.profile_pic }}
                      defaultSource={require("../resources/in_2.jpg")}
                      resizeMode="cover"
                      onError={error => console.log(error)}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.itemText,
                        { fontWeight: "600", fontSize: 16 }
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                </Button>
              );
            })}
          </View>
        </View>
      );
    }
    return null;
  };
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

  _renderBatchMessages = section => {
    console.log("batch messages : ", section);
    if (section && section.length > 0) {
      console.log("data availabe");
      return (
        <View>
          <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
            <Text style={styles.bodyHeader}>Posts</Text>
          </View>
          <View style={styles.sectionBody}>
            {section.map(item => {
              return (
                <Button
                  onPress={() => this._navigatePost(item)}
                  key={`pelt-${Math.random(1)}`}
                  style={[styles.item]}
                >
                  <View>
                    <Text
                      style={[
                        styles.itemText,
                        { fontWeight: "600", fontSize: 16 }
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                </Button>
              );
            })}
          </View>
        </View>
      );
    }
    return null;
  };

  _navigateMate = item => {
    console.log("pressed items :", item);
    this.props.navigation.navigate("Profile", {
      url: item
    });
  };

  _accept = id => {
    Manager.friendRequest("/api/friend-request/accept", "POST", {
      professional_id: id
    });
    this._refresh();
    this.refs.toast.show("Friend request accepted", 500, () => {});
  };
  _deny = id => {
    console.log("Deny");
    Manager.friendRequest("/api/friend-request/deny", "POST", {
      professional_id: id
    });
    this._refresh();
    this.refs.toast.show("Friend request rejected", 500, () => {});
  };
  _renderFriendRequest = section => {
    console.log("friend messages : ", section);
    if (section && section.length > 0) {
      console.log("data availabe");
      return (
        <View>
          <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
            <Text style={styles.bodyHeader}>Friend Request</Text>
          </View>
          <View style={styles.friendReqSectionBody}>
            {section.map(item => {
              return (
                <View
                  key={`pelt-${Math.random(1)}`}
                  style={styles.friendReqBody}
                >
                  <Button
                    onPress={() => this._navigateMate(item)}
                    style={styles.item}
                  >
                    <View>
                      <Image
                        style={styles.image}
                        source={{ uri: item.sender.profile_pic }}
                        resizeMode="cover"
                        onError={error => console.log(error)}
                      />
                    </View>
                    <View style={styles.profileContainer}>
                      <Text style={styles.name}>
                        {item.sender.f_name + " " + item.sender.l_name}
                      </Text>
                      <Text style={styles.mutualFriendsCount}>
                        {item.sender.friends_meta.mutual_friends_count}{" "}
                        {I18n.t("Mutual_friends")}
                      </Text>
                      <View style={styles.buttons}>
                        <Button
                          onPress={() => this._accept(item.sender.id)}
                          key={`pelt-accept-${Math.random(1)}`}
                          style={[
                            styles.acceptButton,
                            { backgroundColor: "#3b5998" }
                          ]}
                        >
                          <Icon
                            name="check-circle"
                            size={20}
                            color={Colors.primary}
                            style={[styles.acceptButton]}
                          />
                          <Text style={{ padding: 10, color: Colors.primary }}>
                            Confirm
                          </Text>
                        </Button>
                        <Button
                          onPress={() => this._deny(item.sender.id)}
                          key={`pelt-deny-de${Math.random(1)}`}
                          style={[
                            styles.acceptButton,
                            { backgroundColor: "#dfe3ee" }
                          ]}
                        >
                          <Icon
                            name="times-circle"
                            size={20}
                            color={Colors.onPrimary}
                            style={[styles.acceptButton]}
                          />
                          <Text
                            style={{
                              padding: 10,
                              paddingRight: 15,
                              color: Colors.onPrimary
                            }}
                          >
                            Delete
                          </Text>
                        </Button>
                      </View>
                    </View>
                  </Button>
                </View>
              );
            })}
          </View>
        </View>
      );
    }
    return null;
  };

  render() {
    console.log('incomingFriendships',this.state)
    return (
      <View style={styles.container}>
        {this.state.loading ? (
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
        ) : null}
        <ScrollView>
          {this.data ? this.data.birthdays.length > 0 ||
          this.data.batch_messages.length > 0 ||
          this.data.incomingFriendships.length > 0 ? (
            <View>
              {this._renderBirthdays(this.data.birthdays)}
              {this._renderBatchMessages(this.data.batch_messages)}
              {<UserList _accept={this._accept} _deny={this._deny} section={this.state.incomingFriendships} _navigateMate={this._navigateMate}/>}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: Colors.background,
                justifyContent: "center",
                alignItems: "center",
                opacity: 1,
                width: "100%",
                paddingTop: 20
              }}
            >
              <Text
                style={{
                  color: Colors.secondaryDark,
                  fontSize: 22,
                  fontWeight: "700",
                  opacity: 0.4
                }}
              >
                {I18n.t("No_Notifications_yet")}
              </Text>
            </View>
          ) : null}
        </ScrollView>
        <Toast
          ref="toast"
          style={{ backgroundColor: Colors.onPrimary }}
          position="bottom"
          positionValue={200}
          fadeInDuration={100}
          fadeOutDuration={100}
          opacity={0.8}
          textStyle={{ color: Colors.primary }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
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
    paddingVertical: 20
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
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 22
  }
});
