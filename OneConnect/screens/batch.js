import React from "react";
import { View, Text, Button } from "react-native";


export default class Batch extends React.Component {
    static navigationOptions = {
        title: 'NewsFeed'
    }

    render() {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Batch</Text>
        </View>
      );
    }
}
