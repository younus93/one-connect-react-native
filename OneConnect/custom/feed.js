import React from "react";
import { View, Text, Button, StyleSheet, Image, TouchableWithoutFeedback, Animated, Easing} from "react-native";
import {Colors} from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Feed extends React.Component {
    constructor(props){
        super(props)
        this.animatedValue = new Animated.Value(1)
        this.animatedLikeSize = new Animated.Value(20)

        this.transformation = {
            transform:[{scale: this.animatedValue}]
        }


        this.state = {
            totalLikes: props.data.likes,
            likeIconActive: false,
            likeActivefont: Colors.secondaryLight
        }
    }

    componentDidLoad(){
    }

    _onPress = (e) => {
        console.log("in focus")
        if(this.props.touchable) {
            Animated.sequence([
                Animated.spring(this.animatedValue, {
                    toValue: .99,
                    duration: 10,
                    easing: Easing.ease,
                }),
                Animated.spring(this.animatedValue, {
                    toValue: 1,
                    duration: 10,
                    easing: Easing.ease,
                })
            ]).start()
            if(this.props.callback){
                this.props.callback()
            }
        }
    }

    _comment = (e) => {
        if(this.props.commentCallback){
            this.props.commentCallback()
        }
    }

    _liked = () => {
        this.setState((previousState) => {
            if (!previousState.likeIconActive) {
                Animated.sequence([
                    Animated.timing(this.animatedLikeSize, {
                        toValue: 25,
                        duration: 100,
                        easing: Easing.ease,
                    }),
                    Animated.timing(this.animatedLikeSize, {
                        toValue: 20,
                        duration: 100,
                        easing: Easing.ease,
                    })
                ]).start()
                return (
                    {
                        totalLikes: previousState.totalLikes + 1,
                        likeIconActive: !previousState.likeIconActive,
                        likeActiveFont: Colors.secondaryDark
                    }
                )
            }
            else {
                return (
                    {
                        totalLikes: previousState.totalLikes - 1,
                        likeIconActive: !previousState.likeIconActive,
                        likeActiveFont: Colors.onSurface
                    }
                )
            }
        })
    }

    render() {
      const {data} = this.props
      const AnimatedIcon = Animated.createAnimatedComponent(Icon)
      return (
        <TouchableWithoutFeedback onPress={this._onPress} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
            <Animated.View style={[styles.container, this.transformation]}>
                <View style={styles.header}>
                    <View style={styles.paddingHorizontal}>
                        <Image style={styles.image}
                            source={require('../resources/dummy_profile.png')}
                            resizeMode='cover'
                            onError={(error) => console.log(eror)}
                        />
                    </View>
                    <View style={styles.paddingHorizontal10}>
                        <Text style={styles.headerText}>{data.institution.name}</Text>
                        <Text style={styles.headerSubText}>Location</Text>
                    </View>
                </View>
                <View style={styles.paddingVertical20}>
                    <Text style={styles.bodyText}>{data.body}</Text>
                </View>
                <View style={styles.separator}/>
                <View style={styles.footer}>
                    <TouchableWithoutFeedback onPress={this._liked} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                        <View style={styles.footerElement}>
                            <AnimatedIcon name="heart" size={this.animatedLikeSize} color={Colors.secondaryDark} solid={this.state.likeIconActive}/>
                            <Text style={[styles.footerElementText, {color: this.state.likeActiveFont}]}>{this.state.totalLikes} Like</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._comment} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                        <View style={styles.footerElement}>
                            <Icon name="comment" size={20} color={Colors.secondaryDark}/>
                            <Text style={styles.footerElementText}>{data.comments_count} Comment</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._onPress} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                        <View style={styles.footerElement}>
                            <Icon name="share-alt" size={20} color={Colors.secondaryDark}/>
                            <Text style={styles.footerElementText}>Share</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        padding: 20,
        backgroundColor: Colors.surface,
    },
    separator: {
        width: '100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.background,
        marginVertical: 5,
    },
    paddingHorizontal10: {
        paddingHorizontal: 10
    },
    paddingVertical20: {
        paddingVertical: 20
    },
    footer: {
        //paddingVertical: 10,
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    footerElement: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.7,
    },
    footerElementText: {
        color: Colors.onSurface,
        opacity: 0.5,
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.6,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
    },
    headerText: {
        color: Colors.onSurface,
        fontSize: 18,
        fontWeight: '700',
        paddingBottom: 3,
        opacity: 0.7
    },
    headerSubText: {
        color: Colors.onSurface,
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.4
    },
    bodyText: {
        color: Colors.onSurface,
        fontSize: 17,
        fontWeight: '500',
        opacity: 0.7
    },
    image: {
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    shadow: {
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
});
