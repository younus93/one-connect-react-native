import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  Animated,
  Alert,
  ImageBackground,
  Linking,
  Modal
} from "react-native";
import { Input, Button as RNButton } from "react-native-elements";

import AsyncStorage from "@react-native-community/async-storage";
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

    this.userName = null;
    this.password = null;
    this.opacity = new Animated.Value(0);

    this.state = {
      loading: false,
      loggedIn: false,
      modal: false,
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
    Manager.setToken(
      data.data.token,
      data.data.user.basic.profile_pic,
      data.data.user.basic.id,
      data.data.user
    );
    AsyncStorage.setItem("user", data.data.user);
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
    // Linking.openURL('http://beebuckapp.com/sign-up');
    this.props.navigation.navigate("SignUp");
  };

  _forgetPassword = () => {
    console.log("forgot password");
    this.props.navigation.navigate("ForgotPassword");
  };

  ShowModalFunction(visible) {
    this.setState({ modal: visible });
  }

  render() {
    console.log("login render");
    return (
      <ErrorHandler
        error={this.state.error}
        errorText={this.state.errorText}
        callback={this._toggleError}
      >
        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.modal}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.modal);
          }}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Terms and conditions</Text>
            <ScrollView
              style={styles.tcContainer}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  this.setState({
                    accepted: true
                  });
                }
              }}
            >
              <Text style={styles.tcP}>
                This privacy policy ("Policy") describes how Thai Beebuck Co.,
                Ltd. ("Thai Beebuck", "we", "us" or "our") collects, protects
                and uses the personally identifiable information ("Personal
                Information") you ("User", "you" or "your") may provide in Thai
                Beebuck mobile application and any of its products or services
                (collectively, "Mobile Application" or "Services"). It also
                describes the choices available to you regarding our use of your
                Personal Information and how you can access and update this
                information. This Policy does not apply to the practices of
                companies that we do not own or control, or to individuals that
                we do not employ or manage
              </Text>
              <Text style={styles.tcP}>
                We receive and store any information you knowingly provide to us
                when you create an account, publish content, make a purchase,
                fill any on BeeBuck forms in the Mobile Application. When
                required this information may include your email address, name,
                phone number, address, credit card information, bank
                information, or other Personal Information. You can choose not
                to provide us with certain information, but then you may not be
                able to take advantage of some of the Mobile Application's
                features. Users who are uncertain about what information is
                mandatory are welcome to contact us.
              </Text>
              <Text style={styles.tcP}>
                To fulfill our commitment to respecting and protecting your
                privacy, we will adhere to the following principles:
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                We will inform you of the personal information that will be
                collected, and, where appropriate seek your consent to collect,
                process, use, or disclose your personal information.
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                We will identify the purposes for which we will collect and
                further process your personal information.
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                We will only collect information that is necessary to carry out
                the identified purposes of use.
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                We will use or disclose your personal information only for the
                purposes for which it has been collected, except with your
                consent, or as required or permitted by applicable law, and we
                will retain your information only as long as necessary to
                fulfill those purposes.
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                We will endeavor to ensure that your personal information is
                accurate, complete, and up-to-date.
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                We will implement appropriate technical and organizational
                measures to protect your personal information.
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                We will make our policies and practices for the handling of your
                personal information as transparent as is reasonably possible.
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                You will have access to your personal information and will be
                able to correct your personal information as appropriate in
                accordance with your rights under applicable law.
              </Text>
              <Text style={styles.tcL}>
                {"\u2022"}
                We will be accountable to you. We are interested in hearing your
                opinion regarding our compliance with these principles, this
                Privacy Policy, and applicable laws.
              </Text>
              <Text style={styles.tcP}>Information security</Text>
              <Text style={styles.tcP}>
                We secure information you provide on computer servers in a
                controlled, secure environment, protected from unauthorized
                access, use, or disclosure. We maintain reasonable
                administrative, technical, and physical safeguards in an effort
                to protect against unauthorized access, use, modification, and
                disclosure of Personal Information in its control and custody.To
                fulfill our commitment to respecting and protecting your privacy
                and the confidentiality of your personal information, Thai
                Beebuck has implemented appropriate technical and organizational
                security standards, including industry-standard safeguards to
                prevent unauthorized access or disclosure, misuse, alternation,
                or destruction of your information. Specifically, we received
                ISO/IEC 27001 certification in 2007, and SOC2, SOC3 (SysTrust)
                certifications for the Beebuck App. However, no data
                transmission over the Internet or wireless network can be
                guaranteed. Therefore, while we strive to protect your Personal
                Information, you acknowledge that (i) there are security and
                privacy limitations of the Internet which are beyond our
                control; (ii) the security, integrity, and privacy of any and
                all information and data exchanged between you and our Mobile
                Application cannot be guaranteed; and (iii) any such information
                and data may be viewed or tampered with in transit by a
                third-party, despite reasonable efforts. To help protect your
                privacy and confidentiality of your personal information, we
                also need your help. Please do not share your password with
                others, or use the same passwords you use for other services.
                Also, please notify us in the event you suspect any unauthorized
                use of your Account or any other breach of security via our
                Contact Form .
              </Text>
              <Text style={styles.tcP}>Privacy of children</Text>
              <Text style={styles.tcP}>
                We understand the special necessity to protect Children's on
                Beebuck privacy, and we do not knowingly collect any Personal
                Information from children under the age of 13 (under the age of
                16 in Europe). If you are under the age of 13, please do not
                submit any Personal Information through our Mobile Application
                or Service. We encourage parents and legal guardians to monitor
                their children's Internet usage and to help enforce this Policy
                by instructing their children never to provide Personal
                Information through our Mobile Application or Service without
                their permission. If you have reason to believe that a child
                under the age of 13 has provided Personal Information to us
                through our Mobile Application or Service, please contact us.
                You must also be old enough to consent to the processing of your
                personal data in your country (in some countries we may allow
                your parent or guardian to do so on your behalf).If we learn
                that we have inadvertently collected personal information from
                Children, we will deactivate the relevant Account(s) and will
                take reasonable measures to promptly delete such personal
                information from our records.
              </Text>
              <Text style={styles.tcP}>Data breach</Text>
              <Text style={styles.tcP}>
                In the event we become aware that the security of the Mobile
                Application has been compromised or users Personal Information
                has been disclosed to unrelated third parties as a result of
                external activity, including, but not limited to, security
                attacks or fraud, we reserve the right to take reasonably
                appropriate measures, including, but not limited to,
                investigation and reporting, as well as notification to and
                cooperation with law enforcement authorities. In the event of a
                data breach, we will make reasonable efforts to notify affected
                individuals if we believe that there is a reasonable risk of
                harm to the user as a result of the breach or if notice is
                otherwise required by law. When we do, we will post a notice in
                the Mobile Application and send you an email.
              </Text>
              <Text style={styles.tcP}>Legal disclosure</Text>
              <Text style={styles.tcP}>
                We will disclose any information we collect, use or receive if
                required or permitted by law, such as to comply with a subpoena,
                or similar legal process, and when we believe in good faith that
                disclosure is necessary to protect our rights, protect your
                safety or the safety of others, investigate fraud, or respond to
                a government request. In the event we go through a business
                transition, such as a merger or acquisition by another company,
                or sale of all or a portion of its assets, your user account,
                and personal data will likely be among the assets transferred.
              </Text>
              <Text style={styles.tcP}>Changes and amendments</Text>
              <Text style={styles.tcP}>
                We reserve the right to modify this Policy relating to the
                Mobile Application or Services at any time, effective upon
                posting of an updated version of this Policy in the Mobile
                Application. When we do we will post a notification in our
                Mobile Application. Continued use of the Mobile Application
                after any such changes shall constitute valid and
                irrovocableconsent to such changes.
              </Text>
              <Text style={styles.tcP}>Acceptance of this policy</Text>
              <Text style={styles.tcP}>
                You acknowledge that you have read this Policy and agree to all
                its terms and conditions. By using the Mobile Application or its
                Services you agree to be bound by this Policy. If you do not
                agree to abide by the terms of this Policy, you are not
                authorized to use or access the Mobile Application and its
                Services. Contacting us If you have any questions about this
                Policy, please contact us. This document was last updated on
                August 7, 2019
              </Text>
            </ScrollView>

            <RNButton
              disabled={!this.state.accepted}
              onPress={() => {
                this.ShowModalFunction(false);
              }}
              style={
                this.state.accepted ? styles.button : styles.buttonDisabled
              }
              title="Accept"
            />
          </View>
        </Modal>

        <DismissKeyboard>
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
                <Text style={styles.welcome}>Welcome!</Text>
              </View>
              <View>
                <Input
                  placeholder="Email"
                  shake={true}
                  leftIcon={<Icon name="email"></Icon>}
                  leftIconContainerStyle={{ marginRight: 10 }}
                  onChangeText={this._userNameChange}
                  containerStyle={{ paddingBottom: 10, marginVertical: 10 }}
                />
                <Input
                  placeholder="Password"
                  shake={true}
                  leftIcon={<Icon name="lock"></Icon>}
                  leftIconContainerStyle={{ marginRight: 10 }}
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

                <RNButton
                  buttonStyle={{
                    backgroundColor: Colors.yellowDark,
                    borderRadius: 20
                  }}
                  onPress={this._loginButton}
                  title="Login"
                />

                <RNButton
                  buttonStyle={{
                    backgroundColor: Colors.greenDark,
                    borderRadius: 20,
                    marginTop: 10
                  }}
                  onPress={this._signUpButton}
                  title="Sign Up"
                />
              </View>
              <View style={{ margin: 10, marginTop: 30 }}>
                <Button
                  style={styles.textTerm}
                  onPress={() => {
                    this.ShowModalFunction(true);
                  }}
                >
                  <Text>
                    By logging in you agree to the EULA and Privacy Policy.
                  </Text>
                </Button>
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
        </DismissKeyboard>
      </ErrorHandler>
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
  }
});
