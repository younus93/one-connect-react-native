import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
  Easing,
  Image
} from "react-native";
import { DrawerActions } from "react-navigation-drawer";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import Icon from "react-native-vector-icons/FontAwesome5";
import I18n from "../service/i18n";
import Header from "../custom/Header";

const UUID = require("uuid");
export default class Friends extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    header: null,
    headerLeft: (
      <Button onPress={navigation.getParam("hamPressed")}>
        <Image
          style={{
            width: 22,
            height: 22,
            padding: 10,
            backgroundColor: "transparent"
          }}
          source={require("../resources/ic_logo_trans.png")}
        />
      </Button>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 15
    }
  });

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ title: I18n.t("Friends") });
    this.url = props.navigation.getParam("url", "/api/friends");
    this.data = null;
    this.state = {
      loading: true,
      error: false,
      errorText: null,
      updateToggle: false,
      data: null
    };
  }

  componentDidMount() {
    Manager.addListener("FRIENDS_S", this._friendSuccess);
    Manager.addListener("FRIENDS_E", this._friendError);
    Manager.addListener("NOTIFICATION_U", this._refresh);
    Manager.addListener("LANG_U", this._updateLanguage);

    Manager.friends(this.url, "GET");
    this.props.navigation.setParams({ hamPressed: this._hamPressed });
  }

  componentWillUnmount() {
    Manager.removeListener("FRIENDS_S", this._friendSuccess);
    Manager.removeListener("FRIENDS_E", this._friendError);
    Manager.removeListener("NOTIFICATION_U", this._refresh);
    Manager.removeListener("LANG_U", this._updateLanguage);
  }

  _updateLanguage = () => {
    this.props.navigation.setParams({ title: I18n.t("Friends") });
    this.setState(previousState => ({
      updateToggle: !previousState.updateToggle
    }));
  };

  _hamPressed = () => {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  };

  _refresh = () => {
    console.log("refreshing notification");
    this.data = null;
    this.state = {
      loading: true,
      error: false,
      errorText: null,
      data: null
    };
    Manager.friends(this.url, "GET");
  };

  _friendSuccess = data => {
    console.log("friend data is : ", data);
    this.data = data.data.friends;
    this.setState({
      loading: false,
      error: false,
      errorText: null,
      data: this.data
    });
  };

  _friendError = error => {
    console.log("friend, error received :", error);
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

  _navigateMate = item => {
    console.log("pressed item :", item);
    this.props.navigation.navigate("Profile", { url: item.resource_url,isBackArrow:true, });
  };

  _renderMateList = ({ item }) => {
    console.log("friends item", item);
    return (
      <Button onPress={() => this._navigateMate(item)} style={styles.container}>
        <View style={styles.mate}>
          <View>
            <Image
              style={styles.image}
              source={{ uri: item.profile_pic }}
              resizeMode="cover"
              onError={error => console.log(error)}
            />
            <Image
              style={{
                width: 120,
                height: 120,
                position: "absolute"
              }}
              source={require("../resources/ic_white_hex.png")}
            />
          </View>
          <View style={styles.profileContainer}>
            <Text style={styles.name}>{item.f_name + " " + item.l_name}</Text>
            {item.companies.length > 0 ? (
              <Text style={styles.mutualFriendsCount}>
                {item.companies[0].name}
              </Text>
            ) : null}
            <Text style={styles.mutualFriendsCount}>
              {item.friends_meta.mutual_friends_count}{" "}
              {I18n.t("Mutual_friends")}
            </Text>
          </View>
        </View>
      </Button>
    );
  };

  _renderEmptyList = () => {
    const { loading } = this.state;
    if (!loading) {
      return (
        <View
          style={{
            backgroundColor: Colors.background,
            justifyContent: "center",
            alignItems: "center",
            opacity: 1,
            height: "100%",
            width: "100%"
          }}
        >
          <Text
            style={{
              color: Colors.secondaryDark,
              fontSize: 18,
              fontWeight: "700",
              opacity: 0.4
            }}
          >
            {I18n.t("No_Friends_yet")}
          </Text>
        </View>
      );
    }
    return null;
  };

  _listFooter = () => {
    const { loading } = this.state;
    if (!loading) {
      return (
        <View
          style={{
            backgroundColor: Colors.background,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: Colors.secondaryDark,
              fontWeight: "500",
              opacity: 0.4
            }}
          >
            No more friends!.
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: Colors.background,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            animating={this.state.loading}
            size="large"
            color={Colors.secondaryDark}
          />
        </View>
      );
    }
  };

  _listHeader = () => {
    return (
      <View style={styles.search}>
        <TextInput
          style={styles.searchText}
          placeholder={I18n.t("Search")}
          onChangeText={this._searchFilter}
        />
      </View>
    );
  };

  _itemSeparator = props => {
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.grey }} />
    );
  };

  _keyExtractor = (item, index) => `bhms-${Math.random(1)}`;

  _searchFilter = text => {
    if (!text) {
      console.log("no txt");
      this.setState({ data: this.data });
    } else {
      console.log("search text is :", text);
      // const {data} = this.data;
      let regex = new RegExp("^" + text, "i");
      const searchedData = this.data.filter(item => {
        console.log("search friend", item);
        let match = regex.test(item.f_name) || regex.test(item.l_name);
        let tagMatch = false;
        item.tags.map(tag => {
          if (regex.test(tag.name)) {
            tagMatch = true;
          }
        });
        match = tagMatch || match;
        console.log("search return match", match);
        return match;
      });
      console.log("searched list : ", searchedData);
      this.setState({ data: searchedData });
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderMateList}
          ItemSeparatorComponent={this._itemSeparator}
          ListEmptyComponent={this._renderEmptyList}
          // ListFooterComponent={this._listFooter}
          ListHeaderComponent={this._listHeader}
          style={styles.listStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
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
  paddingHorizontal10: {
    paddingHorizontal: 10
  },
  paddingVertical20: {
    paddingVertical: 20
  },
  listStyle: {
    backgroundColor: Colors.background
  },
  mate: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    paddingLeft: 10
  },
  batchCourse: {
    fontSize: 14,
    fontWeight: "600"
  },
  batchState: {
    fontSize: 12,
    fontWeight: "600"
  },
  image: {
    borderRadius: 60,
    width: 120,
    height: 120
  },
  mutualFriendsCount: {
    fontSize: 12,
    fontWeight: "300",
    paddingLeft: 10
  },
  tags: {
    fontSize: 12,
    fontWeight: "300",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingRight: 10
  },
  tag: {
    paddingLeft: 10
  },
  profileContainer: {
    flexShrink: 1
  }
});
