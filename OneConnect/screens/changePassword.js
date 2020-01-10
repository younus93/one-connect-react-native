import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../custom/button";
import { Colors } from "../constants";
import I18n from "../service/i18n";
import Manager from "../service/dataManager";
import Header from "../custom/Header";

export default class ChangePassword extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    header: null
  });

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ title: I18n.t("Change_Password") });
    this.state = {
      loading: true,
      error: false,
      errorText: null,
      updateToggle: false
    };
  }

  componentDidMount() {
    Manager.addListener("LANG_U", this._updateLanguage);
  }

  componentWillUnmount() {
    Manager.removeListener("LANG_U", this._updateLanguage);
  }
  _updateLanguage = () => {
    this.props.navigation.setParams({ title: I18n.t("Change_Password") });
    // this.setState(previousState => {
    //     updateToggle: !previousState.updateToggle
    // })
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Header
          navigation={navigation}
          title={navigation.getParam("title")}
          isBack={true}
        />

        <View style={[styles.shadow, styles.containerBox]}>
          <View style={{ margin: 5 }}>
            <Text style={styles.textLabel}>Old Password*</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter current Password"
              onChangeText={text => console.log(text)}
              secureTextEntry
            />
          </View>
          <View style={{ margin: 5 }}>
            <Text style={styles.textLabel}>New Password*</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter new Password"
              onChangeText={text => console.log(text)}
              secureTextEntry
            />
          </View>
          <View style={{ margin: 5 }}>
            <Text style={styles.textLabel}>Confirm New Password*</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Retype new Password"
              onChangeText={text => console.log(text)}
              secureTextEntry
            />
          </View>
          <Button
            style={styles.button}
            onPress={() => console.log("change password here")}
            title={I18n.t("Change_Password")}
            color={Colors.alternative}
          />
        </View>
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
    backgroundColor: Colors.secondaryDark,
    marginVertical: 10,
    borderRadius: 30,
    paddingVertical: 15
  }
});
