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
  ImageBackground,
  Modal,
  Platform,
  Picker
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
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

export default class AddEducation extends React.Component {
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
    this.formData = {};

    this.state = {
      updateNeeded: false,
      language: "java",
      loading: false,
      error: false,
      errorText: null
    };
  }

  componentDidMount() {
    console.log("add education mounted");
    Manager.addListener("A_EDUCATION_S", this._addEducationSuccess);
    Manager.addListener("A_EDUCATION_E", this._addCompanyError);
  }

  componentWillUnmount() {
    console.log("add education unmouted");
  }

  _addEducationSuccess = data => {
    this.setState({
      loading: false,
      error: true,
      errorText: "Education details added successfully",
      modalBackground: Colors.safeDark
    });
    setTimeout(() => {
      this.props.navigation.navigate("Profile", "/api/profile");
    }, 2000);
  };

  _addCompanyError = error => {};

  _storeInfo = (text, type) => {
    console.log("type : ", type);
    switch (type) {
      case "college_name":
        this.formData["college_name"] = text;
        break;
      case "degree_name":
        this.formData["degree_name"] = text;
        break;
    }
  };

  _renderForm = () => {
    return (
      <View>
        <Input
          label={I18n.t("College_Name")}
          onChangeText={text => this._storeInfo(text, "college_name")}
          returnKeyType="next"
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name="building"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
          }
        />
        <Input
          label={I18n.t("Degree_Name")}
          onChangeText={text => this._storeInfo(text, "degree_name")}
          returnKeyType="next"
          style={{ marginVertical: 3 }}
          leftIcon={
            <Icon
              name="chalkboard-teacher"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
          }
        />
      </View>
    );
  };

  _submit = () => {
    console.log("submitting : ", this.formData);
    if (this.formData["college_name"] && this.formData["degree_name"]) {
      this.setState({
        loading: true
      });
      Manager.addEducation("/api/educations", "POST", this.formData);
    } else {
      console.log("Please fill all the inputs");
      this.setState({
        error: true,
        errorText: "Nothing to add",
        modalBackground: Colors.error
      });
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ width: "100%", height: "100%" }}>
        <Header
          title={I18n.t("addEducation")}
          navigation={navigation}
          isBack={true}
        />

        <ErrorHandler
          backgroundColor={this.state.modalBackground}
          error={this.state.error}
          errorText={this.state.errorText}
        >
          <ScrollView style={styles.container}>
            {this._renderForm()}
            <View style={{ margin: 10, marginTop: 20, marginBottom: 40 }}>
              <Button
                onPress={() => {
                  this._submit();
                }}
                style={styles.button}
                title={I18n.t("Save")}
                color={Colors.white}
              ></Button>
            </View>
          </ScrollView>
        </ErrorHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderTopWidth: 3,
    borderTopColor: Colors.yellowDark,
    // height : 600,
    backgroundColor: "white"
  },
  textInput: {
    backgroundColor: Colors.background,
    padding: 10,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.alternative,
    borderRadius: 5
  },
  button: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 15
  },
  itemText: {
    fontSize: 12,
    opacity: 0.7
  },
  listStyle: {
    backgroundColor: Colors.background
  },
  industryItem: {
    // flex: 1,
    backgroundColor: Colors.surface,
    padding: 20
  },
  search: {
    height: 44,
    margin: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    paddingLeft: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  industryText: {
    fontSize: 14,
    fontWeight: "600"
  }
});
