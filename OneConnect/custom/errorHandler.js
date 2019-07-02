import React from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableWithoutFeedback, SafeAreaView} from "react-native";
import {Colors} from '../constants';


export default class ErrorHandler extends React.Component {
    constructor(props) {
        super(props)
        this.error_box_Y = new Animated.Value(0);
        this.opacity = new Animated.Value(0);
        this.state = {
            error: props.error,
            errorText: props.errorText
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("will receive props")
        if(this.state.error != nextProps.error) {
            console.log("current state and next props not match")
            this.setState({
                error: nextProps.error,
                errorText: nextProps.errorText
            })
        }
    }

    _translateY = () => {
        this.error_box_Y.setValue(0);
        Animated.parallel([
            Animated.timing(this.opacity, {
                toValue: 1,
                duration: 100,
                easing: Easing.linear
            }),
            Animated.spring(this.error_box_Y, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear
            })
        ]).start();

    }

    _closeModal = () => {
        Animated.parallel([
            Animated.timing(this.opacity, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear
            }),
            Animated.spring(this.error_box_Y, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear
            })
        ]).start(() => {
            this.setState({
                error: false,
                errorText: null
            })
            this.props.callback(false)
        })
    }

    _renderErrorComponent = () => {
        const {error, errorText} = this.state
        if(error){
            const error_box_translateY = this.error_box_Y.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
            });
            this._translateY()
            console.log('error text : ', errorText)
            return(
                <Animated.View style={[styles.errorContainer, {opacity: this.opacity, transform: [{translateY: error_box_translateY}]}]}>
                    <SafeAreaView forceInset={{ top: 'always'}}>
                        <View style={styles.errorSubContainer}>
                            <View style={styles.errorTextContainer}>
                                <Text style={styles.errorText}>{errorText}</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={this._closeModal} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}>
                                <View style={styles.crossButtonContainer}>
                                    <Text style={styles.crossButton}>X</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </SafeAreaView>
                </Animated.View>
            )
        }
        return null;
    }

    render() {
        return(
            <View style={styles.container}>
                {this.props.children}
                {this._renderErrorComponent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    errorContainer: {
        position: 'absolute',
        // top:0,
        left: 0,
        width: '100%',
        padding: 5,
    },
    errorSubContainer: {
        flexDirection: 'row',
        // padding:3,
        borderRadius: 8,
        backgroundColor: Colors.error,
    },
    errorText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.onError
    },
    crossButtonContainer: {
        paddingTop: 2,
        paddingRight: 8,
        alignItems: 'flex-start',
    },
    crossButton:{
        fontSize: 14,
        fontWeight: '700',
        color: Colors.secondaryLight
    },
    errorTextContainer: {
        flex: 1,
        padding: 20,
        // paddingRight: 18,
        justifyContent:'center',
        alignItems: 'center',
    }
})
