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
var width = Dimensions.get("window").width;

class Header extends Component {
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
              style={{ width: 22, height: 22, padding: 1 }}
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "10%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    paddingTop: Platform.OS === "ios" ? 50 : 0,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  header_icon: {
    color: Colors.colorWhite
  },
  header_title: {
    color: Colors.colorWhite,
    fontSize: 18,
    fontWeight: "500"
  }
});

export default Header;
