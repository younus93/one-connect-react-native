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
import { Button as RNButton, Input } from 'react-native-elements';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/FontAwesome5";
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
    this.userEmail = null;
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
      loading: false,
      error: true,
      errorText: data.data.message
    });
  };

  _forgotError = error => {
    this.setState({
      loading: false,
      error: true,
      errorText: error.data.message
    });
    setTimeout(()=>{
      this._toggleError();
    },2000)
  };

  _userEmailChange = text => {
    console.log('userEmail',text)
    this.userEmail=text;
    this.setState({
      userEmail: text
    });
  
  };

  _resetPassword = () => {
    console.log("forgot password", this.state.userEmail);
    // this.setState({
    //   resetPassword: true
    // });
     Manager.forgotPassword("/api/forgot-password", 'POST',  {email:this.state.userEmail})
  };

  // _signUpButton = () => {
  //   this.props.navigation.navigate('SignUp');
  // }

  _navigateToLogin = () => {
    // console.log('forgot password');
    this.props.navigation.navigate("Login");
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
                <Text style={styles.welcome}>Reset your password!</Text>
              </View>
              <View>

                <Input
                  placeholder='Email'
                  shake={true}
                  onChangeText={this._userEmailChange}
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />

                <RNButton buttonStyle={{ backgroundColor: Colors.yellowDark, borderRadius: 20 }}
                  onPress={this._resetPassword} title="Reset Password" />

                <RNButton buttonStyle={{ backgroundColor: Colors.secondaryLight, borderRadius: 20, marginTop: 10 }}
                  onPress={this._navigateToLogin} title="Back to Login" />

              </View>
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
    fontSize: 35,
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
    fontSize: 10,
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
  }
});
