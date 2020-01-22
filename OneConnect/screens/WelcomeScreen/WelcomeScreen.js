import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  Image,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";

import AppIntroSlider from "./ReactnativeappIntroSlider/AppIntroSlider";
// import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/Feather";
import { Card } from "react-native-shadow-cards";
import Login from "../login";
import AsyncStorage from "@react-native-community/async-storage";

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_Main_App: false,
      modalVisible: false,
      checked: 0,
      data: ["English", "ภาษาไทย"]
    };
  }

  on_Done_all_slides = () => {
    AsyncStorage.multiGet(["@appKey", "@profilePic", "@locale"])
      .then(res => {
        if (res[0][1]) {
          Manager.setToken(res[0][1], res[1][1]);
          UpdateLocale(res[2][1]);
          // this.setState({
          //     animatedState: false
          // })
          this.props.navigation.navigate("Drawer");
        } else {
          // this.setState({
          //     animatedState: false
          // })
          UpdateLocale(res[2][1]);
          this.props.navigation.navigate("Login");
        }
      })
      .catch(error => {
        // this.setState({
        //     animatedState: false
        // })
        this.props.navigation.navigate("Login");
      });
  };

  on_Skip_slides = () => {
    AsyncStorage.multiGet(["@appKey", "@profilePic", "@locale"])
      .then(res => {
        if (res[0][1]) {
          Manager.setToken(res[0][1], res[1][1]);
          UpdateLocale(res[2][1]);
          // this.setState({
          //     animatedState: false
          // })
          this.props.navigation.navigate("Drawer");
        } else {
          // this.setState({
          //     animatedState: false
          // })
          UpdateLocale(res[2][1]);
          this.props.navigation.navigate("Welcome");
        }
      })
      .catch(error => {
        // this.setState({
        //     animatedState: false
        // })
        this.props.navigation.navigate("Drawer");
      });
  };

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.slides}>
        {/* <Image
          style={{width: '100%', height: 150}}
          source={{uri: 'https://cdn.vox-cdn.com/thumbor/8tLchaDMIEDNzUD3mYQ7v1ZQL84=/0x0:2012x1341/920x613/filters:focal(0x0:2012x1341):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg'}}
        /> */}
        <Image style={{ width: "90%", height: "95%" }} source={item.image} />
      </View>
    );
  };
  getListViewItem = item => {
    Alert.alert(item.title);
  };
  handleClick(navigation) {
    navigation.navigate("Login");
  }

  render() {
    const { userData, navigation } = this.props;

    return (
      <AppIntroSlider
        slides={slides}
        onDone={this.on_Done_all_slides}
        onSkip={this.on_Skip_slides}
        renderItem={this._renderItem}
        bottomButton
      />
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 26,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20
  },
  text: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain"
  },
  img: {
    height: 20,
    width: 20,
    marginRight: 5,
    fontSize: 20
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 50
  },
  button: {
    marginBottom: 30,
    marginTop: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "#f4b500",
    borderRadius: 20,
    color: "black"
  },
  buttonText: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
    padding: 10
  }
});

const slides = [
  {
    key: "k1",
    title: "Slide 1",
    text: "The first slider of Beebuck application",
    // imageUrl: 'https://reactnativecode.com/wp-content/uploads/2019/04/restaurants.png',
    image: require("../../resources/slider/welcome_screen_1.jpg")
  },
  {
    key: "k2",
    title: "Slide 2",
    text: " The second slider of Beebuck application",
    image: require("../../resources/slider/welcome_screen_2.jpg")
  },
  {
    key: "k3",
    title: "Slide 3",
    text: " The third slider of Beebuck application",
    image: require("../../resources/slider/welcome_screen_3.jpg")
  },
  {
    key: "k4",
    title: "Slide 4",
    text: " The fourth slider of Beebuck application",
    image: require("../../resources/slider/welcome_screen_4.jpg")
  },
  {
    key: "k5",
    title: "Slide 5",
    text: " The fifth slider of Beebuck application",
    image: require("../../resources/slider/welcome_screen_5.jpg")
  }
];
const DATA = [
  {
    id: "1",
    title: "English"
  },
  {
    id: "2",
    title: "Thai"
  }
];
