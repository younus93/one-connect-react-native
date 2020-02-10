import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  BackHandler,
  ToastAndroid,
  AppState
} from "react-native";
import { DrawerActions } from "react-navigation-drawer";
import Feed from "../custom/feed";
import Header from "../custom/Header";
import { Colors } from "../constants";
import Manager from "../service/dataManager";
import Icon from "react-native-vector-icons/MaterialIcons";
import Button from "../custom/button";
import I18n from "../service/i18n";
import Toast from "react-native-simple-toast";
import ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import ProfileImage from "../custom/profileImage";

var postContent = "";

export default class NewsFeed extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    header: null
  });

  constructor(props) {
    super(props);
    this.data = [];
    this.props.navigation.setParams({ title: I18n.t("Newsfeed") });
    this.opacity = new Animated.Value(0);
    let isBackPress = false;

    this.state = {
      data: [],
      loading: true,
      refreshing: false,
      error: false,
      totalPage: 0,
      currentPage: 0,
      updateToggle: false,
      userId: -1
    };
  }

  componentDidMount() {

    console.log("news feed component did mount");
    Manager.addListener("NEWS_S", this._newsSuccess);
    Manager.addListener("NEWS_E", this._newsError);

    Manager.addListener("POSTCREATION_S", this.postCreationSuccess);
    Manager.addListener("POSTCREATION_E", this.postCreationError);

    Manager.addListener("POST_FLAG_S", this._flagPostSuccess);
    Manager.addListener("POST_FLAG_E", this._flagPostError);

    Manager.addListener("LIKE_S", this._likeSuccess);
    Manager.addListener("LIKE_E", this._likeError);

    Manager.addListener("UPDATENEWS", this._updateNews);
    Manager.addListener("LANG_U", this._updateNews);

    Manager.newsFeeds("/api/newsfeeds?page=1", "GET");

    //post sample api
    Manager.addListener("LOGIN_S", this._loginSuccess);
    Manager.addListener("LOGIN_E", this._loginError);

    this.props.navigation.setParams({ hamPressed: this._hamPressed });

    AsyncStorage.getItem("@id")
      .then(res => {
        console.log("id in comment", res);
        this.setState({
          userId: res
        });
      })
      .catch(error => {
        console.log("id in comment", error);
      });
      AppState.addEventListener('change', this._handleAppStateChange);

  }

  componentWillUnmount() {
    console.log("news feed component did un mount");
    Manager.removeListener("NEWS_S", this._newsSuccess);
    Manager.removeListener("NEWS_E", this._newsError);

    Manager.removeListener("POSTCREATION_S", this.postCreationSuccess);
    Manager.removeListener("POSTCREATION_E", this.postCreationError);

    Manager.removeListener("LIKE_S", this._likeSuccess);
    Manager.removeListener("LIKE_E", this._likeError);

    Manager.removeListener("UPDATENEWS", this._updateNews);
    Manager.removeListener("LANG_U", this._updateNews);

    //post sample api
    Manager.removeListener("LOGIN_S", this._loginSuccess);
    Manager.removeListener("LOGIN_E", this._loginError);

    AppState.removeEventListener('change', this._handleAppStateChange);

  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState!=undefined && this.state.appState.match(/inactive|background/) != undefined && this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if(this.state.data.length == 0){
        Manager.newsFeeds("/api/newsfeeds?page=1", "GET");
      }
         AsyncStorage.getItem("@id")
           .then(res => {
             console.log("id in comment", res);
             this.setState({
               userId: res
             });
           })
           .catch(error => {
             console.log("id in comment", error);
           });
       }
       this.setState({appState: nextAppState});
     }



  _loginSuccess = data => {
    console.log("login successfull : ", data);

    // AsyncStorage.setItem('user',data.data.user);
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 10
    }).start(() => {
      this.setState({
        loading: false,
        loggedIn: true
      });
    });
  };

  _loginError = error => {
    this.setState({
      loading: false,
      error: true,
      errorText: error.message
    });
  };

  _loginButton = () => {
    var userId = this.state.userId;
    console.log("login button clicked", userId);
    //if (this.state.value == "hi") {
    this.setState({
      loading: true,
      error: false
    });

    Animated.timing(this.opacity, {
      toValue: 0.7,
      duration: 100
    }).start(() => {
      console.warn(postContent);
      if(postContent!=""){
        Manager.postCreation("/api/newsfeeds", "POST", {
          user_id: userId,
          body: postContent
        });
        postContent = ""
      }else{
        alert(I18n.t('post_empty'));
      }

    });
    //}
  };

  //add photo
  _addPhoto = () => {
    console.log("editing photo");
    const options = {
      title: "Profile photo",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log("setting source");
        // const source = { uri: response.uri };
        // You can also display the image using data:
        const source = { uri: "data:image/jpeg;base64," + response.data };
        console.log("uploading profile pic");
        // Manager.uploadPic("/api/profile/pic", "POST", {
        //   type: "profile_pic",
        //   file: {
        //     uri:
        //       Platform.OS === "android"
        //         ? response.uri
        //         : response.uri.replace("file://", ""),
        //     type: response.type ? response.type : "image/jpg",
        //     name: response.fileName
        //   }
        // });
      }
    });
  };

  _hamPressed = () => {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  };

  _updateNews = () => {
    console.log("updating news");
    this.props.navigation.setParams({ title: I18n.t("Newsfeed") });
    this.setState(previousState => ({
      updateToggle: !previousState.updateToggle
    }));
  };

  _newsSuccess = data => {
    // TODO: FIX IT.
    this.data = [
      ...this.data,
      ...data.data.filter(item => {
        return !item.is_flagged;
      })
    ];
    console.log("news_feed : ", data.data,this.data);

    this.setState(state => ({
      loading: false,
      refreshing: false,
      data: data.data,
      totalPage: data.meta.total,
      currentPage: data.meta.current_page,
      faceData: [],
      remainingFaces: 0
    }));
  };
  _newsError = error => {
    console.log("newsFeed, error received :", error);
    this.setState({
      loading: false,
      refreshing: false,
      error: true,
      totalPage: 0,
      currentPage: 0
    });
  };

  postCreationSuccess = data => {
    console.log("data", data.data);
    this.setState({
      loading: false
    });
    this._openFeed(data.data);
  };

  postCreationError = error => {
    this.setState({
      loading: false,
      error: true,
      errorText: error.message
    });
  };

  _flagPostSuccess = data => {
    console.log("Flag Post success", data);
  };

  _flagPostError = data => {
    console.log("Flag Post error", data);
  };

  _likeSuccess = data => {
    console.log("like success data : ", data);
    this._updateNews();
  };

  _likeError = error => {
    console.log("like success data : ", error);
  };

  _openFeed = item => {
    this.props.navigation.navigate("OpenFeed", { comment: false, item: item });
  };

  _comment = item => {
    this.props.navigation.navigate("OpenFeed", { comment: true, item: item });
  };

  _like = item => {
    console.log("item after like: ", item);
    Manager.like(item.resource_url + "/likes", "POST", { body: item.likes });
  };

  _onReload = item => {
    console.log("delete_post3",'data.status');
    this.setState({loading:true});
    Manager.newsFeeds("/api/newsfeeds?page=1", "GET");
    this.props.navigation.navigate("NewsFeed");
  }

  _flag = item => {
    console.log("Item to be flagged", item);
    Manager.flagPost(`${item.resource_url}/flag`, "POST");
    var data = this.state.data.filter(data => {
      return data.resource_url != item.resource_url;
    });
    this.setState({ data: data });
    console.log("State is :", this.state.data);
    Toast.showWithGravity("Thanks for reporting!", Toast.SHORT, Toast.TOP);
  };

  _onBackPress = isOnBackPress => {
    this.props.navigation.goBack(null);
    this._onReload();
  };

  _institute = item => {
    console.log("reached institute callback with ", item);
    this.props.navigation.navigate("Institution", {
      item: item.created_by.name
    });
  };

  _profile = item => {
    this.props.navigation.navigate("Profile", {
      url: `/api/professionals/${item.created_by.id}`,
      title: "View profile"
    });
  };

  _renderFeeds = ({ item }) => {
    return (
      <Feed
        data={item}
        callback={() => this._openFeed(item)}
        commentCallback={() => this._comment(item)}
        instituteCallback={() => this._institute(item)}
        profileCallback={() => this._profile(item)}
        likeCallback={() => this._like(item)}
        reportCallback={() => this._flag(item)}
        onBackPressCallback={() => this._onBackPress()}
        onReloadCallback={()=> this._onReload()}
        touchable
      />
    );
  };

  _itemSeparator = props => {
    return <View style={{ backgroundColor: Colors.background }} />;
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
    if (!loading && this.data) {
      return (
        <View
          style={{
            backgroundColor: Colors.backgroun,
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
            {I18n.t("Data_Unavailable")}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: Colors.background,
            padding: 10,
            paddingTop: 20,
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

  _loadMore = ({ distanceFromEnd }) => {
    console.log("values1", distanceFromEnd);
    const { currentPage, totalPage, loading } = this.state;

    console.log("values", currentPage, totalPage, loading, distanceFromEnd);

    if (currentPage <= totalPage && !loading) {
      console.log("loading more data from ", currentPage + 1);
      Manager.newsFeeds(`/api/newsfeeds?page=${currentPage + 1}`, "GET");
      this.setState(state => ({
        loading: true
      }));
    }
  };

  _refresh = () => {
    console.log("Calling this when refreshing page!");
    // this.setState({
    //   data: [],
    //   loading: true,
    //   refreshing: true,
    //   error: false,
    //   totalPage: 0,
    //   currentPage: 0,
    //   updateToggle: false
    // });
    //  Manager.newsFeeds("/api/newsfeeds?page=1", "GET");
  };

  _keyExtractor = (item, index) => `nsfd-${Math.random(1)}`;

  _searchFilter = text => {
    if (!text) {
      console.log("no txt");
      this.setState({ data: this.data });
    } else {
      console.log("search text is :", text);
      const { data } = this.state;
      let regex = new RegExp(text, "i");
      const searchedData = data.filter(item => {
        const match = regex.test(item.institution.name);
        return match;
      });
      console.log("searched list : ", searchedData);
      this.setState({ data: searchedData });
    }
  };

  render() {
    const { data, loading } = this.state;
    const { navigation } = this.props;
    console.log("render:", data);
    if (!loading && data) {
      return (
        <View style={styles.container}>
          <Header
            title={I18n.t("Newsfeed")}
            navigation={navigation}
            isBack={false}
          />
          <ScrollView>
            <View>
            <View style={{width:'95%',padding:'3%',backgroundColor:Colors.white,borderRadius:10,marginLeft:10,marginTop:10,marginRight:10}}>
            <View style={{flex:1,flexDirection:'row',marginRight:'2%',marginTop:'2%'}}>
            <View>
              <ProfileImage width={40} height={40} borderRadius={20} />

              <Image
                style={{
                  width: 40,
                  height: 40,
                  position: "absolute",

                }}
                source={require("../resources/ic_white_hex.png")}
              />
              </View>
              <TextInput
                style={{
                  flex: 1,
                  minHeight: 65,
                  borderColor: Colors.background,
                  borderWidth: 1,
                  borderRadius: 5,
                  marginLeft: '3%',
                  padding:'2%'
                }}
                multiline={true}
                underlineColorAndroid="transparent"
                placeholder="What do you feel?"
                placeholderTextColor={Colors.background}
                autoCapitalize="none"
                editable

                onChangeText={post_content =>
                  postContent = post_content
                }
              />
            </View>
            <TouchableOpacity onPress={this._loginButton} style={{
              height:35,
              backgroundColor: Colors.primary,
              borderRadius: 15,
              padding:8,
              alignSelf:'flex-end',
              marginTop:20,
              marginRight: "2%",
              justifyContent:'center',

            }}>
              <Text
              style={{color: Colors.white, textAlign:'center'}}
              >
                {I18n.t("POST")}
              </Text>
            </TouchableOpacity>
            </View>
            <FlatList
              data={this.state.data}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderFeeds}
              ItemSeparatorComponent={this._itemSeparator}
              ListEmptyComponent={this._renderEmptyList}
              ListFooterComponent={this._listFooter}
              //onEndReached={this._loadMore}
              onEndReachedThreshold={0.5}
              // onRefresh={this._refresh}
              refreshing={this.state.refreshing}
              style={{ backgroundColor: Colors.background,marginTop:'1.5%' }}
            />
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Header
            title={I18n.t("Newsfeed")}
            navigation={navigation}
            isBack={false}
          />

          <View
            style={{
              flex: 1,
              backgroundColor: Colors.background,
              padding: 10,
              paddingTop: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator
              animating={this.state.loading}
              size="large"
              color={Colors.primary}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
    //padding: 10
  },
  header: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 40,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 3,
    borderRadius: 20,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 100
  },
  search: {
    flex: 1,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  textInput: {
    width: "100%",
    height: "100%",
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    fontSize: 16
  },
  drawerButton: {
    marginLeft: 10,
    marginRight: 5,
    borderRadius: 20
  },
  defaultStyle: {
    paddingTop: 8
  },
  customStyle: {
    padding: 24
  }
});
