import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing
} from "react-native";
import { Colors } from "../constants";
import Button from "../custom/button";
import Icon from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-community/async-storage";
import ProfileImage from "./profileImage";

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };

    console.log(this.state.data);
  }
  componentDidUpdate = nextProps => {
    this.setState({
      data: nextProps.data
    });
  };
  _navigateUser = () => {
    if (this.props.callback) {
      this.props.callback();
    }
  };
  _deleteComment = () => {
    console.log("delete comment", this.state.data.id);
    this.props._deleteComment(this.state.data.id);
  };
  render() {
    return (
      <View style={[styles.container]}>
        <View style={styles.display}>
          <View style={styles.paddingHorizontal}>
            <Image
              style={styles.image}
              source={{ uri: this.state.data.poster.profile_pic }}
              defaultSource={require("../resources/dummy_profile.png")}
              resizeMode="cover"
              onError={error => console.log(error)}
            />
          </View>
        </View>
        <View style={[styles.body]}>
          <Button
            onPress={this._navigateUser}
            style={[styles.paddingHorizontal10]}
          >
            <Text style={styles.headerText}>
              {this.state.data.poster.f_name +
                " " +
                this.state.data.poster.l_name}
            </Text>
            <Text style={styles.headerSubText}>
              {this.state.data.created_at}
            </Text>
            <View style={[{ paddingTop: 20, paddingBottom: 5 }]}>
              <Text style={styles.bodyText}>{this.state.data.body}</Text>
            </View>
          </Button>
          {this.props.userId === this.state.data.poster.id + "" && (
            <Button
              style={{
                position: "absolute",
                right: 15,
                top: 15
              }}
              onPress={() => {
                this._deleteComment();
              }}
              rippleColor={Colors.safe}
            >
              <Icon name="trash" size={12} color={Colors.error} />
            </Button>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.surface
  },
  display: {
    paddingTop: 5
  },
  body: {
    flex: 1,
    marginHorizontal: 3,
    paddingTop: 8,
    paddingBottom: 5,
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15
  },
  paddingHorizontal10: {
    paddingHorizontal: 10
  },
  paddingVertical20: {
    paddingVertical: 20
  },
  image: {
    borderRadius: 20,
    width: 40,
    height: 40
  },
  headerText: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: "500",
    paddingBottom: 3,
    opacity: 0.9
  },
  bodyText: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: "400"
    //opacity: 0.7,
  },
  headerSubText: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.4
  }
});
