import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  ImageBackground,
  Platform,
  Modal
} from "react-native";
import { Input } from "react-native-elements";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import Icon from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import DateTimePicker from "react-native-modal-datetime-picker";
import ErrorHandler from "../custom/errorHandler";
import I18n from "../service/i18n";
import Header from "../custom/Header";

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const accessLevel = navigation.getParam("accessLevel", 0);
    let options = {
      title: navigation.getParam("title"),
      header: null
    };
    if (accessLevel) {
      options["headerLeft"] = (
        <View style={{ flexDirection: "row" }}>
          <Button
            style={{ borderRadius: 20 }}
            onPress={navigation.getParam("hamPressed")}
          >
            <Image
              style={{ width: 22, height: 22, padding: 10 }}
              source={require("../resources/ic_logo_trans.png")}
            />
          </Button>
        </View>
      );
    }
    return options;
  };
  constructor(props) {
    super(props);
    this.data = this.props.navigation.getParam("data");

    this.opacity = new Animated.Value(0);
    this.editable = {};
    this._borderBottomWidth = [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0)
    ];
    this.state = {
      user: this.data,
      loading: false,
      error: false,
      errorText: null,
      modalBackground: null,
      isDateTimePickerVisible: false,
      dob: this.data.basic.dob ? this.data.basic.dob.split("T")[0] : "",
      gender: this.data.basic.gender,
      isGenderPickerVisible: false,
      editUser: {},
      isEditUser: true,
      isUpdated: false,
      isLoop: 0
    };
  }

  componentDidMount() {
    console.log("setting mounted");
    Manager.addListener("PROFILE_S", this._profileSuccess);
    Manager.addListener("PROFILE_E", this._profileError);
  }

  componentWillUnmount() {
    console.log("setting unmouted");
    Manager.removeListener("PROFILE_S", this._profileSuccess);
    Manager.removeListener("PROFILE_E", this._profileError);
  }

  _profileSuccess = data => {
    this.data = data.data;
    this.editable = {};
    var loop = this.state.isLoop + 1;
    this.setState({
      loading: false,
      error: false,
      user: data.data,
      errorText: "Setting saved successfully",
      modalBackground: Colors.safeDark,
      isUpdated: true,
      isLoop: loop
    });

    console.log("params1s", data);
  };

  _profileError = error => {
    this.editable = {};
    this.setState({
      loading: false,
      error: true,
      errorText: "Sorry, changes could not be saved",
      modalBackground: Colors.error
    });
    console.log("params1e", this.state.editUser);
  };

  _toggleError = (state = null) => {
    console.log("toggling error");
    this.setState(previousState => ({
      error: state ? state : !previousState.error,
      errorText: null,
      modalBackground: null
    }));
  };

  //save edit field values
  _editField = (field, text) => {
    switch (field) {
      case "f_name":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: text,
            l_name: this.state.editUser.l_name,
            phone_number: this.state.editUser.phone_number,
            email: this.state.editUser.email,
            dob: this.state.editUser.dob,
            gender: this.state.editUser.gender,
            bio: this.state.editUser.bio,
            salutation: this.state.editUser.salutation,
            nick_name: this.state.editUser.nick_name,
            website: this.state.editUser.website
          }
        });
        break;
      case "l_name":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: text,
            phone_number: this.state.editUser.phone_number,
            email: this.state.editUser.email,
            dob: this.state.editUser.dob,
            gender: this.state.editUser.gender,
            bio: this.state.editUser.bio,
            salutation: this.state.editUser.salutation,
            nick_name: this.state.editUser.nick_name,
            website: this.state.editUser.website
          }
        });
        break;
      case "phone_number":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: this.state.editUser.l_name,
            phone_number: text,
            email: this.state.editUser.email,
            dob: this.state.editUser.dob,
            gender: this.state.editUser.gender,
            bio: this.state.editUser.bio,
            salutation: this.state.editUser.salutation,
            nick_name: this.state.editUser.nick_name,
            website: this.state.editUser.website
          }
        });
        break;
      case "email":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: this.state.editUser.l_name,
            phone_number: this.state.editUser.phone_number,
            email: text,
            dob: this.state.editUser.dob,
            gender: this.state.editUser.gender,
            bio: this.state.editUser.bio,
            salutation: this.state.editUser.salutation,
            nick_name: this.state.editUser.nick_name,
            website: this.state.editUser.website
          }
        });
        break;
      case "dob":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: this.state.editUser.l_name,
            phone_number: this.state.editUser.phone_number,
            email: this.state.editUser.email,
            dob: text,
            gender: this.state.editUser.gender,
            bio: this.state.editUser.bio,
            salutation: this.state.editUser.salutation,
            nick_name: this.state.editUser.nick_name,
            website: this.state.editUser.website
          }
        });
        break;
      case "gender":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: this.state.editUser.l_name,
            phone_number: this.state.editUser.phone_number,
            email: this.state.editUser.email,
            dob: this.state.editUser.dob,
            gender: text,
            bio: this.state.editUser.bio,
            salutation: this.state.editUser.salutation,
            nick_name: this.state.editUser.nick_name,
            website: this.state.editUser.website
          }
        });
        break;
      case "bio":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: this.state.editUser.l_name,
            phone_number: this.state.editUser.phone_number,
            email: this.state.editUser.email,
            dob: this.state.editUser.dob,
            gender: this.state.editUser.gender,
            bio: text,
            salutation: this.state.editUser.salutation,
            nick_name: this.state.editUser.nick_name,
            website: this.state.editUser.website
          }
        });
        break;
      case "salutation":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: this.state.editUser.l_name,
            phone_number: this.state.editUser.phone_number,
            email: this.state.editUser.email,
            dob: this.state.editUser.dob,
            gender: this.state.editUser.gender,
            bio: this.state.editUser.bio,
            salutation: text,
            nick_name: this.state.editUser.nick_name,
            website: this.state.editUser.website
          }
        });
        break;
      case "nick_name":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: this.state.editUser.l_name,
            phone_number: this.state.editUser.phone_number,
            email: this.state.editUser.email,
            dob: this.state.editUser.dob,
            gender: this.state.editUser.gender,
            bio: this.state.editUser.bio,
            salutation: this.state.editUser.salutation,
            nick_name: text,
            website: this.state.editUser.website
          }
        });
        break;
      case "website":
        this.setState({
          editUser: {
            ...this.state.editUser,
            f_name: this.state.editUser.f_name,
            l_name: this.state.editUser.l_name,
            phone_number: this.state.editUser.phone_number,
            email: this.state.editUser.email,
            dob: this.state.editUser.dob,
            gender: this.state.editUser.gender,
            bio: this.state.editUser.bio,
            salutation: this.state.editUser.salutation,
            nick_name: this.state.editUser.nick_name,
            website: text
          }
        });
        break;
    }
    console.log("editable is : ", this.state.editUser, text, field);
  };

  //Text input on focus effect
  _onFocus = (e, index) => {
    Animated.timing(this._borderBottomWidth[index], {
      toValue: 1
    }).start();

    // Animated.timing(this.animatedValue[index], {
    //     toValue: 1,
    //     duration: 100,
    //     easing: Easing.ease,
    //     // useNativeDriver: true,
    // }).start()
  };

  //text input on blur effect
  _onBlur = (e, index) => {
    Animated.timing(this._borderBottomWidth[index], {
      toValue: 0
    }).start();

    // Animated.timing(this.animatedValue[index], {
    //     toValue: 0,
    //     duration: 100,
    //     easing: Easing.ease,
    //     // useNativeDriver: true,
    // }).start()
  };

  _showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  _showGenderPicker = () => {
    this.setState({ isGenderPickerVisible: true });
  };

  _hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  _handleDatePicked = date => {
    dob =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.setState({
      isDateTimePickerVisible: false,
      dob: dob
    });
    this._editField("dob", dob);
  };

  _handleGenderPicked = gender => {
    console.log("A date has been picked: ", gender);
    this.setState({
      isGenderPickerVisible: false,
      gender: gender
    });
    this._editField("gender", gender);
  };

  _toggleModal = () => {
    this.setState({
      isGenderPickerVisible: false
    });
  };

  _onSave = () => {
    if (this.editable) {
      console.log("params", this.state.editUser);
      this.setState({
        loading: true,
        isEditUser: true
      });

      const object = {
        f_name:
          this.state.editUser.f_name != null ? this.state.editUser.f_name : "",
        l_name:
          this.state.editUser.l_name != null ? this.state.editUser.l_name : "",
        phone_number:
          this.state.editUser.phone_number != null
            ? this.state.editUser.phone_number
            : "",

        dob: this.state.editUser.dob != null ? this.state.editUser.dob : "",
        gender:
          this.state.editUser.gender != null ? this.state.editUser.gender : "",
        bio: this.state.editUser.bio != null ? this.state.editUser.bio : "",
        salutation:
          this.state.editUser.salutation != null
            ? this.state.editUser.salutation
            : "",
        nick_name:
          this.state.editUser.nick_name != null
            ? this.state.editUser.nick_name
            : "",
        website:
          this.state.editUser.website != null ? this.state.editUser.website : ""
      };

      console.log("params1oBJ", object);

      Animated.timing(this.opacity, {
        toValue: 0.7,
        duration: 100
      }).start(() => {
        Manager.profile("/api/profile", "POST", object);
        // this.props.navigation.getParam("callback");
      });
    } else {
      console.log("params1", this.state.editUser);
      console.log("Nothing to save");
    }
  };

  render() {
    let { user, editUser } = this.state;
    const { navigation } = this.props;
    console.log("hello", user, this.state.editUser, this.state.isLoop);
    if (this.state.isLoop > 0) {
      this.props.navigation.navigate("MyProfile", "/api/profile");
      alert(I18n.t("profile_updated"));
    }
    if (this.state.isEditUser) {
      this.setState({
        editUser: {
          ...this.state.editUser,
          f_name:
            user != undefined && user.basic != undefined
              ? user.basic.f_name
              : this.state.editUser.f_name,
          l_name:
            user != undefined && user.basic != undefined
              ? user.basic.l_name
              : this.state.editUser.l_name,
          phone_number:
            user != undefined && user.basic != undefined
              ? user.basic.phone_number
              : this.state.editUser.phone_number,
          email:
            user != undefined && user.basic != undefined
              ? user.basic.email
              : this.state.editUser.email,
          dob:
            user != undefined && user.basic != undefined
              ? user.basic.dob
              : this.state.editUser.dob,
          gender:
            user != undefined && user.basic != undefined
              ? user.basic.gender
              : this.state.editUser.gender,
          bio:
            user != undefined && user.basic != undefined
              ? user.basic.bio
              : this.state.editUser.bio,
          salutation:
            user != undefined && user.basic != undefined
              ? user.basic.salutation
              : this.state.editUser.salutation,
          nick_name:
            user != undefined && user.basic != undefined
              ? user.basic.nick_name
              : this.state.editUser.nick_name,
          website:
            user != undefined && user.basic != undefined
              ? user.basic.website
              : this.state.editUser.website
        },
        isEditUser: false
      });
    }
    return (
      <ErrorHandler
        backgroundColor={this.state.modalBackground}
        error={this.state.error}
        errorText={this.state.errorText}
        callback={this._toggleError}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <Header
            title={I18n.t("Settings")}
            navigation={navigation}
            isBack={true}
          />
          <View style={styles.container}>
            <ScrollView alwaysBounceVertical={false} bounces={false}>
              <View style={{ justifyContent: "space-between" }}>
                <Input
                  label="Salutation"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.salutation != undefined
                      ? this.state.editUser.salutation
                      : user.basic.salutation
                  }
                  onChangeText={text => this._editField("salutation", text)}
                  onFocus={e => this._onFocus(e, 0)}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Icon
                      name="user-tag"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
                <Input
                  label="First Name"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.f_name != undefined
                      ? this.state.editUser.f_name
                      : user.basic.f_name
                  }
                  onChangeText={text => this._editField("f_name", text)}
                  onFocus={e => this._onFocus(e, 0)}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Icon
                      name="address-card"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
                <Input
                  label="Last Name"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.l_name != undefined
                      ? this.state.editUser.l_name
                      : user.basic.l_name
                  }
                  onChangeText={text => this._editField("l_name", text)}
                  onFocus={e => this._onFocus(e, 0)}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Icon
                      name="address-card"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
                <Input
                  label="Email"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.email != undefined
                      ? this.state.editUser.email
                      : user.basic.email
                  }
                  onChangeText={text => this._editField("email", text)}
                  onFocus={e => this._onFocus(e, 0)}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Entypo
                      name="email"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
                <Input
                  label="Phone Number"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.phone_number != undefined
                      ? this.state.editUser.phone_number
                      : user.basic.phone_number
                  }
                  onChangeText={text => this._editField("phone_number", text)}
                  onFocus={e => this._onFocus(e, 0)}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Icon
                      name="phone"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
                <Input
                  label="Nick Name"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.nick_name != undefined
                      ? this.state.editUser.nick_name
                      : user.basic.nick_name
                  }
                  onChangeText={text => this._editField("nick_name", text)}
                  onFocus={e => this._onFocus(e, 0)}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Icon
                      name="smile"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
                <Input
                  label="Date of Birth"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.dob != undefined
                      ? this.state.editUser.dob
                      : user.basic.dob
                  }
                  onChangeText={text => this._editField("dob", text)}
                  onFocus={this._showDateTimePicker}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Icon
                      name="calendar-alt"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
                <Input
                  label="Gender"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.gender != undefined
                      ? this.state.editUser.gender
                      : user.basic.gender
                  }
                  onChangeText={text => this._editField("gender", text)}
                  onFocus={this._showGenderPicker}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Icon
                      name="male"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
                <Input
                  label="Website"
                  defaultValue={
                    this.state.editUser != undefined &&
                    this.state.editUser.website != undefined
                      ? this.state.editUser.website
                      : user.basic.website
                  }
                  onChangeText={text => this._editField("website", text)}
                  onFocus={e => this._onFocus(e, 0)}
                  onBlur={e => this._onBlur(e, 0)}
                  style={{ marginVertical: 3 }}
                  leftIcon={
                    <Entypo
                      name="network"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  }
                />
              </View>
            </ScrollView>

            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              date={
                new Date(
                  user != undefined && user.basic != undefined
                    ? user.basic.dob
                    : this.state.editUser.dob
                )
              }
              maximumDate={new Date()}
            />
            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isGenderPickerVisible}
                onRequestClose={this._toggleModal}
              >
                <TouchableWithoutFeedback onPress={this._toggleModal}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#00000070",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#FFFFFF",
                      paddingHorizontal: 20
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.surface,
                        width: "100%",
                        paddingHorizontal: 20,
                        borderRadius: 20
                      }}
                    >
                      <Button
                        style={{ padding: 20 }}
                        title="Male"
                        color={Colors.onSurface}
                        rippleColor={Colors.primaryLight}
                        onPress={() => this._handleGenderPicked("Male")}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>
                          Male
                        </Text>
                      </Button>
                      <Button
                        style={{ padding: 20 }}
                        title="Female"
                        color={Colors.onSurface}
                        rippleColor={Colors.primaryLight}
                        onPress={() => this._handleGenderPicked("Female")}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>
                          Female
                        </Text>
                      </Button>
                      <Button
                        style={{ padding: 20 }}
                        title="Others"
                        color={Colors.onSurface}
                        rippleColor={Colors.primaryLight}
                        onPress={() => this._handleGenderPicked("Others")}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>
                          Others
                        </Text>
                      </Button>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
              <Button
                onPress={this._onSave}
                style={styles.saveButton}
                title={I18n.t("Save")}
                color={Colors.white}
              />
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
        </KeyboardAvoidingView>
      </ErrorHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    borderTopWidth: 3,
    borderTopColor: Colors.yellowDark,
    // height : 600,
    backgroundColor: "white"
  },
  banner: {
    // width: '100%',
    // aspectRatio: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20
    // paddingBottom: 5,
  },
  image: {
    borderRadius: 92,
    width: 180,
    height: 180,
    backfaceVisibility: "visible"
  },
  bio: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5
  },
  sectionBody: {
    backgroundColor: Colors.surface
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurface
    // opacity: 0.4
  },
  sectionText: {
    fontWeight: "bold",
    fontSize: 18,
    opacity: 0.25,
    color: Colors.onSecondary
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,

    paddingVertical: 20
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: Colors.background,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  itemsTextLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.7,
    color: Colors.onSurface
  },
  changePassword: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.alert,
    marginHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
    color: "#fff"
  }
});

// {
//     translateX: this.animatedValue[index].interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 50]
//     })
// },
// {
//     translateY: this.animatedValue[index].interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 25]
//     })
// },
// {
//     scaleX: this.animatedValue[index].interpolate({
//         inputRange: [0, 1],
//         outputRange: [1, 2]
//     })
// },
// {
//     scaleY: this.animatedValue[index].interpolate({
//         inputRange: [0, 1],
//         outputRange: [1, 2]
//     })
// }
