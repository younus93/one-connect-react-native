import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  Animated,
  ImageBackground,
} from "react-native";
import { Input, Button as RNButton } from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import { Colors } from "../constants";
import Manager from "../service/dataManager";
import ErrorHandler from "../custom/errorHandler";
import Icon from "react-native-vector-icons/Entypo";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

const { width, height } = Dimensions.get('window');

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
      errorText: null
    };
  }

  componentDidMount() {
    console.log("component did mount signup");
    Manager.addListener("SIGNUP_S", this._signupSuccess);
    Manager.addListener("SIGNUP_E", this._signupError);
  }

  componentWillUnmount() {
    console.log("component will unmount signup");
    Manager.removeListener("SIGNUP_S", this._signupSuccess);
    Manager.removeListener("SIGNUP_E", this._signupError);
  }

  _toggleError = (state = null) => {
    console.log("toggling error");
    this.setState(previousState => ({
      error: state ? state : !previousState.error,
      errorText: null
    }));
  };

  _signupSuccess = data => {
    console.log("signup successfull : ", data);
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 10
    }).start(() => {
      Toast.showWithGravity(data.message, Toast.LONG, Toast.TOP)
      this.setState({
        loading: false,
      });
      this.props.navigation.navigate("Login");
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
  }

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
  }

  _forgetPassword = () => {
    console.log('forgot password');
    this.props.navigation.navigate("ForgotPassword");
  }

  render() {
    console.log("signup render");
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
                <Text style={styles.welcome}>Sign Up</Text>
              </View>
              <View>
                <Input
                  placeholder='First Name'
                  shake={true}
                  leftIcon={<Icon name="user"></Icon>}
                  leftIconContainerStyle={{ marginRight: 10 }}
                  onChangeText={(value) => this._handleInputChange('firstName', value)}
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />
                <Input
                  placeholder='Last Name'
                  shake={true}
                  leftIcon={<Icon name="user"></Icon>}
                  leftIconContainerStyle={{ marginRight: 10 }}
                  onChangeText={(value) => this._handleInputChange('lastName', value)}
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />
                <Input
                  placeholder='Email'
                  shake={true}
                  leftIcon={<Icon name="email"></Icon>}
                  leftIconContainerStyle={{ marginRight: 10 }}
                  onChangeText={(value) => this._handleInputChange('email', value)}
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />

                <RNButton buttonStyle={{ backgroundColor: Colors.yellowDark, borderRadius: 20 }}
                  onPress={this._signupButton} title="Sign Up" />

                <RNButton buttonStyle={{ backgroundColor: Colors.greenDark, borderRadius: 20, marginTop : 10 }}
                  onPress={this._backToLoginButton} title="Back to Login" />

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
    margin: 10,
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
    marginTop: 50,
    justifyContent: "center",
    backgroundColor: Colors.surface
  },
  title: {
    fontSize: 22,
    alignSelf: 'center'
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
    height: height * .7
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
    color: '#FFF',
    alignSelf: 'center'
  }

});
