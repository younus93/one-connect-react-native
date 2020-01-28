import React, { Component } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { StyleSheet } from "react-native";
import { Colors } from "../constants";
import { DrawerActions } from "react-navigation-drawer";
import StatusBarSizeIOS from "./StatusBarSizeIOS";
var width = Dimensions.get("window").width;

var statusBarHeightIos = 0;

class Header extends Component {
  constructor(props) {
    super(props);

    statusBarHeightIos = StatusBarSizeIOS.currentHeight;

    this.state = {
      currentStatusBarHeight: StatusBarSizeIOS.currentHeight
    };
  }

  componentDidMount() {
    StatusBarSizeIOS.addEventListener(
      "willChange",
      this._handleStatusBarSizeWillChange
    );
    StatusBarSizeIOS.addEventListener(
      "didChange",
      this._handleStatusBarSizeDidChange
    );
  }

  componentWillUnmount() {
    StatusBarSizeIOS.removeEventListener(
      "willChange",
      this._handleStatusBarSizeWillChange
    );
    StatusBarSizeIOS.removeEventListener(
      "didChange",
      this._handleStatusBarSizeDidChange
    );
  }

  _handleStatusBarSizeWillChange(nextStatusBarHeight) {
    console.log("Will Change: " + nextStatusBarHeight);
  }

  _handleStatusBarSizeDidChange(currentStatusBarHeight) {
    console.log("changed");
    this.setState({ currentStatusBarHeight: currentStatusBarHeight });
    statusBarHeightIos = currentStatusBarHeight;
  }

  render() {
    const { title, navigation, isBack } = this.props;

    return (
      <View style={styles.header_container}>
        {!isBack ? (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Image
              style={{
                width: width / 18,
                height: width / 18
              }}
              source={require("../resources/ic_logo_trans.png")}
            />
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack(null);
            }}
          >
            <Icon style={styles.header_icon} size={25} name={"arrow-left"} />
          </TouchableWithoutFeedback>
        )}

        <Text style={styles.header_title} size={25}>
          {title}
        </Text>
        <View style={styles.header_icon} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header_container: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: width / 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    paddingLeft: width / 25,
    paddingTop: width / 15
  },
  header_icon: {
    color: "transparent"
  },
  header_title: {
    color: Colors.colorWhite,
    fontSize: 18,
    fontWeight: "500",
    height: width / 6,
    marginTop: width / 9
  }
});

export default Header;
