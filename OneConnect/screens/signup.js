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
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/FontAwesome5";
import GradientButton from 'react-native-gradient-buttons';

import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import ErrorHandler from "../custom/errorHandler";
import I18n from "../service/i18n";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

type Props = {};
export default class SignUpScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.userName = null;
    this.password = null;
    this.opacity = new Animated.Value(0);

    this.state = {
      loading: false,
      loggedIn: false,
      error: false,
      errorText: null
    };
  }

  componentDidMount() {
    console.log("component did mount login");
    Manager.addListener("SIGNUP_S", this._signupSuccess);
    Manager.addListener("SIGNUP_E", this._signupError);
  }

  componentWillUnmount() {
    console.log("component will unmount login");
    Manager.removeListener("LOGIN_S", this._signupSuccess);
    Manager.removeListener("LOGIN_E", this._signupError);
  }

  _toggleError = (state = null) => {
    console.log("toggling error");
    this.setState(previousState => ({
      error: state ? state : !previousState.error,
      errorText: null
    }));
  };

  _signupSuccess = data => {
    console.log("login successfull : ", data);
    Manager.setToken(data.data.token, data.data.user.basic.profile_pic, data.data.user.basic.id, data.data.user);
    // AsyncStorage.setItem('user',data.data.user);
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
    this.setState({
      loading: false,
      error: true,
      errorText: error.message
    });
  };

  _userNameChange = text => {
    this.userName = text;
  };

  _passwordChange = text => {
    this.password = text;
  };

  _loginButton = () => {
    console.log("login button clicked");
    if (this.userName && this.password) {
      this.setState({
        loading: true,
        error: false
      });

      Animated.timing(this.opacity, {
        toValue: 0.7,
        duration: 100
      }).start(() => {
        Manager.login("/api/login", "POST", {
          email: this.userName,
          password: this.password
        });
      });
    } else {
      if (!this.state.error) {
        console.log("empty");
        let e = new Error("Username/password field empty");
        this._signupError(e);
      }
    }
  };
  _forgetPassword = () => {
    console.log('forgot password');
    this.props.navigation.navigate("ForgotPassword");
  }

  render() {
    console.log("login render");
    return (
      <ErrorHandler
        error={this.state.error}
        errorText={this.state.errorText}
        callback={this._toggleError}
      >
        <DismissKeyboard>
          <View style={[styles.container]}>
            <View style={styles.header}>
              <ImageBackground
                style={styles.image}
                source={require("../resources/Beebuck_Logo.png")}
                imageStyle={{ resizeMode: "contain" }}
              />
            </View>
            <View style={[styles.containerBox]}>
              <View>
                <Text style={styles.welcome}>Welcome!</Text>
              </View>
              <View>
                <Text style={styles.signIn}>Please sign in to continue</Text>
              </View>
              <View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  onChangeText={this._userNameChange}
                  allowFontScaling={false}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  onChangeText={this._passwordChange}
                  allowFontScaling={false}
                  secureTextEntry
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this._forgetPassword}
                  style={styles.forgotPasswordButton}
                  color={Colors.alternative}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </Button>
              </View>
              <GradientButton
                style={{ marginVertical: 8 }}
                text="Login"
                textStyle={{ fontSize: 20 }}
                gradientBegin="#ffec8d"
                gradientEnd="#f1b31b"
                gradientDirection="diagonal"
                height={60}
                width={300}
                radius={15}
                impact
                impactStyle='Light'
                onPressAction={() => this._loginButton}
              />

              <View style={{ margin: 10, marginTop: 50 }}>
                <Text style={styles.textTerm}>
                  By proceeding you agree to the Terms of Services and Privacy
                  Policy
                </Text>
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
          </View>
        </DismissKeyboard>
      </ErrorHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  containerBox: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
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
    width: "40%",
  },
  forgotPasswordText: {
    fontSize: 15,
    marginTop: 20,
  },
  textTerm: {
    fontSize: 10,
    alignSelf: "center",
    paddingBottom: 5,
    color: Colors.onSurface,
    marginTop: 20,
    marginBottom: 10
  },
  header: {
    backgroundColor: Colors.primary,
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
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: Colors.surface
  }
});
