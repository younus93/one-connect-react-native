import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Image,
  ImageBackground
} from "react-native";
import MapView from "react-native-maps";
import { Callout } from "react-native-maps";
import { Marker } from "react-native-maps";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import Feed from "../custom/feed";
import I18n from "../service/i18n";

export default class Institution extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title")
  });

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ title: I18n.t("Institutions") });
    this.item = this.props.navigation.getParam("item");
    this.state = {
      loading: true,
      error: false,
      errorText: null
    };
  }

  componentDidMount() {
    Manager.addListener("INSTITUTE_S", this._instituteSuccess);
    Manager.addListener("INSTITUTE_E", this._instituteError);
    Manager.addListener("LANG_U", this._updateLanguage);

    Manager.institution("/api/institutions/" + this.item.id + "/", "GET");
  }

  componentWillUnmount() {
    Manager.removeListener("INSTITUTE_S", this._instituteSuccess);
    Manager.removeListener("INSTITUTE_E", this._instituteError);
    Manager.removeListener("LANG_U", this._updateLanguage);
  }

  _instituteSuccess = data => {
    console.log("institution, data received :", data);
    this.data = data.data;
    this.latlong = this.data.latitude_longitude.split(",");
    this.setState({
      loading: false,
      error: false,
      error: null
    });
  };

  _updateLanguage = () => {
    this.props.navigation.setParams({ title: I18n.t("Institutions") });
  };

  _instituteError = error => {
    console.log("batch, error received :", error);
    this.setState({
      loading: false,
      error: true,
      errorText: null
    });
  };

  _toggleError = (state = null) => {
    this.setState(previousState => ({
      error: state ? state : !previousState.error
    }));
  };

  _onMapPress = e => {
    console.log(e.nativeEvent);
  };

  _openFeed = item => {
    this.props.navigation.navigate("OpenFeed", { comment: false, item: item });
  };

  _comment = item => {
    this.props.navigation.navigate("OpenFeed", { comment: true, item: item });
  };

  _renderPost = () => {
    if (this.data.posts.data.length > 0) {
      return this.data.posts.data.map(item => {
        return (
          <Feed
            key={`nsfd-${Math.random(1)}`}
            data={item}
            callback={() => this._openFeed(item)}
            commentCallback={() => this._comment(item)}
            touchable
          />
        );
      });
    }
    return (
      <View
        style={{
          backgroundColor: Colors.background,
          justifyContent: "center",
          alignItems: "center",
          opacity: 1,
          width: "100%"
        }}
      >
        <Text
          style={{
            color: Colors.secondaryDark,
            fontSize: 16,
            fontWeight: "700",
            opacity: 0.4
          }}
        >
          No posts availabe
        </Text>
      </View>
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" }
          ]}
        >
          <ActivityIndicator
            animating={this.state.loading}
            size="large"
            color={Colors.secondaryDark}
          />
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.container}
        alwaysBounceVertical={false}
        bounces={false}
      >
        <View
          style={{
            flexDirection: "row",
            padding: 5,
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 180, height: 180, borderRadius: 75 }}
            resizeMode="contain"
            source={{ uri: this.item.profile_pic }}
          />
          <View style={styles.imageTextContainer}>
            <Text style={styles.imageText}>{this.data.name}</Text>
            <Text style={styles.imageSubText}>{this.data.address}</Text>
          </View>
        </View>

        <View style={styles.overviewBar}>
          <View style={styles.overviewBox}>
            <Text style={styles.overViewTextMain}>
              {this.data.students_count}
            </Text>
            <Text style={styles.overViewTextSecondary}>Students</Text>
          </View>

          <View style={styles.overviewBox}>
            <Text style={styles.overViewTextMain}>
              {this.data.batches_count}
            </Text>
            <Text style={styles.overViewTextSecondary}>Batches</Text>
          </View>

          <View style={[styles.overviewBox, { borderRightWidth: 0 }]}>
            <Text style={styles.overViewTextMain}>
              {this.data.courses_count}
            </Text>
            <Text style={styles.overViewTextSecondary}>Courses</Text>
          </View>
        </View>
        <View style={styles.mapContainer}>
          <View style={{ padding: 10, paddingTop: 10 }}>
            <Text style={styles.mapHeader}>LOCATION</Text>
          </View>
          <MapView
            initialRegion={{
              latitude: parseInt(this.latlong[0]),
              longitude: parseInt(this.latlong[1]),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            style={{ flex: 1 }}
            zoomEnabled={false}
            liteMode={true}
            scrollEnabled={false}
            loadingEnabled={true}
            // cacheEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: parseInt(this.latlong[0]),
                longitude: parseInt(this.latlong[1])
              }}
              title={"Institution"}
              description={"This Institute"}
            >
              <Callout tooltip={true} />
            </Marker>
          </MapView>
        </View>
        <SafeAreaView forceInset={{ bottom: "always" }}>
          <View style={{ padding: 10, paddingTop: 10 }}>
            <Text style={styles.mapHeader}>POSTS</Text>
          </View>
          {this._renderPost()}
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  imageTextContainer: {
    padding:15,
    flexDirection: 'column',
    paddingLeft: 20,
    flexShrink: 1
    // backgroundColor: Colors.background
  },
  image: {
    width: "100%",
    aspectRatio: 2,
    justifyContent: "flex-end"
  },
  mapContainer: {
    width: "100%",
    aspectRatio: 1.5
  },
  mapHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurface,
    opacity: 0.2
  },
  imageText: {
    color: Colors.onPrimary,
    fontSize: 30,
    fontWeight: "700",
  },
  imageSubText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  overviewBar: {
    backgroundColor: Colors.surface,
    flexDirection: "row",
    justifyContent: "space-between"
    // flex:1,
  },
  overviewBox: {
    flex: 1,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.alternative,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 10
    // borderWidth: 1
  },
  overViewTextMain: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.onSurface
  },
  overViewTextSecondary: {
    fontSize: 14,
    fontWeight: "300",
    color: Colors.primaryDark,
    opacity: 0.7
  }
});
