import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Switch
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { SafeAreaView, NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import IconSideBar from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../constants";
import Button from "../custom/button";
import Manager from "../service/dataManager";
import I18n, { SaveLocale } from "../service/i18n";
import Privacy from "../screens/privacySetting";
import Terms from "../screens/termsCondition";
export default class CustomDrawerContentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.url = props.navigation.getParam("url", "/api/profile");

    this.state = {
      switchValue: I18n.locale == "th" ? true : false,
      profile: {},
      loading: true,
      error: false,
      errorText: null
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", this.refreshPage);
    Manager.addListener("PROFILE_S", this._profileSuccess);
    Manager.addListener("PROFILE_E", this._profileError);
    Manager.profile(this.url, "GET");
    this.props.navigation.setParams({ backButton: this._backButtonPressed });
    this.props.navigation.setParams({ hamPressed: this._hamPressed });
  }

  _hamPressed = () => {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  };

  _backButtonPressed = () => {
    console.log("back button pressed");
    const backAction = NavigationActions.back({
      key: null
    });
    this.props.navigation.dispatch(backAction);
  };

  refreshPage = () => {
    Manager.profile(this.url, "GET");
  };

  componentWillUnmount() {
    console.log("profile unmouted");
    Manager.removeListener("PROFILE_S", this._profileSuccess);
    Manager.removeListener("PROFILE_E", this._profileError);
  }

  _profileSuccess = data => {
    console.log("hi23423", data);
    this.setState({
      loading: false,
      error: false,
      profile: data.data,
      errorText: null
    });
  };
  navigateToScreen = (route, props = null) => () => {
    console.log("Navigating to ", route);
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: props
    });
    console.log(navigateAction);
    this.props.navigation.dispatch(navigateAction);
  };

  _signOut = () => {
    AsyncStorage.removeItem("@appKey")
      .then(response => {
        console.log("token successfully removed");
        this.props.navigation.navigate("Login");
        //TODO: log out
      })
      .catch(error => {
        console.log("error logging out");
        //TODO: show error
      });
  };

  _toggleSwitch = newValue => {
    this.setState(previousState => ({
      switchValue: newValue
    }));

    newValue ? SaveLocale("th") : SaveLocale("en");
  };

  _needsUpdate = () => {
    console.log("profile needs update");
    this.setState({
      loading: true,
      error: false,
      errorText: null
    });
  };

  render() {
    const iconSize = 18;
    console.log(Manager);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ justifyContent: "center", width: "auto" }}>
            <View style={{ justifyContent: "center", marginLeft: "30%" }}>
              <Image
                style={styles.image}
                source={{
                  uri: Manager.profilePicUrl
                }}
                // defaultSource={require("../resources/dummy_profile.png")}
                resizeMode="cover"
                onError={error => console.log(error)}
              />
              <Image
                style={{
                  width: 100,
                  height: 100,

                  position: "absolute"
                }}
                source={require("../resources/ic_hex_yellow.png")}
              />
            </View>
            <Button
              onPress={this.navigateToScreen("Profile", { accessLevel: 1 })}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: "18%",
                  padding: 20,
                  alignItems: "center"
                }}
              >
                <View style={styles.textBody}>
                  <Text style={styles.bodyTextstyle}>
                    {I18n.t("View_Profile")}
                  </Text>
                </View>
              </View>
            </Button>
          </View>
        </View>
        <View style={styles.body}>
          <Button onPress={this.navigateToScreen("Batch")}>
            <View style={styles.item}>
              <View style={styles.icon}>
                <Icon
                  name="th-list"
                  size={iconSize}
                  color={Colors.primaryDark}
                />
              </View>
              <View style={styles.textBody}>
                <Text style={styles.bodyTextstyle}>{I18n.t("Batches")}</Text>
              </View>
            </View>
          </Button>

          <Button onPress={this.navigateToScreen("ChangePassword")}>
            <View style={styles.item}>
              <View style={styles.icon}>
                <Icon name="key" size={iconSize} color={Colors.primaryDark} />
              </View>
              <View style={styles.textBody}>
                <Text style={styles.bodyTextstyle}>
                  {I18n.t("Change_Password")}
                </Text>
              </View>
            </View>
          </Button>

          <Button
            onPress={
              this.state.profile != null
                ? this.navigateToScreen("Privacy", {
                    data: this.state.profile.privacy,
                    callback: this._needsUpdate
                  })
                : null
            }
          >
            <View style={styles.item}>
              <View style={styles.icon}>
                <IconSideBar
                  name="incognito"
                  size={iconSize}
                  color={Colors.primaryDark}
                />
              </View>
              <View style={styles.textBody}>
                <Text style={styles.bodyTextstyle}>
                  {I18n.t("Privacy_Setting")}
                </Text>
              </View>
            </View>
          </Button>

          <Button onPress={this.navigateToScreen("Terms")}>
            <View style={styles.item}>
              <View style={styles.icon}>
                <IconSideBar
                  name="alpha-t-circle-outline"
                  size={iconSize}
                  color={Colors.primaryDark}
                />
              </View>
              <View style={styles.textBody}>
                <Text style={styles.bodyTextstyle}>
                  {I18n.t("PrivacyPolicy")}
                </Text>
              </View>
            </View>
          </Button>

          {/* <Button onPress={this.navigateToScreen('Privacy')}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="user-secret" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>{I18n.t('Privacy')}</Text>
                            </View>
                        </View>
                    </Button> */}

          <View style={styles.item}>
            <View>
              <Text style={styles.bodyTextstyle}>English</Text>
            </View>
            <View>
              <Switch
                value={this.state.switchValue}
                onValueChange={this._toggleSwitch}
                trackColor={{ false: "orange" }}
              />
            </View>
            <View>
              <Text style={styles.bodyTextstyle}>ภาษาไทย</Text>
            </View>
          </View>
        </View>

        <View style={styles.item}>
          <Text style={styles.version}>{I18n.t("Version")}</Text>
        </View>

        <Button
          style={styles.footer}
          onPress={this.navigateToScreen("AuthLoading", { action: "logout" })}
        >
          <View>
            <SafeAreaView forceInset={{ bottom: "always" }}>
              <Text style={styles.signOut}>{I18n.t("Signout")}</Text>
            </SafeAreaView>
          </View>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  image: {
    borderRadius: 50,
    alignItems: "center",
    width: 100,
    height: 100
  },
  header: {
    backgroundColor: Colors.primary,
    opacity: 0.8,
    paddingTop: 40,
    height: "30%",
    justifyContent: "center"
  },
  body: {
    // marginVertical: 20
    flex: 1
  },
  item: {
    flexDirection: "row",
    // paddingLeft: 15,
    padding: 20,
    alignItems: "center"
  },
  textBody: {
    flex: 1,
    marginLeft: 20
  },
  icon: {
    width: 25,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  bodyTextstyle: {
    fontSize: 16,
    fontWeight: "600"
  },
  footer: {
    backgroundColor: Colors.primary,
    // marginTop: 'auto',
    padding: 15
  },
  signOut: {
    textAlign: "center",
    fontWeight: "700",
    //paddingTop: 10,
    fontSize: 20,
    color: Colors.onPrimary
  },
  itemText: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: "400"
  },
  version: {
    flex: 1,
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center"
  }
});
