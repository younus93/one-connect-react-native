import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Alert,
  ImageBackground
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import ErrorHandler from "../custom/errorHandler";
import I18n from "../service/i18n";
import { NavigationActions } from "react-navigation";
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class ForgotPassword extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "",
    header: null
  });
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      userEmail: "",
      resetPassword: false,
      error: false,
      errorText: null
    };
  }

  componentDidMount() {
    console.log("component did mount ForgotPassword");
    Manager.addListener("FORGOT_S", this._forgotSuccess);
    Manager.addListener("FORGOT_E", this._forgotError);
    this.props.navigation.setParams({ backButton: this._backButtonPressed });
  }

  componentWillUnmount() {
    console.log("component will unmount ForgotPassword");
    Manager.removeListener("FORGOT_S", this._forgotSuccess);
    Manager.removeListener("FORGOT_E", this._forgotError);
  }
  _backButtonPressed = () => {
    this.props.navigation.navigate("Login");
  };
  _toggleError = (state = null) => {
    console.log("toggling error");
    this.setState(previousState => ({
      error: state ? state : !previousState.error,
      errorText: null
    }));
  };

  _forgotSuccess = data => {
    console.log("forgot successfull : ", data);
    this.setState({
      resetPassword:true
    })
  };

  _forgotError = error => {
    this.setState({
      loading: false,
      error: true,
      errorText: error.data.message
    });
  };

  _userEmailChange = text => {
    this.setState({
      userEmail: text
    });
  };

  //   _loginButton = () => {
  //     console.log("login button clicked");
  //     if (this.userName && this.password) {
  //       this.setState({
  //         loading: true,
  //         error: false
  //       });

  //       Animated.timing(this.opacity, {
  //         toValue: 0.7,
  //         duration: 100
  //       }).start(() => {
  //         Manager.login("/api/login", "POST", {
  //           email: this.userName,
  //           password: this.password
  //         });
  //       });
  //     } else {
  //       if (!this.state.error) {
  //         console.log("empty");
  //         let e = new Error("Username/password field empty");
  //         this._loginError(e);
  //       }
  //     }
  //   };
  _resetPassword = () => {
    console.log("forgot password", this.state.userEmail);
    // this.setState({
    //   resetPassword: true
    // });
    Manager.forgotPassword(
      "/api/forgot-password",
      "POST",
      this.state.userEmail
    );
  };

  render() {
    console.log("ForgotPassword render", this.state);
    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={{ top: "always" }}>
          <View style={styles.header}>
            <Button
              style={styles.drawerButton}
              onPress={this._backButtonPressed}
            >
              <Icon
                name="arrow-left"
                size={22}
                color={Colors.onSurface}
                style={{ padding: 10 }}
              />
            </Button>
          </View>
        </SafeAreaView>
        <ErrorHandler
          error={this.state.error}
          errorText={this.state.errorText}
          callback={this._toggleError}
        >
          <View style={styles.container}>
            {!this.state.resetPassword ? (
              <View style={[styles.container]}>
                <View style={styles.logo}>
                  <ImageBackground
                    style={styles.image}
                    source={require("../resources/Beebuck_Logo.png")}
                    imageStyle={{ resizeMode: "contain" }}
                  />
                </View>
                <View style={[styles.containerBox]}>
                  <View>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                  </View>
                  <View>
                    <Text style={styles.enterEmail}>
                      Please enter your registered email id.
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email"
                      onChangeText={this._userEmailChange}
                      allowFontScaling={false}
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      onPress={this._resetPassword}
                      style={styles.button}
                      color={Colors.alternative}
                    >
                      <Text style={styles.reset}>Reset password</Text>
                    </Button>
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.resetPassword ? (
              <View style={[styles.container]}>
                <View style={styles.logo}>
                  <ImageBackground
                    style={styles.image}
                    source={require("../resources/Beebuck_Logo.png")}
                    imageStyle={{ resizeMode: "contain" }}
                  />
                </View>
                <View style={[styles.containerBox]}>
                  <View>
                    <Text style={styles.forgotPassword}>Forgot password.</Text>
                  </View>
                  <View>
                    <Text style={styles.resetLink}>
                      A reset link has been sent to you mail.
                    </Text>
                  </View>
                  <View style={styles.mailLogoContainer}>
                    <Icon
                      name="paper-plane"
                      size={100}
                      color={Colors.secondary}
                      style={styles.mailIcon}
                    />
                  </View>
                </View>
              </View>
            ) : null}
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
          </View>
        </ErrorHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  drawerButton: {
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 20
  },
  header: {
    flexDirection: "row",
    height: 46,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.background
  },
  logo: {
    backgroundColor: Colors.primary,
    opacity: 0.8,
    height: "40%",
    alignItems: "center",
    justifyContent: "center"
  },
  containerBox: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    backgroundColor: Colors.surface
  },
  forgotPassword: {
    fontSize: 40,
    fontWeight: "300",
    marginLeft: 15
  },
  mailLogoContainer: {
    marginTop: 40
  },
  mailIcon: {
    alignSelf: "center"
  },
  enterEmail: {
    fontSize: 10,
    fontWeight: "100",
    marginLeft: 18,
    marginBottom: 10
  },
  textInput: {
    padding: 10,
    margin: 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 10
  },
  textTerm: {
    fontSize: 10,
    alignSelf: "center",
    paddingBottom: 5,
    color: Colors.onSurface,
    marginTop: 20,
    marginBottom: 10
  },
  reset: {
    padding: 10,
    color: Colors.primaryLight
  },
  resetLink: {
    fontSize: 15,
    fontWeight: "200",
    marginLeft: 17
  },
  button: {
    backgroundColor: Colors.secondaryDark,
    paddingVertical: 5,
    marginRight: 10,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
    borderRadius: 33
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: Colors.surface
  }
});
