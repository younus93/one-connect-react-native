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
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import I18n from "../service/i18n";
const UUID = require("uuid");
export default class BatchMates extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "BATCHMATES"
  });
  constructor(props) {
    super(props);
    // this.url = props.navigation.getParam('url')
    this.data = props.navigation.getParam("item");
    console.log("props in batchmates", props.navigation.getParam("item"));
    this.state = {
      data: this.data,
      loading: false,
      error: false,
      errorText: null
    };
  }

  componentDidMount() {
    // Manager.addListener('MATES_S', this._matesSuccess)
    // Manager.addListener('MATES_E', this._matesError)
    //
    // Manager.batchMates(this.url, 'GET');
  }

  componentWillUnmount() {
    // Manager.removeListener('MATES_S', this._matesSuccess)
    // Manager.removeListener('MATES_E', this._matesError)
  }

  _matesSuccess = data => {
    console.log("batch data is : ", data.data.batchmates);
    this.data = data.data.batchmates;
    this.setState({
      data: this.data,
      loading: false,
      error: false,
      errorText: null
    });
  };

  _matesError = error => {
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

  _navigateMate = item => {
    console.log("pressed item :", item);
    this.props.navigation.navigate("Profile", { url: item[0].resource_url });
  };

  _renderMateList = ({ item }) => {
    console.log("item : ", item[0]);
    // const animatedValue = new Animated.Value(1)
    // const transformation = {
    //     transform:[{scale: animatedValue}]
    // }

    return (
      <Button onPress={() => this._navigateMate(item)} style={styles.container}>
        <View style={styles.mate}>
          <View>
            <Image
              style={styles.image}
              source={{ uri: item[0].profile_pic }}
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
            <Text style={styles.name}>
              {item[0].f_name + " " + item[0].l_name}
            </Text>
            {item[0].companies.length > 0 ? (
              <Text style={styles.mutualFriendsCount}>
                {item[0].companies[0].name}
              </Text>
            ) : null}
            <Text style={styles.mutualFriendsCount}>
              {item[0].friends_meta.mutual_friends_count}{" "}
              {I18n.t("Mutual_friends")}
            </Text>
            <View style={styles.tags}>
              {item[0].tags.map(tag => (
                <Text style={styles.tag} key={UUID.v4()}>
                  {tag.name}
                </Text>
              ))}
            </View>
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
              fontSize: 22,
              fontWeight: "700",
              opacity: 0.4
            }}
          >
            {I18n.t("Data_Unavailable")}
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
            End of list.
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
      <View style={{ borderBottomColor: Colors.grey, borderBottomWidth: 1 }} />
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
        console.log("search batchmates", item[0]);
        let match = regex.test(item[0].f_name) || regex.test(item[0].l_name);
        let tagMatch = false;
        item[0].tags.map(tag => {
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
    return (
      <FlatList
        data={this.state.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderMateList}
        ItemSeparatorComponent={this._itemSeparator}
        ListEmptyComponent={this._renderEmptyList}
        ListFooterComponent={this._listFooter}
        ListHeaderComponent={this._listHeader}
        style={styles.listStyle}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
    // borderRadius: 10,
    // shadowColor: Colors.secondary,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
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
    // padding: 10,
  },
  mate: {
    flexDirection: "row",
    //justifyContent: 'space-between',
    margin: 10,
    alignItems: "center"
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    paddingLeft: 10
    //opacity: 0.7
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
    paddingLeft: 11
  },
  tags: {
    fontSize: 12,
    fontWeight: "300",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingRight: 10,
    flexShrink: 1
  },
  tag: {
    paddingLeft: 10
  },
  profileContainer: {
    flexShrink: 1
  }
});
