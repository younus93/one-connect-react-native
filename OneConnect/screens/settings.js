import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  SectionList,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
  Easing,
  ActivityIndicator,
  KeyboardAvoidingView,
  ImageBackground,
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

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.data = this.props.navigation.getParam("data", null);
    this.opacity = new Animated.Value(0);
    this.editable = null;
    this.state = {
      user: this.data,
      loading: false,
      error: false,
      errorText: null,
      modalBackground: null
    };
    console.log("state of setting : ", this.state);
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
    console.log("settings successful, data received :", data);
    this.data = data.data;
    this.editable = null;
    this.setState({
      user: data.data,
      loading: false,
      error: true,
      errorText: "Setting saved successfully",
      modalBackground: Colors.safeDark
    });
    setTimeout(() => {
      this.props.navigation.navigate('Profile', '/api/profile');
    }, 2000);
  };

  _profileError = error => {
    console.log("setting, error received :", error);
    this.editable = null;
    this.setState({
      loading: false,
      error: true,
      errorText: "Sorry, changes could not be saved",
      modalBackground: Colors.error
    });
  };

  _toggleError = (state = null) => {
    console.log("toggling error");
    this.setState(previousState => ({
      error: state ? state : !previousState.error,
      errorText: null,
      modalBackground: null
    }));
  };

  _navigateToChangePassword = () => {
    this.props.navigation.navigate("ChangePassword");
  };

  _editField = updates => {
    this.editable = updates;
  };

  _save = () => {
    if (this.editable) {
      console.log("save");
      this.setState({
        loading: true
      });

      Animated.timing(this.opacity, {
        toValue: 0.7,
        duration: 100
      }).start(() => {
        Manager.profile("/api/profile", "POST", this.editable);
        this.props.navigation.getParam("callback")();
      });
    } else {
      console.log("Nothing to save");
      this.setState({
        error: true,
        errorText: "Nothing to save",
        modalBackground: Colors.error
      });
    }
  };

  // <Button style={styles.changePassword} onPress={this._navigateToChangePassword} title="CHANGE PASSWORD" color={Colors.alert} rippleColor={Colors.alert}/>

  render() {
    return (
      <ErrorHandler
        backgroundColor={this.state.modalBackground}
        error={this.state.error}
        errorText={this.state.errorText}
        callback={this._toggleError}
      >
        <ScrollView>
          <View style={styles.container}>
            <ScrollView alwaysBounceVertical={false} bounces={false}>
              {/* <ImageView
                data={this.data}
                callback={this._toggleSaveButtonState}
              /> */}
              <View style={{ justifyContent: "space-between" }}>
                <ProfileList
                  data={this.state.user}
                  navigate={this.props.navigation.navigate}
                  callback={this._editField}
                />
              </View>
            </ScrollView>
            <Button
              onPress={this._save}
              style={styles.saveButton}
              title={I18n.t("Save")}
              color={Colors.alternative}
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
        </ScrollView>
      </ErrorHandler>
    );
  }
}

class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.data = props.data;
  }

  render() {
    return (
      <ImageBackground
        style={styles.banner}
        source={{ uri: this.data.basic.banner_pic }}
        blurRadius={3}
        imageStyle={{ resizeMode: "cover" }}
      >
        <SafeAreaView forceInset={{ top: "always" }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              style={styles.image}
              source={{ uri: this.data.basic.profile_pic }}
              resizeMode="cover"
              defaultSource={require("../resources/dummy_profile.png")}
              onError={error => console.log(error)}
            />
          </View>
          <View style={styles.bio}>
            <Text
              style={{
                color: Colors.onPrimary,
                fontWeight: "600",
                fontSize: 18
              }}
            >
              {this.data.basic.salutation +
                " " +
                this.data.basic.f_name +
                " " +
                this.data.basic.l_name}
            </Text>
            <Text
              style={{
                paddingTop: 5,
                color: Colors.onPrimary,
                fontWeight: "600",
                fontSize: 14
              }}
            >
              {this.data.current_company ? (
                this.data.current_company.designation +
                " at " +
                this.data.current_company.name
              ) : null}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

class ProfileList extends React.Component {
  constructor(props) {
    super(props);
    let data = props.data;

    this._borderBottomWidth = [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0)
    ];
    this.editable = {};
    this.state = {
      user: data,
      isDateTimePickerVisible: false,
      dob: data.basic.dob.split("T")[0],
      gender: data.basic.gender,
      isGenderPickerVisible: false
    };
    console.log("State of profile : ", this.state);
  }

  _onPressItem = (index, section) => {
    console.log("Pressed ", index, "th row of ", section.title, " section");
  };

  _onFocus = (e, index, section) => {
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

  _editField = (field, text) => {
    switch (field) {
      case "f_name":
        this.editable.f_name = text;
        break;
      case "l_name":
        this.editable.l_name = text;
        break;
      case "phone":
        this.editable.phone_number = text;
        break;
      case "email":
        this.editable.email = text;
        break;
      case "dob":
        this.editable.dob = text;
        break;
      case "gender":
        this.editable.gender = text;
        break;
      case "bio":
        this.editable.bio = text;
        break;
      case "salutation":
        this.editable.salutation = text;
        break;
      case "nick_name":
        this.editable.nick_name = text;
        break;
      case "website":
        this.editable.website = text;
        break;
    }
    console.log("editable is : ", this.editable);
    this.props.callback(this.editable);
  };

  _showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  _showGenderPicker = () => {
    this.setState({ isGenderPickerVisible: true });
  };

  _renderBasicSection = section => {
    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
    return (
      <View key={`prle-${Math.random(1)}`}>
        <Input
          label="Salutation"
          defaultValue={this.state.user.basic.salutation}
          onChangeText={text => this._editField("salutation", text)}
          onFocus={e => this._onFocus(e, 0, section)}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name='user-tag'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label="First Name"
          defaultValue={this.state.user.basic.f_name}
          onChangeText={text => this._editField("f_name", text)}
          onFocus={e => this._onFocus(e, 0, section)}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name='address-card'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label="Last Name"
          defaultValue={this.state.user.basic.l_name}
          onChangeText={text => this._editField("l_name", text)}
          onFocus={e => this._onFocus(e, 0, section)}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name='address-card'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label="Email"
          defaultValue={this.state.user.basic.email}
          onChangeText={text => this._editField("email", text)}
          onFocus={e => this._onFocus(e, 0, section)}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Entypo
              name='email'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label="Phone Number"
          defaultValue={this.state.user.basic.phone_number}
          onChangeText={text => this._editField("phone_number", text)}
          onFocus={e => this._onFocus(e, 0, section)}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name='phone'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label="Nick Name"
          defaultValue={this.state.user.basic.nick_name}
          onChangeText={text => this._editField("nick_name", text)}
          onFocus={e => this._onFocus(e, 0, section)}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name='smile'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label="Date of Birth"
          defaultValue={this.state.dob}
          onChangeText={text => this._editField("dob", text)}
          onFocus={this._showDateTimePicker}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name='calendar-alt'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label="Gender"
          defaultValue={this.state.gender}
          onChangeText={text => this._editField("gender", text)}
          onFocus={this._showGenderPicker}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name='male'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label="Website"
          defaultValue={this.state.user.basic.website}
          onChangeText={text => this._editField("website", text)}
          onFocus={e => this._onFocus(e, 0, section)}
          onBlur={e => this._onBlur(e, 0)}
          style={{ marginVertical: 3 }}
          leftIcon={
            <Entypo
              name='network'
              size={24}
              color='black'
              style={{ marginRight: 10 }}
            />
          }
        />
      </View>
    );
  };

  _hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  _handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    dob = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
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

  render() {
    let { user } = this.state;
    return (
      <View>
        <View>
          <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
            <Text style={styles.header}>Profile Information</Text>
          </View>
          <View style={styles.sectionBody}>
            {this._renderBasicSection(user.basic)}
          </View>
        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
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
        </View>
      </View>
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
    backgroundColor: 'white',
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
    color: Colors.onSurface,
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
    backgroundColor: Colors.secondaryDark,
    borderRadius: 30,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginBottom: 5,
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
