import React from "react";
import { View, Text, StyleSheet, TextInput, Animated } from "react-native";
import Button from "../custom/button";
import { Colors } from "../constants";
import I18n from "../service/i18n";
import Manager from "../service/dataManager";
import Header from "../custom/Header";
import ErrorHandler from "../custom/errorHandler";

export default class ChangePassword extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    header: null
  });

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ title: I18n.t("Change_Password") });
    this.opacity = new Animated.Value(0);
    this.state = {
      loading: true,
      error: false,
      errorText: null,
      updateToggle: false
    };
  }

  componentDidMount() {
    Manager.addListener("LANG_U", this._updateLanguage);
    Manager.addListener("CHANGE_PASSWORD_S", this.changePasswordSuccess);
  }

  componentWillUnmount() {
    Manager.removeListener("LANG_U", this._updateLanguage);
    Manager.removeListener("CHANGE_PASSWORD_E", this.changePasswordError);
  }
  _updateLanguage = () => {
    this.props.navigation.setParams({ title: I18n.t("Change_Password") });
    // this.setState(previousState => {
    //     updateToggle: !previousState.updateToggle
    // })
  };

  _toggleError = (state = null) => {
    console.log("toggling error");
    this.setState(previousState => ({
      error: state ? state : !previousState.error,
      errorText: null
    }));
  };

  changePasswordSuccess = data => {
    console.log("change password", data);
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 10
    }).start(() => {
      this.setState({
        loading: false,
        error: true,
        errorText: I18n.t("password_changed")
      });
      this.props.navigation.getBack(null);
    });
  };

  changePasswordError = error => {
    this.setState({
      loading: false,
      error: true,
      errorText: error.message
    });
  };

  onChangePass = () => {
    console.log("change password clicked");
    if (this.state.pass && this.state.confirmPass) {
      this.setState({
        loading: true,
        error: false
      });
      Animated.timing(this.opacity, {
        toValue: 0.7,
        duration: 100
      }).start(() => {
        var tokenVal = this.state.fcmToken;
        Manager.changePass("/api/profile/password", "POST", {
          password: this.state.pass,
          password_confirmation: this.state.confirmPass
        });
      });
    } else {
      if (!this.state.error) {
        console.log("empty");
        let e = new Error(I18n.t("Change_pass_error"));
        this.changePasswordError(e);
      }
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={I18n.t("Batches")}
          navigation={navigation}
          isBack={true}
        />
        <ErrorHandler
          error={this.state.error}
          errorText={this.state.errorText}
          callback={this._toggleError}
        >
          <View style={[styles.shadow, styles.containerBox]}>
            <View style={{ margin: 5 }}></View>
            <View style={{ margin: 5 }}>
              <Text style={styles.textLabel}>New Password*</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter new Password"
                onChangeText={text => this.setState({ pass: text })}
                secureTextEntry
              />
            </View>
            <View style={{ margin: 5 }}>
              <Text style={styles.textLabel}>Confirm New Password*</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Retype new Password"
                onChangeText={text => this.setState({ confirmPass: text })}
                secureTextEntry
              />
            </View>
            <Button
              style={styles.button}
              onPress={this.onChangePass}
              title={I18n.t("Change_Password")}
              color={Colors.white}
            />
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
  containerBox: {
    backgroundColor: Colors.surface,
    padding: 10,
    margin: 20,
    borderRadius: 10
  },
  textLabel: {
    fontSize: 10,
    color: Colors.onSurface
  },
  textInput: {
    backgroundColor: Colors.background,
    padding: 10,
    marginVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.alternative
  },
  shadow: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    marginVertical: 10,
    borderRadius: 30,
    paddingVertical: 15
  }
});
