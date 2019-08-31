import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Image
} from "react-native";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Button from "../custom/button";
import { DrawerActions } from "react-navigation-drawer";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import SerachUserList from "../custom/searchUserList";
import I18n from "../service/i18n";
import SearchUserList from "../custom/searchUserList";
// import SearchUserList from "../custom/searchUserList";
const UUID = require('uuid');
export default class Search extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "",
    header: null
  });

  constructor(props) {
    super(props);
    this.type = ["users", "batches", "posts"];
    this.data = null;
    this.searchText = '';

    (this.showUser = true),
      (this.showPost = true),
      (this.showInstitution = true),
      (this.showCourses = true),
      (this.showBatches = true);

    this.state = {
      loading: false,
      updateToggle: false,
      showAll: true,
      showUser: true,
      userBackground: Colors.searchFilterSelected,
      institutionBackground: Colors.searchFilterSelected,
      coursesBackground: Colors.searchFilterSelected,
      postsBackground: Colors.searchFilterSelected,
      batchesBackground: Colors.searchFilterSelected,
      showPost: true,
      showInstitution: true,
      showCourses: true,
      showBatches: true,
      userList: '',
    };
  }

  _searchTextChange = text => {
    console.log("search text changed");
    this.searchText = text;
  };

  _onEndEditing = () => {
    console.log("on end editing");
    // this.setState({
    //     loading: true
    // })
    // Manager.search(`/api/search?query=${this.searchText}`, 'GET')
  };

  _onSubmitEditing = () => {
    console.log("on submit editing");
    this.setState({
      ...this.state, loading: true,
      showUser: false, showPost: false,
      showInstitution: false,
      showCourses: false,
      showBatches: false,
    });
    Manager.search(`/api/search?query=${this.searchText}`, "GET");
  };
  _refresh = () => {
    this.setState({
      loading: true
    });
    Manager.search(`/api/search?query=${this.searchText}`, "GET");
  };
  componentDidMount() {
    console.log("search component did mount");
    this.props.navigation.setParams({ backButton: this._backButtonPressed });
    Manager.addListener("SEARCH_S", this._searchSuccess);
    Manager.addListener("SEARCH_E", this._searchError);
  }

  componentWillUnmount() {
    console.log("search component will unmount");
    Manager.removeListener("SEARCH_S", this._searchSuccess);
    Manager.removeListener("SEARCH_E", this._searchError);
  }

  _searchSuccess = data => {
    console.log("search data : ", data);
    this.data = data.data;
    let userList = this.data.filter(item => {
      const match = item.type == "users" ? true : false;
      return match;
    });
    userList = userList.map(item => {
      let user = {};
      console.log(item);
      user.id = item.searchable.basic.id;
      user.f_name = item.searchable.basic.f_name;
      user.l_name = item.searchable.basic.l_name;
      user.profile_pic = item.searchable.basic.profile_pic;
      user.tags = item.searchable.tags;
      user.friends_meta = item.searchable.friends_meta;
      return user;
    });
    this.setState({
      userList: userList,
      loading: false,
      showUser: true, showPost: true,
      showInstitution: true,
      showCourses: true,
      showBatches: true
    });
  };

  _searchError = error => {
    console.log("search error : ", error);
  };

  _backButtonPressed = () => {
    console.log("back button pressed");
    const backAction = NavigationActions.back({
      key: null
    });
    this.props.navigation.dispatch(backAction);
  };

  _navigateBatch = item => {
    this.props.navigation.navigate("BatchItem", { url: item.url });
  };

  _accept = id => {
    Manager.friendRequest("/api/friend-request/accept", "POST", {
      professional_id: id
    });
    this._refresh();
  };
  _deny = id => {
    console.log("Deny");
    Manager.friendRequest("/api/friend-request/deny", "POST", {
      professional_id: id
    });
    this._refresh();
  };
  _renderBatches = () => {
    if (this.data) {
      let list = this.data.filter(item => {
        const match = item.type == "batches" ? true : false;
        return match;
      });
      if (list.length > 0) {
        return (
          <View>
            <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
              <Text style={styles.bodyHeader}>{I18n.t("Batches")}</Text>
            </View>
            <View style={styles.sectionBody}>
              {list.map(item => {
                return (

                  <Button
                    onPress={() => this._navigateBatch(item)}
                    key={`pelt-${Math.random(1)}`}
                    style={[styles.item]}
                  >
                    <View>
                      <TouchableWithoutFeedback onPress={this._navigateUser}>
                        <Image
                          style={styles.resourceImage}
                          source={{ uri: item.searchable.institution.profile_pic }}
                          defaultSource={require("../resources/dummy_profile.png")}
                          resizeMode="cover"
                          onError={error => console.log(error)}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.itemText,
                          { fontWeight: "600", fontSize: 16 }
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.itemText}>
                        Institution : {item.searchable.institution.name}
                      </Text>
                    </View>
                  </Button>
                );
              })}
            </View>
          </View>
        );
      }
      return null;
    }
    return null;
  };

  _navigatePost = item => {
    this.props.navigation.navigate("OpenFeed", { item: item.searchable });
  };

  _renderPosts = () => {
    if (this.data) {
      let list = this.data.filter(item => {
        const match = item.type == "posts" ? true : false;
        return match;
      });

      if (list.length > 0) {
        return (
          <View>
            <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
              <Text style={styles.bodyHeader}>{I18n.t("POST")}</Text>
            </View>
            <View style={styles.sectionBody}>
              {list.map(item => {
                return (
                  <Button
                    onPress={() => this._navigatePost(item)}
                    key={`pelt-${Math.random(1)}`}
                    style={[styles.item]}
                  >
                    <View>
                      <Text
                        style={[
                          styles.itemText,
                          { fontWeight: "600", fontSize: 16 }
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </Button>
                );
              })}
            </View>
          </View>
        );
      }
      return null;
    }
    return null;
  };


  _renderUsers = () => {
    if (this.state.userList) {
      console.log(this.state.userList);
      if (this.state.userList.length > 0) {
        return (
          <SearchUserList userList={this.state.userList} navigation={this.props.navigation}></SearchUserList>
        );
      }
      return null;
    }
    return null;
  };

  _navigateCourse = item => {
    // this.props.navigation.navigate("BatchItem", {url: item.url})
    this.props.navigation.navigate("Courses", { url: item.url });
  };

  _renderCourses = () => {
    if (this.data) {
      let list = this.data.filter(item => {
        const match = item.type == "courses" ? true : false;
        return match;
      });

      if (list.length > 0) {
        return (
          <View>
            <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
              <Text style={styles.bodyHeader}>{I18n.t("Courses")}</Text>
            </View>
            <View style={styles.sectionBody}>
              {list.map(item => {
                return (
                  <Button
                    onPress={() => this._navigateCourse(item)}
                    key={`pelt-${Math.random(1)}`}
                    style={[styles.item]}
                  >
                    <View>
                      <TouchableWithoutFeedback onPress={this._navigateUser}>
                        <Image
                          style={styles.resourceImage}
                          source={{ uri: item.searchable.institution.profile_pic }}
                          defaultSource={require("../resources/dummy_profile.png")}
                          resizeMode="cover"
                          onError={error => console.log(error)}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.itemText,
                          { fontWeight: "600", fontSize: 16 }
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.itemText}>
                        Institution : {item.searchable.institution.name}
                      </Text>
                    </View>
                  </Button>
                );
              })}
            </View>
          </View>
        );
      }
      return null;
    }
    return null;
  };

  _navigateInstitute = item => {
    this.props.navigation.navigate("Institution", { item: item.searchable });
  };

  _renderInstitutions = () => {
    if (this.data) {
      let list = this.data.filter(item => {
        const match = item.type == "institutions" ? true : false;
        return match;
      });

      if (list.length > 0) {
        return (
          <View>
            <View style={{ paddingLeft: 10, paddingTop: 18, paddingBottom: 8 }}>
              <Text style={styles.bodyHeader}>{I18n.t("Institutions")}</Text>
            </View>
            <View style={styles.sectionBody}>
              {list.map(item => {
                return (
                  <Button
                    onPress={() => this._navigateInstitute(item)}
                    key={`pelt-${Math.random(1)}`}
                    style={[styles.item]}
                  >
                    <View>
                      <TouchableWithoutFeedback onPress={this._navigateUser}>
                        <Image
                          style={styles.resourceImage}
                          source={{ uri: item.searchable.profile_pic }}
                          defaultSource={require("../resources/dummy_profile.png")}
                          resizeMode="cover"
                          onError={error => console.log(error)}
                        />
                      </TouchableWithoutFeedback>
                    </View>

                    <View>
                      <Text
                        style={[
                          styles.itemText,
                          { fontWeight: "600", fontSize: 16 }
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </Button>
                );
              })}
            </View>
          </View>
        );
      }
      return null;
    }
    return null;
  };

  _renderSearchBar = () => {
    return (
      <SafeAreaView forceInset={{ top: "always" }}>
        <View style={styles.header}>
          <Button style={styles.drawerButton} onPress={this._backButtonPressed}>
            <Icon
              name="arrow-left"
              size={22}
              color={Colors.onSurface}
              style={{ padding: 10 }}
            />
          </Button>
          <View style={styles.search}>
            <TextInput
              style={styles.textInput}
              placeholder="Search"
              allowFontScaling={false}
              onChangeText={this._searchTextChange}
              onSubmitEditing={this._onSubmitEditing}
              autoCorrect={false}
              autoFocus={true}
              enablesReturnKeyAutomatically={true}
              returnKeyType="search"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  };

  _updateFilter = () => {
    console.log("new filter state: ");
    this.setState(previousState => ({
      updateToggle: !previousState.updateToggle
    }));
  };

  _renderFilters = () => {
    return (
      <View style={{ marginTop: 5, alignItems: "center" }}>
        <ScrollView horizontal={true}>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
            <Button
              style={styles.CircleShapeView}
              onPress={() => {
                this.setState(previousState => ({
                  showUser: !previousState.showUser,
                  userBackground: !previousState.showUser
                    ? Colors.searchFilterSelected
                    : Colors.onPrimary
                }));
              }}
            >
              <Icon
                name="users"
                size={22}
                color={this.state.userBackground}
              />
            </Button>
            <Text>{I18n.t("Users")}</Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
            <Button
              style={styles.CircleShapeView}
              onPress={() => {
                this.setState(previousState => ({
                  showInstitution: !previousState.showInstitution,
                  institutionBackground: !previousState.showInstitution
                    ? Colors.searchFilterSelected
                    : Colors.onPrimary                }));
              }}
            >
              <Icon
                name="archway"
                size={22}
                color={this.state.institutionBackground}
              />
            </Button>
            <Text>{I18n.t("Institutions")}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
            <Button
              style={styles.CircleShapeView}
              onPress={() => {
                this.setState(previousState => ({
                  showBatches: !previousState.showBatches,
                  batchesBackground: !previousState.showBatches
                    ? Colors.searchFilterSelected
                    : Colors.onPrimary                }));
              }}
            >
              <Icon
                name="briefcase"
                size={22}
                color={this.state.batchesBackground}
              />
            </Button>
            <Text>{I18n.t("Batches")}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
            <Button
              style={styles.CircleShapeView}
              onPress={() => {
                this.setState(previousState => ({
                  showCourses: !previousState.showCourses,
                  coursesBackground: !previousState.showCourses
                    ? Colors.searchFilterSelected
                    : Colors.onPrimary                }));
              }}>
              <Icon
                name="chalkboard-teacher"
                size={22}
                color={this.state.coursesBackground}
              />
            </Button>
            <Text>{I18n.t("Courses")}</Text>

          </View>

        </ScrollView>
      </View>
    );
  };

  render() {
    console.log("search render");
    return (
      <View style={styles.container}>
        {this._renderSearchBar()}
        {this.data ? this.data.length > 0 ? this._renderFilters() : null : null}
        {/* {this._renderFilters()} */}
        {this.state.loading ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 10
            }}
          >
            <ActivityIndicator
              animating={this.state.loading}
              size="large"
              color={Colors.secondaryDark}
            />
          </View>
        ) : null}
        <ScrollView>
          {this.data ? this.data.length > 0 ? (
            <View>
              {this.state.showUser ? this._renderUsers() : null}
              {this.state.showInstitution ? this._renderInstitutions() : null}
              {this.state.showBatches ? this._renderBatches() : null}
              {this.state.showCourses ? this._renderCourses() : null}
              {this.state.showPost ? this._renderPosts() : null}
            </View>
          ) : (
              <View
                style={{
                  backgroundColor: Colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: 1,
                  width: "100%",
                  paddingTop: 20
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
                  No results
              </Text>
              </View>
            ) : null}
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  resourceImage: {
    height: 60,
    width: 60,
    resizeMode: 'contain'
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  bodyHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onPrimary,
    // opacity: 0.4
  },
  sectionBody: {
    backgroundColor: Colors.surface
  },
  userSectionBody: {
    backgroundColor: Colors.background
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingVertical: 20
  },
  itemText: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: "400"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.background
  },
  search: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textInput: {
    height: "100%",
    width: "100%",
    fontSize: 18,
    paddingLeft: 5
  },
  drawerButton: {
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 20
  },
  image: {
    borderRadius: 50,
    width: 100,
    height: 100
  },
  mutualFriendsCount: {
    fontSize: 12,
    fontWeight: "300",
    paddingLeft: 10
  },
  buttons: {
    justifyContent: "flex-start",
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#3b5998",
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: "#3b5998",
    borderRadius: 22,
    width: "35%"
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.background,
    marginTop: 5
  },
  acceptButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignSelf: "center"
  },
  userBody: {
    backgroundColor: Colors.surface,
    marginBottom: 10,
    paddingBottom: 0
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
  CircleShapeView: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    width: 60,
    height: 60,
    borderRadius: 30,
  }
});
