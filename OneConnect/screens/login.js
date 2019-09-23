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
  ImageBackground,
  Linking
} from "react-native";
import { Input, Button as RNButton } from 'react-native-elements';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/Entypo";
// import GradientButton from 'react-native-gradient-buttons';

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
export default class LoginScreen extends Component<Props> {
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
    Manager.addListener("LOGIN_S", this._loginSuccess);
    Manager.addListener("LOGIN_E", this._loginError);
  }

  componentWillUnmount() {
    console.log("component will unmount login");
    Manager.removeListener("LOGIN_S", this._loginSuccess);
    Manager.removeListener("LOGIN_E", this._loginError);
  }

  _toggleError = (state = null) => {
    console.log("toggling error");
    this.setState(previousState => ({
      error: state ? state : !previousState.error,
      errorText: null
    }));
  };

  _loginSuccess = data => {
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

  _loginError = error => {
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
        this._loginError(e);
      }
    }
  };

  _signUpButton = () => {
    Linking.openURL('http://beebuckapp.com/sign-up');
  }

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
          <View style={styles.container}>
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
              <Input
                  placeholder='Email'
                  shake={true}
                  leftIcon={<Icon name="email"></Icon>}
                  leftIconContainerStyle={{ marginRight : 10 }}
                  onChangeText={this._userNameChange}
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />
                <Input
                  placeholder='Password'
                  shake={true}
                  leftIcon={<Icon name="lock"></Icon>}
                  leftIconContainerStyle={{ marginRight : 10 }}
                  onChangeText={this._passwordChange}
                  secureTextEntry
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />
                
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

                <RNButton buttonStyle={{ backgroundColor: Colors.yellowDark, borderRadius: 20 }}
                  onPress={this._loginButton} title="Login" />

                {/* <RNButton buttonStyle={{ backgroundColor: Colors.greenDark, borderRadius: 20, marginTop : 10 }}
                  onPress={this._signUpButton} title="Sign Up" /> */}

              </View>
              <View style={{ margin: 10, marginTop: 50 }}>
                <Text style={styles.textTerm}>
                  By logging in you agree to the EULA and Privacy Policy.
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
      </ErrorHandler >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
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
    width: "40%",
  },
  forgotPasswordText: {
    fontSize: 15,
    marginTop: 20,
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
    width: "100%",
    height: "70%",
    marginTop : 50,
    justifyContent: "center",
    backgroundColor: Colors.surface
  }
});
