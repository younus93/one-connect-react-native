import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableNativeFeedback, Platform} from 'react-native';
import {Colors} from '../constants';


const defaultProps = {
  children: null,
  rippleColor: Colors.secondary,
  textColor: 'black',
  disabled: false,
  maxOpacity: 0.16,
  title: 'BUTTON',
  style: {},
  rippleLayout: {}
};

/**
* Usualy we use width and height to compute this. In case, the width of container is too big
* we use this constant as a width of ripple effect.
*/
const MAX_DIAMETER = 200;
const ELEVATION_ZINDEX = 100;


export default class Button extends React.Component {
    constructor(props){
        super(props)

        const maxOpacity = defaultProps.maxOpacity;

        this.state = {
            ripple: props.disabled || defaultProps.disabled,
            color: props.color || defaultProps.rippleColor,
            rippleColor: props.rippleColor || defaultProps.rippleColor,
            title: props.title || defaultProps.title,
            style: props.style || defaultProps.style,
        }
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     console.log("should update button")
    //     if(this.props == nextProps) {
    //         console.log("updating button")
    //         return true
    //     }
    //     return false
    // }

    render() {
        const {children, onPress} = this.props
        const {rippleColor, style, color, title} = this.state
        const background = TouchableNativeFeedback.Ripple(rippleColor, false);

        if(children) {
            // console.log('have children', children)
            return(
                <TouchableNativeFeedback onPress={onPress} background={background} useForeground={true} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                    <View style={[styles.button, style]}>
                        {children}
                    </View>
                </TouchableNativeFeedback>
            )
        }

        return(
            <TouchableNativeFeedback onPress={onPress} background={background} useForeground={true} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                <View style={[styles.button, style]}>
                    <Text style={[styles.textStyle, {color: color}]}>
                            {title}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        overflow: 'hidden',
    },
    textStyle: {
        fontWeight: '600'
    }
});
