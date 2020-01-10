import React, { Component } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { StyleSheet } from "react-native";
import { Colors } from "../constants";

class Header extends Component {
  constructor(props) {
    super(props);
    this.onRedirect;
  }

  onRedirect = navigation => {
    navigation.goBack(null);
  };
  render() {
    const { title, navigation, isBack } = this.props;

    return (
      <View style={styles.header_container}>
        {!isBack ? (
          <TouchableWithoutFeedback onPress={navigation.getParam("hamPressed")}>
            <View
              style={{
                padding: "1%",
                backgroundColor: !isBack ? Colors.white : "transaparent",
                borderRadius: 50
              }}
            >
              <Image
                style={{
                  width: 25,
                  height: 22
                }}
                source={require("../resources/ic_logo_trans.png")}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback onPress={() => this.onRedirect(navigation)}>
            <View
              style={{
                padding: "1%",
                backgroundColor: !isBack ? Colors.white : "transaparent",
                borderRadius: 50
              }}
            >
              <Icon style={styles.header_icon} size={25} name={"arrow-left"} />
            </View>
          </TouchableWithoutFeedback>
        )}

        <Text style={styles.header_title} size={25}>
          {title}
        </Text>
        <Icon style={styles.header_icon} size={25} name={"search"} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header_container: {
    backgroundColor: Colors.yellowDark,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "3%",
    paddingVertical: "3%",
    height: "10%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingBottom: "2%",
    elevation: 5
  },
  header_icon: {
    color: Colors.white
  },
  header_title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "500"
  }
});

export default Header;
