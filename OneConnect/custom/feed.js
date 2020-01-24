import React from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  TextInput,
  Modal,
  CameraRoll,
  PermissionsAndroid,
  Platform,
  Dimensions
} from "react-native";
import { Colors } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import CloseIcon from "react-native-vector-icons/Ionicons";
import Button from "../custom/button";
import I18n from "../service/i18n";
import FacePile from "react-native-face-pile";
import ImageViewer from "react-native-image-zoom-viewer";
import RNFetchBlob from "rn-fetch-blob";
const win = Dimensions.get("window");
const ratio = win.width / 541; //541 is actual image width
import AsyncStorage from "@react-native-community/async-storage";

let faceData = [];
let remainingFaces = 0;
let userId = -1;
var isPermissionGranted = false;

//convert camel case format
function ConvertCamelCase(str) {
  return (" " + str)
    .toLowerCase()
    .replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ0-9]+(.)/g, function(match, chr) {
      return chr.toUpperCase();
    });
}

export async function request_storage_runtime_permission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: I18n.t("storage_permission_title"),
        message: I18n.t("storage_permission_message")
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //Alert.alert("Storage Permission Granted.");
      isPermissionGranted = true;
    } else {
      //Alert.alert("Storage Permission Not Granted");
      isPermissionGranted = false;
    }
  } catch (err) {
    console.warn(err);
  }
}

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLikes: props.data.likes,
      likeIconActive: props.data.is_liked,
      likeActivefont: Colors.red,
      commentsCount: props.data.comments_count,
      pic: props.data.pic,
      isImageZoomable: false
    };
  }

  componentDidLoad() {}

  componentWillReceiveProps(nextProps) {
    console.log("feeds received props");
    if (this.data !== nextProps.data) {
      console.log("current feeds state and next props not match");
      this.setState({
        totalLikes: nextProps.data.likes,
        likeIconActive: nextProps.data.is_liked,
        likeActivefont: Colors.red,
        commentsCount: nextProps.data.comments_count,
        pic: nextProps.data.pic
      });
    }
  }
  _onPress = e => {
    console.log("in focus");
    if (this.props.touchable) {
      if (this.props.callback) {
        this.props.callback();
      }
    }
  };

  _comment = e => {
    if (this.props.commentCallback) {
      this.props.commentCallback();
    }
  };

  _share = e => {};

  _report = e => {
    Alert.alert(
      "Report as inappropriate?",
      "You can report abuse, spam or anything else that doesn't follow our Community Guidelines and we will review it accordingly",
      [
        { text: "Cancel" },
        { text: "Report", onPress: () => this.props.reportCallback() }
      ]
    );
  };

  _liked = () => {
    if (this.props.likeCallback) {
      this.setState(previousState => {
        if (!previousState.likeIconActive) {
          this.props.data.likes += 1;
          this.props.data.is_liked = true;
          return {
            totalLikes: previousState.totalLikes + 1,
            likeIconActive: !previousState.likeIconActive,
            likeActiveFont: Colors.red
          };
        } else {
          this.props.data.likes -= 1;
          this.props.data.is_liked = false;
          return {
            totalLikes: previousState.totalLikes - 1,
            likeIconActive: !previousState.likeIconActive,
            likeActiveFont: Colors.onSurface
          };
        }
      });
      this.props.likeCallback();
    }
  };

  _institute = () => {
    this.props.instituteCallback();
  };

  _profile = () => {
    this.props.profileCallback();
  };

  _isOnBackPress = () => {
    this.props.onBackPressCallback();
  };

  onImageClick = () => {
    this.setState({ isImageZoomable: true });
  };

  // _report = () => {
  //   this.props.reportCallback();
  // }

  _likeText = () => {
    if (this.state.likeIconActive) return I18n.t("You") + I18n.t("Like_it");
    if (this.props.data.likers != null && this.props.data.likers.length > 0)
      return (
        this.props.data.likers[0].f_name +
        " " +
        I18n.t("and") +
        " " +
        (this.state.totalLikes - 1) +
        " " +
        I18n.t("Liked_it")
      );
    return "No Likes yet";
  };

  _commentText = () => {
    return this.state.commentsCount + " " + I18n.t("Comment");
  };

  //image save option
  async componentDidMount() {
    await request_storage_runtime_permission();
    AsyncStorage.getItem("@id")
      .then(res => {
        console.log("id in comment", res);
        userId = res;
      })
      .catch(error => {
        console.log("id in comment", error);
      });
  }

  //download image from server
  downloadImage = async () => {
    if (!isPermissionGranted) {
      await request_storage_runtime_permission();
    } else {
      var date = new Date();
      var image_URL = this.state.pic;
      var ext = this.getExtention(image_URL);
      ext = "." + ext[0];
      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path:
            PictureDir +
            "/image_" +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ext,
          description: "Image"
        }
      };
      config(options)
        .fetch("GET", image_URL)
        .then(res => {
          Alert.alert("Image has been Successfully Downloaded.");
        });
    }
  };

  getExtention = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  render() {
    console.log("pic", this.state.pic);
    const { data, navigation } = this.props;
    console.log("response", data);
    let faces = this.props.data.likers;

    const images = [
      {
        // Simplest usage.
        url: this.state.pic,
        props: {
          // headers: ...
        }
      }
    ];

    return (
      <View>
        <TouchableWithoutFeedback
          onPress={this._onPress}
          hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
        >
          <View style={[styles.container, this.transformation]}>
            <View style={styles.header}>
              <TouchableWithoutFeedback
                onPress={
                  data.created_by != null && data.created_by.type == "User"
                    ? this._profile
                    : data.created_by != null &&
                      data.created_by.type == "Institution"
                    ? this._institute
                    : null
                }
                hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
              >
                <View>
                  <Image
                    style={{
                      width: 60,
                      height: 60
                    }}
                    source={{
                      uri: data.created_by.name
                        ? data.created_by.profile_pic
                        : null
                    }}
                    defaultSource={require("../resources/dummy_profile.png")}
                    resizeMode="cover"
                    onError={error => console.log(error)}
                  />
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      position: "absolute"
                    }}
                    source={require("../resources/ic_white_hex.png")}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={
                  data.created_by != null && data.created_by.type == "User"
                    ? this._profile
                    : data.created_by != null &&
                      data.created_by.type == "Institution"
                    ? this._institute
                    : null
                }
                hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
              >
                <View style={styles.paddingHorizontal10}>
                  <Text style={styles.headerText}>
                    {data.created_by != null &&
                    data.created_by.name != null &&
                    data.created_by.name != undefined
                      ? ConvertCamelCase(data.created_by.name)
                      : I18n.t("Institute")}
                  </Text>
                  <Text style={styles.headerSubText}>{data.created_at}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.paddingVertical20}>
              <Text style={styles.bodyText}>{data.body}</Text>
              <TouchableWithoutFeedback onPress={this.onImageClick}>
                <View>
                  {this.state.pic != null && (
                    <Image
                      style={styles.feedImage}
                      resizeMode="contain"
                      source={{ uri: this.state.pic }}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.separator} />
            <View style={styles.footer}>
              <Text
                style={[
                  styles.footerMetaElementText,
                  { color: this.state.likeActiveFont }
                ]}
              >
                {this._likeText()}
              </Text>
              <Text
                style={[
                  styles.footerMetaElementText,
                  { color: this.state.likeActiveFont }
                ]}
              >
                {this._commentText()}
              </Text>
            </View>
            <View style={styles.footer}>
              <Button onPress={this._liked} style={styles.footerElement}>
                <Icon
                  name="heart"
                  size={20}
                  color={Colors.red}
                  solid={this.state.likeIconActive}
                />
                <Text
                  style={[
                    styles.footerElementText,
                    { color: this.state.likeActiveFont }
                  ]}
                >
                  {I18n.t("Like")}
                </Text>
              </Button>
              <Button onPress={this._comment} style={styles.footerElement}>
                <Icon name="comment" size={20} color={Colors.onPrimary} />
                <Text style={styles.footerElementText}>
                  {I18n.t("Comment")}
                </Text>
              </Button>
              {userId != data.created_by.id ? (
                <Button onPress={this._report} style={styles.footerElement}>
                  <Icon name="flag" size={20} color={Colors.onPrimary} />
                  <Text style={styles.footerElementText}>
                    {I18n.t("Report")}
                  </Text>
                </Button>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
        {this.state.isImageZoomable && this.state.pic != null ? (
          <View>
            <Modal visible={true} transparent={true}>
              <View style={{ width: "100%", height: "100%" }}>
                <ImageViewer imageUrls={images} saveToLocalByLongPress={true} />
                <View
                  style={{
                    flexDirection: "row",
                    right: 20,
                    top: 20,
                    color: "red",
                    position: "absolute"
                  }}
                >
                  <TouchableWithoutFeedback onPress={this.downloadImage}>
                    <View style={{ marginRight: 7.5 }}>
                      <CloseIcon
                        name="md-cloud-download"
                        size={30}
                        color={Colors.white}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setState({
                        isImageZoomable: false
                      })
                    }
                  >
                    <View style={{ marginLeft: 7.5 }}>
                      <CloseIcon
                        name="ios-close-circle"
                        size={30}
                        color={Colors.white}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </Modal>
          </View>
        ) : null}
      </View>
    );
  }
}

// <Button onPress={this._share} style={styles.footerElement}>
//     <Icon name="share-alt" size={20} color={Colors.secondaryDark}/>
//     <Text style={styles.footerElementText}>Share</Text>
// </Button>

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    // paddingTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.surface
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.background,
    marginTop: 0
  },
  paddingHorizontal10: {
    paddingHorizontal: 10
  },
  paddingVertical20: {
    paddingVertical: 10
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footerElement: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: 0.7
  },
  footerMetaElementText: {
    fontSize: 10,
    fontWeight: "600",
    opacity: 0.6,
    paddingLeft: 5,
    flexWrap: "wrap",
    maxWidth: "50%"
  },
  footerElementText: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.6,
    paddingLeft: 5
  },
  header: {
    flexDirection: "row"
  },
  headerText: {
    color: Colors.onSurface,
    fontSize: 18,
    fontWeight: "700",
    paddingBottom: 3,
    opacity: 0.7
  },
  headerSubText: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.4
  },
  bodyText: {
    color: Colors.onSurface,
    fontSize: 17,
    fontWeight: "500",
    opacity: 0.7
  },
  image: {
    borderRadius: 20,
    width: 60,
    height: 60,
    aspectRatio: 1.25,
    resizeMode: "contain"
  },
  shadow: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  facePile: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingBottom: 10
  },
  feedImage: {
    width: "100%",
    height: 200,
    marginTop: 5,
    marginBottom: 5
  }
});
const containerStyles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start"
  }
});
