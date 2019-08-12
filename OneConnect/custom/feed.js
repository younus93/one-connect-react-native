import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Modal,
  TextInput
} from "react-native";
import { Colors } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import Button from "../custom/button";
import I18n from "../service/i18n";
import FacePile from "react-native-face-pile";

let faceData = [];
let remainingFaces = 0;
export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLikes: props.data.likes,
      likeIconActive: props.data.is_liked,
      likeActivefont: Colors.secondaryLight,
      commentsCount: props.data.comments_count,
      faceData: [],
      remainingFaces: 0
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
        likeActivefont: Colors.secondaryLight,
        commentsCount: nextProps.data.comments_count
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

  _liked = () => {
    if (this.props.likeCallback) {
      this.setState(previousState => {
        if (!previousState.likeIconActive) {
          this.props.data.likes += 1;
          this.props.data.is_liked = true;
          return {
            totalLikes: previousState.totalLikes + 1,
            likeIconActive: !previousState.likeIconActive,
            likeActiveFont: Colors.secondaryDark
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
    // this.props.profileCallback()
  };

  render() {
    const { data } = this.props;
    console.log("faceData");
    let faces = this.props.data.likers;
    console.log("addFaces", this.props);
    faceData = [];
    remainingFaces = this.props.data.likes - 5;
    faces.map((like, index) => {
      let likeData = {};
      likeData.id = index;
      likeData.imageUrl = like.profile_pic;
      faceData.push(likeData);
    });
    return (
      <TouchableWithoutFeedback
        onPress={this._onPress}
        hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
      >
        <View style={[styles.container, this.transformation]}>
          <View style={styles.header}>
            <TouchableWithoutFeedback
              onPress={this._profile}
              hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
            >
              <View style={styles.paddingHorizontal}>
                <Image
                  style={styles.image}
                  source={{
                    uri: data.institution ? data.institution.profile_pic : null
                  }}
                  defaultSource={require("../resources/in_2.jpg")}
                  resizeMode="cover"
                  onError={error => console.log(error)}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this._institute}
              hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
            >
              <View style={styles.paddingHorizontal10}>
                <Text style={styles.headerText}>
                  {data.institution ? data.institution.name : "Institute"}
                </Text>
                <Text style={styles.headerSubText}>{data.created_at}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.paddingVertical20}>
            <Text style={styles.bodyText}>{data.body}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.footer}>
            <Button onPress={this._liked} style={styles.footerElement}>
              <Icon
                name="heart"
                size={20}
                color={Colors.secondaryDark}
                solid={this.state.likeIconActive}
              />
              <Text
                style={[
                  styles.footerElementText,
                  { color: this.state.likeActiveFont }
                ]}
              >
                {this.state.totalLikes} {I18n.t("Like")}
              </Text>
            </Button>
            <Button onPress={this._comment} style={styles.footerElement}>
              <Icon name="comment" size={20} color={Colors.secondaryDark} />
              <Text style={styles.footerElementText}>
                {this.state.commentsCount} {I18n.t("Comment")}
              </Text>
            </Button>
          </View>
          <View style={styles.facePile}>
            {faceData.length > 0 && (
              <FacePile
                numFaces={5}
                faces={faceData}
                hideOverflow={false}
                circleSize={20}
                containerStyle={{
                  alignItems: "flex-start",
                  alignSelf: "flex-start",
                  justifyContent: "flex-start"
                }}
              />
            )}

            {remainingFaces > 0 && (
              <Text
                style={{
                  color: Colors.onSurface,
                  fontSize: 14,
                  fontWeight: "600",
                  opacity: 0.4,
                  paddingTop: 10,
                  paddingLeft: 20
                }}
              >
                +{remainingFaces} liked this
              </Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// <Button onPress={this._share} style={styles.footerElement}>
//     <Icon name="share-alt" size={20} color={Colors.secondaryDark}/>
//     <Text style={styles.footerElementText}>Share</Text>
// </Button>

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.surface
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.background,
    marginTop: 5
  },
  paddingHorizontal10: {
    paddingHorizontal: 10
  },
  paddingVertical20: {
    paddingVertical: 20
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
    width: 40,
    height: 40
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
    flexDirection: "row"
  }
});
const containerStyles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start"
  }
});
