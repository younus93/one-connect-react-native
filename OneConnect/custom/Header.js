import React, { Component } from "react";
import { View, Text, TouchableWithoutFeedback, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { StyleSheet } from "react-native";
import { Colors } from "../constants";
import { DrawerActions } from "react-navigation-drawer";

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
    backgroundColor: Colors.colorTheme,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 20,
    height: "10%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5
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
