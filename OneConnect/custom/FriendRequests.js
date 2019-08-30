import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Animated,
    Easing,
    Modal,
    TextInput
} from "react-native";

import Toast from 'react-native-simple-toast';

import { NavigationActions } from "react-navigation";
import { Colors } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import Button from "../custom/button";
import I18n from "../service/i18n";
import Manager from "../service/dataManager";
const UUID = require('uuid');
export default class FriendRequestList extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "",
        header: null
    });

    constructor(props) {
        console.log(props);
        super(props);
        console.log("Entered friends list");
        this.state = {
            loading: false,
            incomingFriendships: this.props.incomingFriendships
        };
        console.log(this.state);
    }

    componentDidMount() {
        // this.props.navigation.setParams({ backButton: this._backButtonPressed });
        Manager.addListener("F_REQUEST_S", this._friendRequestSuccess);
    }

    componentWillUnmount() {
        Manager.removeListener("F_REQUEST_S", this._friendRequestSuccess);
    }

    _accept = id => {
        this.requestType == "A";
        Manager.friendRequest("/api/friend-request/accept", "POST", {
          professional_id: id
        });
        // this._refresh();
        // this.refs.toast.show("Friend request accepted", 500, () => { });
      };
      _deny = id => {
        console.log("Deny");
        this.requestType = "D";
        Manager.friendRequest("/api/friend-request/deny", "POST", {
          professional_id: id
        });
        // this._refresh();
        // this.refs.toast.show("Friend request rejected", 500, () => { });
      };

      _friendRequestSuccess = response => {
        console.log("Friend Request from notification");
        let incomingFriendships = this.state.incomingFriendships.map(item => {
          if(item.sender.id == response.profile.id){
            item.sender.acceptedRequest = response.message;
          }
          return item;
        });
        this.setState({ ...this.state, incomingFriendships: incomingFriendships });
        console.log(this.state);
        Toast.showWithGravity(response.message, Toast.SHORT, Toast.TOP)
    }
    


    render() {
        return(
            <View>
              <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
                <Text style={styles.bodyHeader}>Friend Request</Text>
              </View>
              <View style={styles.friendReqSectionBody}>
                {this.state.incomingFriendships.map(item => {
                  console.log("inside render");
                  console.log(item);
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
                          <View style={styles.tags}>
                            {item.sender.tags.map(tag => (
                              <Text style={styles.tag} key={UUID.v4()}>
                                {tag.name}
                              </Text>
                            ))}
                          </View>
                          { !item.sender.acceptedRequest ?  
                          <View style={styles.buttons}>
                            <Button
                              onPress={() => this._accept(item.sender.id)}
                              key={`pelt-accept-${Math.random(1)}`}
                              style={[
                                styles.acceptButton,
                                { backgroundColor: Colors.yellowDark }
                              ]}
                            >
                            <Text style={{ textAlign: "center", padding: 10, color: Colors.onPrimary }}>
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
                              <Text
                                style={{
                                  padding: 10,
                                  paddingRight: 15,
                                  color: Colors.onPrimary
                                }}
                              >
                                Deny 
                              </Text>
                            </Button>
                          </View>
                          : <Text style={styles.mutualFriendsCount}>{item.sender.acceptedRequest}</Text> }
                        </View>
                      </Button>
                    </View>
                  );
                })}
              </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scene: {
      flex: 1,
    },
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
      textAlign : 'center',
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
      textAlign : "center",
      flexDirection: "row",
      width : '50%',
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
  