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
export default class SearchUserList extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: "",
        header: null
    });

    constructor(props) {
        console.log(props);
        super(props);
        console.log("Entered");
        this.state = {
            loading: false,
            userList: this.props.userList
        };
        console.log(this.state);
    }

    componentDidMount() {
        console.log("search component did mount");
        // this.props.navigation.setParams({ backButton: this._backButtonPressed });
        Manager.addListener("F_REQUEST_S", this._friendRequestSuccess);
    }

    componentWillUnmount() {
        console.log("search component will unmount");
        Manager.removeListener("F_REQUEST_S", this._friendRequestSuccess);
    }

    _navigateUser = item => {
        console.log(this.props);
        this.props.navigation.navigate("Profile", { url: item.url });
    };

    _sendFriendRequest = id => {
        console.log("sending friend request");
        this.requestType = "S";
        Manager.friendRequest("/api/friend-request/send", "POST", {
            professional_id: id
        });
        // this._refresh();
    };

    _friendRequestSuccess = response => {
        console.log("Friend Request");
        let userList = this.state.userList.filter(item => {
            if (item.id == response.profile.id) {
                if (this.requestType == "S")
                    item.friends_meta.has_sent_friend_request_to_this_profile = true;
                else
                    item.friends_meta.has_sent_friend_request_to_this_profile = false;
            }
            return item;
        });
        this.setState({ ...this.state, userList: userList });
        Toast.showWithGravity(response.message, Toast.SHORT, Toast.TOP)
    }


    _unFriend = id => {
        this.requestType = "U";
        Manager.friendRequest("/api/friend-request/unfriend", "POST", {
            professional_id: id
        });
        // this._refresh();
    };

    _unfriendRequestSuccess = response => {
        let userList = this.state.userList.filter(item => {
            if (item.searchable.basic.id == response.profile.id) {
                item.searchable.friends_meta.has_sent_friend_request_to_this_profile = true;
            }
            return item;
        });
        this.setState({ ...this.state, userList: userList });
        Toast.show(response.message);
    }


    render() {
        return (
            <View>
                <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
                    <Text style={styles.bodyHeader}>{I18n.t("Users")}</Text>
                </View>
                <View style={styles.userSectionBody}>
                    {!this.state.loading &&
                        this.state.userList.map(item => {
                            return (
                                <View style={styles.userBody}>
                                    <View>
                                        <Button
                                            onPress={() => this._navigateUser(item)}
                                            key={`pelt-${Math.random(1)}`}
                                            style={[styles.item]}
                                        >
                                            <View>
                                                <Image
                                                    style={styles.image}
                                                    source={{
                                                        uri: item.profile_pic
                                                    }}
                                                    defaultSource={require("../resources/dummy_profile.png")}
                                                    resizeMode="cover"
                                                    onError={error => console.log(error)}
                                                />
                                            </View>
                                            <View style={{ width: "100%", flexShrink: 1 }}>
                                                <Text
                                                    style={[
                                                        styles.itemText,
                                                        { fontWeight: "600", fontSize: 16 }
                                                    ]}
                                                >
                                                    {item.f_name} {item.l_name}
                                                </Text>
                                                { item.extra_info ?  
                                                <Text style={styles.mutualFriendsCount}>
                                                    {item.extra_info}                                                            
                                                </Text>
                                                : null }
                                                <Text style={styles.mutualFriendsCount}>
                                                    {
                                                        item.friends_meta
                                                            .mutual_friends_count
                                                    }{" "}
                                                    {I18n.t("Mutual_friends")}
                                                </Text>                                            
                                            </View>
                                            {item.friends_meta.has_sent_friend_request_to_this_profile ?
                                                <View>
                                                    <Button
                                                        onPress={() => this._unFriend(item.id)}
                                                        key={`pelt-${Math.random(1)}`}
                                                        style={[styles.item]}
                                                    >
                                                        <Icon
                                                            name="user-minus"
                                                            size={22}
                                                            color={Colors.yellowDark}
                                                            style={{ padding: 10 }}
                                                        />
                                                    </Button>
                                                </View>
                                                :
                                                <View>
                                                <Button
                                                    onPress={() => this._sendFriendRequest(item.id)}
                                                    key={`pelt-${Math.random(1)}`}
                                                    style={[styles.item]}
                                                >
                                                    <Icon
                                                        name="user-plus"
                                                        size={22}
                                                        color={Colors.yellowDark}
                                                        style={{ padding: 10 }}
                                                    />
                                                </Button>
                                            </View>
                                            }

                                        </Button>
                                    </View>
                                    <View style={styles.separator} />
                                </View>
                            );
                        })}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    resourceImage: {
        height: 60,
        width: 60,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    bodyHeader: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.onPrimary,
        // opacity: 0.4
    },
    sectionBody: {
        backgroundColor: Colors.surface
    },
    userSectionBody: {
        backgroundColor: Colors.background
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
        fontWeight: "400"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        height: 46,
        backgroundColor: Colors.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.background
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
        borderRadius: 50,
        width: 100,
        height: 100
    },
    mutualFriendsCount: {
        fontSize: 12,
        fontWeight: "300",
        paddingLeft: 10
    },
    buttons: {
        justifyContent: "flex-start",
        flexDirection: "row",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#3b5998",
        marginLeft: 10,
        marginTop: 10,
        backgroundColor: "#3b5998",
        borderRadius: 22,
        width: "35%"
    },
    separator: {
        width: "100%",
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.background,
        marginTop: 5
    },
    acceptButton: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignSelf: "center"
    },
    userBody: {
        backgroundColor: Colors.surface,
        marginBottom: 0,
        borderBottomColor : Colors.grey,
        borderBottomWidth : 1,
        paddingBottom: 0
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
    CircleShapeView: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        width: 80,
        height: 80,
        borderRadius: 40,
    }
});
