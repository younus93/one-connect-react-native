import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  ImageBackground,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Input, Button as RNButton } from "react-native-elements";
import Toast from "react-native-simple-toast";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import ErrorHandler from "../custom/errorHandler";
import Icon from "react-native-vector-icons/Entypo";
import GmailIcon from "react-native-vector-icons/Ionicons";
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from "react-native-fbsdk";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "react-native-google-signin";
import firebase from "react-native-firebase";
import I18n from "../service/i18n";
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const { width, height } = Dimensions.get("window");

type Props = {};
export default class LoginScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.opacity = new Animated.Value(0);

    this.state = {
      loading: false,
      error: false,
      errorText: null,
      userData: {},
      fcmToken: ""
    };
    this.onSignInWithFacebook = this.onSignInWithFacebook.bind(this);
  }

  componentDidMount() {
    console.log("component did mount signup");
    Manager.addListener("SIGNUP_S", this._signupSuccess);
    Manager.addListener("SIGNUP_E", this._signupError);
    Manager.addListener("SOCIAL_S", this.socialSuccess);
    Manager.addListener("SOCIAL_E", this.socialError);

    //google configure
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        "614217954746-btvof12roua8h3qagdf90cen8sb67ttc.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false,
      forceConsentPrompt: true,
      hostedDomain: "", // specifies a hosted domain restriction
      loginHint: "", // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: "", // [Android] specifies an account name on the device that should be used
      iosClientId:
        "614217954746-deg74p942f46ahfsv5ksab3vooprtla5.apps.googleusercontent.com" // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  componentWillUnmount() {
    console.log("component will unmount signup");
    Manager.removeListener("SIGNUP_S", this._signupSuccess);
    Manager.removeListener("SIGNUP_E", this._signupError);
    Manager.removeListener("SOCIAL_S", this.socialSuccess);
    Manager.removeListener("SOCIAL_E", this.socialError);
  }

  _toggleError = (state = null) => {
    console.log("toggling error");
    this.setState(previousState => ({
      error: state ? state : !previousState.error,
      errorText: null
    }));
  };

  //google sign in
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userData: userInfo });
      let userData = {
        name: userInfo.user.name,
        email: userInfo.user.email,
        fcm_token: this.state.fcmToken
      };

      this.setState({
        loading: true,
        error: false
      });

      Animated.timing(this.opacity, {
        toValue: 0.7,
        duration: 100
      }).start(() => {
        var tokenVal = this.state.fcmToken;
        Manager.socialSignup("/api/social", "POST", {
          name: userInfo.user.name,
          email: userInfo.user.email,
          fcm_token: tokenVal.toString()
        });
      });
    } catch (error) {
      if (!this.state.error) {
        console.log("empty");
        let e = new Error("Invalid credencials");
        this._loginError(e);
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  //facebook callback
  async onSignInWithFacebook() {
    LoginManager.logInWithPermissions(["public_profile"]).then(
      result => {
        if (result.isCancelled) {
          console.log("login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            let accessToken = data.accessToken;
            let facebookId = data.userID;
            console.log(data);
            const responseInfoCallback = (error, result) => {
              if (error) {
                console.log(error);
              } else {
                this.setState({
                  loading: true,
                  error: false
                });

                console.log("socialInfo : ", result);

                Animated.timing(this.opacity, {
                  toValue: 0.7,
                  duration: 100
                }).start(() => {
                  var tokenVal = this.state.fcmToken;
                  let user = {
                    name: result.name,
                    email: result.email,
                    fcm_token: tokenVal.toString()
                  };
                  console.log("sociallogin : ", user);
                  Manager.socialSignup("/api/social", "POST", user);
                });
              }
            };
            const infoRequest = new GraphRequest(
              "/me",
              {
                accessToken: accessToken,
                parameters: {
                  fields: { string: "name,email" }
                }
              },
              responseInfoCallback
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function(error) {
        console.log("An error occured: " + error);
      }
    );
  }

  //get text for firebase
  get_Text_From_Clipboard = async () => {
    var textHolder = await Clipboard.getString();

    this.setState({
      clipboardText: textHolder
    });
  };

  set_Text_Into_Clipboard = async () => {
    await Clipboard.setString(this.state.textInputText);
    //  console.warn(this.state.textInputText);
  };

  _signupSuccess = data => {
    console.log("signup: ", data);
    if (data != null && data.message != null) {
      console.log("signup", "error");
      this.setState({
        loading: false,
        error: true,
        errorText: data.message
      });
    } else {
      console.log("signup", "response");
      Manager.setToken(
        data.data.token,
        data.data.user.basic.profile_pic,
        data.data.user.basic.id,
        data.data.user
      );
      AsyncStorage.setItem("user_id", JSON.stringify(data.data.user.basic.id));
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 10
      }).start(() => {
        Toast.showWithGravity(data.message, Toast.LONG, Toast.TOP);
        this.setState({
          loading: false
        });
        this.props.navigation.navigate("MyProfile");
      });
    }
  };

  socialSuccess = data => {
    console.log("social login successful : ", data);
    Manager.setToken(
      data.data.token,
      "",
      data.data.user.basic.id,
      data.data.user.basic.f_name + data.data.user.basic.l_name
    );
    AsyncStorage.setItem("user_id", data.data.user.basic.id);
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 10
    }).start(() => {
      this.setState({
        loading: false,
        loggedIn: true
      });
      this.props.navigation.navigate("Drawer");
    });
  };

  _signupError = error => {
    console.log("signup:", error);
    this.setState({
      loading: false,
      error: true,
      errorText: error.message
    });
  };

  socialError = error => {
    this.setState({
      loading: false,
      error: true,
      errorText: error.message
    });
  };

  _handleInputChange = (key, value) => {
    this[key] = value;
  };

  _signupButton = () => {
    console.log("signup button clicked");
    if (this.firstName && this.lastName && this.email) {
      this.setState({
        loading: true,
        error: false
      });

      Animated.timing(this.opacity, {
        toValue: 0.7,
        duration: 100
      }).start(() => {
        var tokenVal = this.state.fcmToken;
        Manager.signup("/api/sign-up", "POST", {
          f_name: this.firstName,
          l_name: this.lastName,
          email: this.email,
          fcm_token: tokenVal.toString()
        });
      });
    } else {
      if (!this.state.error) {
        console.log("empty");
        let e = new Error("Please fill-in the details.");
        this._signupError(e);
      }
    }
  };

  _backToLoginButton = () => {
    this.props.navigation.navigate("Login");
  };

  _forgetPassword = () => {
    console.log("forgot password");
    this.props.navigation.navigate("ForgotPassword");
  };

  render() {
    console.log("signup render");
    if (this.state.fcmToken == "") {
      //push notification
      firebase
        .messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            // user has a device token
            console.log("token", fcmToken);
            this.setState({ textInputText: fcmToken, fcmToken: fcmToken });
          } else {
            // user doesn't have a device token yet
            console.log("token", "Error to get token");
          }
        });
    }
    return (
      <ErrorHandler
        error={this.state.error}
        errorText={this.state.errorText}
        callback={this._toggleError}
      >
        <ScrollView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.container}
          >
            <View style={styles.header}>
              <ImageBackground
                style={styles.image}
                source={require("../resources/Beebuck_Logo.png")}
                imageStyle={{ resizeMode: "contain" }}
              />
            </View>
            <View style={[styles.containerBox]}>
              <View>
                <Input
                  placeholder="First Name"
                  shake={true}
                  leftIcon={<Icon name="user"></Icon>}
                  leftIconContainerStyle={{ marginRight: 10 }}
                  onChangeText={value =>
                    this._handleInputChange("firstName", value)
                  }
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />
                <Input
                  placeholder="Last Name"
                  shake={true}
                  leftIcon={<Icon name="user"></Icon>}
                  leftIconContainerStyle={{ marginRight: 10 }}
                  onChangeText={value =>
                    this._handleInputChange("lastName", value)
                  }
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />
                <Input
                  placeholder="Email"
                  shake={true}
                  leftIcon={<Icon name="email"></Icon>}
                  leftIconContainerStyle={{ marginRight: 10 }}
                  onChangeText={value =>
                    this._handleInputChange("email", value)
                  }
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />

                <RNButton
                  buttonStyle={{
                    backgroundColor: Colors.yellowDark,
                    borderRadius: 20
                  }}
                  onPress={this._signupButton}
                  title="Sign Up"
                />

                <RNButton
                  buttonStyle={{
                    backgroundColor: Colors.greenDark,
                    borderRadius: 20,
                    marginTop: 10
                  }}
                  onPress={this._backToLoginButton}
                  title="Back to Login"
                />
                <View
                  style={{
                    flexDirection: "row",
                    height: "10%",
                    margin: 10,
                    justifyContent: "center",
                    paddingBottom: "20%"
                  }}
                >
                  <TouchableOpacity
                    onPress={this.onSignInWithFacebook}
                    style={styles.loginFacebook}
                  >
                    <Icon
                      name="facebook"
                      size={22}
                      color={Colors.colorWhite}
                      style={{ marginLeft: Platform.OS == 'ios' ? 0 : '18%', marginRight: Platform.Os == 'ios' ? 0 :"5%"}}
                    />
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {I18n.t("facebook_signup")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.signIn}
                    style={styles.loginGmail}
                  >
                    <GmailIcon
                      name="logo-google"
                      size={22}
                      color={Colors.colorWhite}
                      style={{ marginLeft: Platform.OS == 'ios' ? 0 : '18%', marginRight: Platform.Os == 'ios' ? 0 :"5%"}}
                    />
                    <Text
                      style={{
                        flex: 1,
                        flexWrap: "wrap",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}
                    >
                      {I18n.t("google_signup")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {this.state.loading ? (
              <Animated.View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  backgroundColor: "black",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: this.opacity
                }}
              >
                <ActivityIndicator
                  animating={this.state.loading}
                  size="large"
                  color={Colors.secondaryDark}
                />
              </Animated.View>
            ) : null}
          </KeyboardAvoidingView>
        </ScrollView>
      </ErrorHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    marginTop: "10%"
  },
  containerBox: {
    padding: 5,
    backgroundColor: Colors.surface,
    justifyContent: "center"
  },
  welcome: {
    fontSize: 40,
    fontWeight: "300",
    marginLeft: 15
  },
  signIn: {
    fontSize: 10,
    fontWeight: "100",
    marginLeft: 20,
    marginBottom: 10
  },
  textInput: {
    padding: 10,
    margin: 10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10
  },
  forgotPasswordButton: {
    marginLeft: 10,
    paddingBottom: 10,
    width: "40%"
  },
  forgotPasswordText: {
    fontSize: 15,
    marginTop: 20
  },
  textTerm: {
    fontSize: 12,
    alignSelf: "center",
    paddingBottom: 5,
    color: Colors.onSurface,
    marginTop: 20,
    marginBottom: 10
  },
  header: {
    backgroundColor: Colors.surface,
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center"
  },
  headerText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center"
  },
  button: {
    backgroundColor: Colors.secondaryDark,
    alignSelf: "flex-end",
    alignItems: "center",
    paddingVertical: 10,
    marginRight: 10,
    width: "15%"
  },
  image: {
    width: 150,
    height: 150,
    justifyContent: "center",
    backgroundColor: Colors.surface
  },
  title: {
    fontSize: 22,
    alignSelf: "center"
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12
  },
  tcP: {
    marginTop: 10,
    fontSize: 12
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: height * 0.7
  },

  button: {
    borderRadius: 5,
    padding: 10
  },

  buttonDisabled: {
    borderRadius: 5,
    padding: 10
  },

  buttonLabel: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center"
  },
  loginFacebook: {
    width: 0,
    height: 0,
    backgroundColor: Colors.colorFacebook,
    alignItems: "center",
    borderRadius: 3,
    flexDirection: "row",
    padding: 0,
    marginRight: "2%",
    justifyContent: "center"
  },
  loginGmail: {
    height: screenWidth / 7,
    width: screenWidth / 3,
    backgroundColor: Colors.colorGmail,
    alignItems: "center",
    borderRadius: 3,
    flexDirection: "row",
    padding: 10,
    justifyContent: "center"
  }
});
