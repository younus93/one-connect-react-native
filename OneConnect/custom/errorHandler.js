import React from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableWithoutFeedback, SafeAreaView} from "react-native";
import {Colors} from '../constants';

const defaultProps = {
    error: false,
    errorText: "Error",
    backgroundColor: Colors.error
};
const MAX_HEIGHT = 100;

export default class ErrorHandler extends React.Component {
    constructor(props) {
        super(props)
        this.error_box_Y = new Animated.Value(0);
        this.opacity = new Animated.Value(0);
        this.height = MAX_HEIGHT
        this.state = {
            error: props.error || defaultProps.error,
            errorText: props.errorText || defaultProps.errorText,
            backgroundColor: props.backgroundColor || defaultProps.backgroundColor,
            opacityModal: new Animated.Value(0),
            translateYValue: new Animated.Value(0),
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.error != nextProps.error) {
            console.log("current state and next props not match")
            this.setState({
                error: nextProps.error || defaultProps.error,
                errorText: nextProps.errorText || defaultProps.errorText,
                backgroundColor: nextProps.backgroundColor || defaultProps.backgroundColor
            })
        }
    }

    onLayoutChanged = event => {
        try {
            // get width and height of wrapper
            const {nativeEvent: { layout: { width, height },},} = event;
            this.height = height
        } catch (e) {
            this.height = MAX_HEIGHT
        }
    };

    _translateY = () => {
        const {translateYValue, opacityModal} = this.state
        translateYValue.setValue(-this.height);
        Animated.parallel([
            Animated.spring(translateYValue, {
                toValue: 0,
                duration: 1000,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(opacityModal, {
                toValue: 1,
                duration: 500,
                delay: 10,
                easing: Easing.in(Easing.linear),
                useNativeDriver: true,
            }),
        ]).start();
    }

    _closeModal = () => {
        const {translateYValue, opacityModal} = this.state
        Animated.parallel([
            Animated.spring(translateYValue, {
                toValue: -this.height,
                duration: 1000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(opacityModal, {
                toValue: 0,
                duration: 100,
                delay: 10,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            this.setState({
                error: defaultProps.error,
                errorText: defaultProps.errorText
            })
            this.props.callback(false)
        })
    }

    _renderErrorComponent = () => {
        const {error, errorText, backgroundColor, translateYValue, opacityModal} = this.state
        if(error){
            this._translateY()
            return(
                <Animated.View onLayout={this.onLayoutChanged} style={[styles.errorContainer, {opacity: opacityModal, transform: [{translateY: translateYValue}]}]}>
                    <SafeAreaView forceInset={{ top: 'always'}}>
                        <View style={[styles.errorSubContainer, {backgroundColor: backgroundColor}]}>
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
