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
      userData: {}
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
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: "", // specifies a hosted domain restriction
      loginHint: "", // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: "", // [Android] specifies an account name on the device that should be used
      iosClientId:
        "614217954746-btvof12roua8h3qagdf90cen8sb67ttc.apps.googleusercontent.com" // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });

    //push notification
    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // user has a device token
          console.log("token", fcmToken);
          this.setState({ textInputText: fcmToken });
        } else {
          // user doesn't have a device token yet
          console.log("token", "Error to get token");
        }
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
        profile_pic: userInfo.user.photo,
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
        Manager.socialSignup("/api/social", "POST", {
          f_name: userInfo.user.name,
          l_name: "",
          email: userInfo.user.email,
          fcm_token: this.state.fcmToken
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
            const responseInfoCallback = (error, result) => {
              if (error) {
                alert("Error fetching data: " + error.toString());
              } else {
                let user = {
                  token: accessToken.toString(),
                  name: result.name,
                  picture: result.picture.data.url,
                  providerId: facebookId
                };

                this.setState({
                  loading: true,
                  error: false
                });

                Animated.timing(this.opacity, {
                  toValue: 0.7,
                  duration: 100
                }).start(() => {
                  Manager.socialSignup("/api/social", "POST", {
                    f_name: result.first_name,
                    l_name: result.last_name,
                    email: result.email,
                    fcm_token: this.state.fcmToken
                  });
                });
              }
            };
            const infoRequest = new GraphRequest(
              "/me",
              {
                accessToken: accessToken,
                parameters: {
                  parameters: {
                    string: "first_name,last_name,email"
                  }
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
    console.warn("signup successfull : ", data);
    Manager.setToken(
      data.data.token,
      data.data.user.basic.profile_pic,
      data.data.user.basic.id,
      data.data.user
    );

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
  };

  _signupError = error => {
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
        Manager.signup("/api/sign-up", "POST", {
          f_name: this.firstName,
          l_name: this.lastName,
          email: this.email,
          fcm_token: this.state.fcmToken
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
      <ScrollView style={{ flex: 1 }}>
        <ErrorHandler
          error={this.state.error}
          errorText={this.state.errorText}
          callback={this._toggleError}
        >
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
                    justifyContent: "center"
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
                      style={{ marginRight: "10%" }}
                    />
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {I18n.t("facebook")}
                    </Text>
                  </TouchableOpacity>
                  <GoogleSigninButton
                    style={styles.loginGmail}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.signIn}
                    disabled={this.state.isSigninInProgress}
                  />
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
        </ErrorHandler>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingBottom: "35%"
  },
  containerBox: {
    flex: 1,
    padding: 10,
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
    height: "40%",
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
    width: screenWidth / 3,
    height: screenWidth / 8,
    backgroundColor: Colors.colorFacebook,
    alignItems: "center",
    borderRadius: 3,
    flexDirection: "row",
    padding: 10,
    marginTop: "1.2%",
    marginRight: "1%"
  },
  loginGmail: {
    height: screenWidth / 7,
    width: screenWidth / 2.5
  }
});
