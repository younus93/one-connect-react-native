import React from "react";
import { View, Image, StyleSheet, SafeAreaView } from "react-native";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import AsyncStorage from "@react-native-community/async-storage";

export default class ProfileImage extends React.Component {
  constructor(props) {
    super(props);
    style = {
      borderRadius: props.borderRadius,
      width: props.width,
      height: props.height
    };
    this.state = {
      imageStyle: style,
      imgUrl: ""
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@profilePic");
      if (value !== null) {
        // value previously stored
        this.setState({ imgUrl: value });
      }
    } catch (e) {
      // error reading value
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={this.state.imageStyle}
          source={{ uri: this.state.imgUrl }}
          resizeMode="cover"
          defaultSource={require("../resources/dummy_profile.png")}
          onError={error => console.log(eror)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
    // backgroundColor: Colors.primary,
    //padding: 30,
  }
});
