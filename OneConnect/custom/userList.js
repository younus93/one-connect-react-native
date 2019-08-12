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

export default class UserList extends React.Component {
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
    // this.props.navigation.setParams({ title: I18n.t("Notifications") });
    this.type = ["Birthdays", "Friend requests"];
    this.data = null;
    this.state = {
      loading: true,
      updateToggle: false,
      section: this.props.section
    };
  }
  shouldComponentUpdate = (nextProps) => {
      console.log("shouldComponentUpdate",nextProps)
      return true;
  }
  componentDidMount() {
    console.log("user list mounted");
  
  }

  componentWillUnmount() {
    // Manager.removeListener("NOTIFICATION_S", this._notificationSuccess);
    // Manager.removeListener("NOTIFICATION_E", this._notificationError);
    // Manager.removeListener("NOTIFICATION_U", this._refresh);
    // Manager.removeListener("LANG_U", this._updateLanguage);
  }

  

 

 

  

  _navigateUser = item => {
    this.props.navigation.navigate("Profile", { url: item.url });
  };
  

  _navigateMate = item => {
    console.log("pressed item :", item);
    this.props._navigateMate(item)
  };

  _accept = id => {
    // Manager.friendRequest("/api/friend-request/accept", "POST", {
    //   professional_id: id
    // });
    // this._refresh();
    // this.refs.toast.show("Friend request accepted", 500, () => {});
    this.props._accept(id)
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
                    onPress={() => this._navigateMate(item.sender.resource_url)}
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
                          style={[styles.acceptButton,{backgroundColor:"#3b5998"}]}
                        >
                          <Icon
                            name="check-circle"
                            size={20}
                            color={Colors.primary}
                            style={[styles.acceptButton]}
                          />
                          <Text style={{padding:10,color:Colors.primary}}>Confirm</Text>
                        </Button>
                        <Button
                          onPress={() => this._deny(item.sender.id)}
                          key={`pelt-deny-de${Math.random(1)}`}
                          style={[styles.acceptButton,{backgroundColor:"#dfe3ee"}]}
                        >
                          <Icon
                            name="times-circle"
                            size={20}
                            color={Colors.onPrimary}
                            style={[styles.acceptButton]}
                          />
                          <Text style={{padding:10,paddingRight:15,color:Colors.onPrimary}}>Delete</Text>
                        </Button>
                      </View>
                    </View>
                  </Button>
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
    return null;
  };

  render() {
      console.log('render',this.state.section)
    return (
      <View style={styles.container}>
        {this._renderUsers(this.props.section)}
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
    borderRadius: 22,
    
  }
});
