import React from "react";
import { View, Text, StyleSheet, ScrollView, Keyboard, Animated, Dimensions, UIManager, TextInput, ActivityIndicator} from "react-native";

import Comments from '../custom/comments';
import Feed from '../custom/feed';
import ProfileImage from '../custom/profileImage'
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';

const { State: TextInputState } = TextInput;
const textFontSize = 14

export default class OpenFeed extends React.Component {
    static navigationOptions = {
        title: 'Feed'
    }

    constructor(props){
        super(props)
        this.shift = new Animated.Value(0)
        this.data = this.props.navigation.getParam('item', null)
        this.comments = null
        this.newComment = null
        console.log("open feed item : ", this.data)
        this.state = {
            commentBoxFocus: props.navigation.getParam('comment', false),
            commentLoading: true,
            error: false
        }
    }

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this._handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this._handleKeyboardDidHide);

        Manager.addListener('COMMENTS_S', this._commentsLoadingSuccess)
        Manager.addListener('COMMENTS_E', this._commentsLoadingError)

        Manager.getFeedComments(this.data['resource_url']+'/comments', 'GET')
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();

        Manager.removeListener('COMMENTS_S', this._commentsLoadingSuccess)
        Manager.removeListener('COMMENTS_E', this._commentsLoadingError)
    }

    _commentsLoadingSuccess = (data) => {
        this.comments = data.data
        console.log("feed comment data : ", this.comments)
        this.setState({
            commentLoading: false,
        })
    }

    _commentsLoadingError = (error) => {
        console.log("feed comment, error :", error)
        this.setState({
            commentLoading: false,
            error: true
        })
    }

    _handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        console.log("currently focused :", currentlyFocusedField)
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight + 20);
            if (gap >= 0) {
                return;
            }
            Animated.timing(this.shift, {
                toValue: gap,
                duration: 10,
                useNativeDriver: true,
            }).start();
        });
    }

    _handleKeyboardDidHide = () => {
        Animated.timing(this.shift, {
            toValue: 0,
            duration: 10,
            useNativeDriver: true,
        }).start();
    }

    _focusCommentBox = () => {
        console.log("inside open feed comment")
        this.commentBox.focus();
        // this.setState((previousState) => ({
        //     commentBoxFocus: !previousState.commentBoxFocus
        // }))
    }

    _writeComment = (text) => {
        this.newComment = text
    }

    _postComment = () => {
        if(this.newComment){
            console.log("posting comment :", this.newComment)
            Manager.postComments(this.data['resource_url']+'/comments', 'POST', {'body':this.newComment})
            this.setState({
                commentLoading: true,
                commentBoxFocus: false
            })
            this.newComment = null
            this.commentBox.clear()
            this.commentBox.blur()
        }
        else {
            console.log("not posting comment :", this.newComment)
        }
    }

    _renderComments = () => {
        if(this.state.commentLoading){
            return(
                <View style={{backgroundColor:Colors.background, padding: 10, justifyContent:"center", alignItems: "center"}}>
                    <ActivityIndicator animating={this.state.commentLoading} size="large" color={Colors.secondaryDark} />
                </View>
            )
        }

        if(!this.comments){
            return null
        }

        return(
            this.comments.map(item => {
                return(
                    <Comments key={`cs-${Math.random(1)}`} data={item} />
                )
            })
        )
    }

    render() {
      return (
        <View style={styles.container}>
            <ScrollView alwaysBounceVertical={false} bounces={false}>
                <Feed data={this.props.navigation.getParam('item', 'Data not available')} commentCallback={this._focusCommentBox}/>
                <View style={{height:1, backgroundColor: Colors.background}}/>
                {this._renderComments()}
            </ScrollView>
            <Animated.View style={[styles.container2, {transform: [{translateY: this.shift}]}]}>
                <View style={{justifyContent:'flex-start'}}>
                    <ProfileImage width={40} height={40} borderRadius={20} />
                </View>
                <View style={{flex: 1,justifyContent: 'center'}}>
                    <TextInput
                        ref={(e) => this.commentBox=e}
                        allowFontScaling={false}
                        multiline={true}
                        placeholder="Leave your thoughts here..."
                        placeholderTextColor={Colors.primaryLight}
                        onChangeText={this._writeComment}
                        style={styles.commentInput}
                        autoFocus={this.state.commentBoxFocus}
                     />
                </View>
                <View style={{justifyContent:'flex-end'}}>
                    <Button style={styles.button} onPress={this._postComment} title="POST" color={Colors.alternative}/>
                </View>
            </Animated.View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "space-between"
    },
    container2: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems:'center',
        padding: 10,
        backgroundColor: Colors.surface,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.primaryDark,
        maxHeight: textFontSize*1.2*10
    },
    commentInput: {
        fontSize: textFontSize,
        fontWeight: '400',
        paddingHorizontal: 10,
    },
    button:{
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 0,
        paddingVertical: 8,
    },
})
