import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback, Animated, Easing} from 'react-native';
import {Colors} from '../constants';


const defaultProps = {
  children: null,
  rippleColor: Colors.secondaryLight,
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

        this.animationValues = {
            scaleValue: new Animated.Value(0),
            opacityRippleValue: new Animated.Value(maxOpacity),
            opacityBackgroundValue: new Animated.Value(0),
        }

        this.state = {
            disabled: props.disabled || defaultProps.disabled,
            color: props.color || defaultProps.rippleColor,
            rippleColor: props.rippleColor || defaultProps.rippleColor,
            title: props.title || defaultProps.title,
            style: props.style || defaultProps.style,
            diameter: MAX_DIAMETER,
            maxOpacity,
        }
    }

    onLayoutChanged = event => {
        try {
            // get width and height of wrapper
            const {nativeEvent: { layout: { width, height },},} = event;
            const diameter = Math.ceil(Math.sqrt(width * width + height * height));

            this.setState({
                diameter: Math.min(diameter, MAX_DIAMETER),
            });
        } catch (e) {
            this.setState({
                diameter: MAX_DIAMETER,
            });
        }
    };

    onPress = () => {
        const { onPress } = this.props;
        const {maxOpacity, diameter} = this.state;
        const {opacityBackgroundValue, opacityRippleValue, scaleValue,} = this.animationValues;

        Animated.parallel([
            // Display background layer thru whole over the view
            Animated.timing(opacityBackgroundValue, {
                toValue: maxOpacity,
                duration: 125 + diameter,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),
            // Opacity of ripple effect starts on maxOpacity and goes to 0
            Animated.timing(opacityRippleValue, {
                toValue: 0,
                duration: 125 + diameter,
                useNativeDriver: true,
            }),
            // Scale of ripple effect starts at 0 and goes to 1
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 125 + diameter,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start(() => {
            // After the effect is fully displayed we need background to be animated back to default
            Animated.timing(opacityBackgroundValue, {
                toValue: 0,
                duration: 100,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }).start();

            this.setDefaultAnimatedValues();

            if (onPress) {
                onPress();
            }
        });
    };

    onPressIn = event => {
        const { onPressIn } = this.props;

        // because we need ripple effect to be displayed exactly from press point
        this.setState({
            pressX: event.nativeEvent.locationX,
            pressY: event.nativeEvent.locationY,
        });

        if (onPressIn) {
            onPressIn();
        }
    };

    setDefaultAnimatedValues = () => {
        const { maxOpacity} = this.state;
        const {opacityRippleValue, scaleValue,} = this.animationValues;
        // We can set up scale to 0 and opacity back to maxOpacity
        scaleValue.setValue(0);
        opacityRippleValue.setValue(maxOpacity);
    };

    renderRippleView = () => {
        const {diameter, pressX, pressY, rippleColor,} = this.state;
        const {opacityRippleValue, scaleValue,} = this.animationValues;

        return (
            // we need set zindex for iOS, because the components with elevation have the
            // zindex set as well, thus, there could be displayed backgroundColor of
            // component with bigger zindex - and that's not good
            <Animated.View key="ripple-view" pointerEvents="none"
            style={[
                {
                    position: 'absolute',
                    top: (pressY || 0) - diameter / 2,
                    left: (pressX || 0) - diameter / 2,
                    width: diameter,
                    height: diameter,
                    borderRadius: diameter / 2,
                    transform: [{ scale: scaleValue }],
                    opacity: opacityRippleValue,
                    backgroundColor: rippleColor,
                    zIndex: ELEVATION_ZINDEX,
                },
            ]}
            />
        );
    };

    renderOpacityBackground = () => {
        const {rippleColor } = this.state;
        const {opacityBackgroundValue} = this.animationValues;

        return (
            // we need set zindex for iOS, because the components with elevation have the
            // zindex set as well, thus, there could be displayed backgroundColor of
            // component with bigger zindex - and that's not good
            <Animated.View key="ripple-opacity" pointerEvents="none"
            style={[
                {
                    ...StyleSheet.absoluteFillObject,
                    opacity: opacityBackgroundValue,
                    backgroundColor: rippleColor,
                    zIndex: ELEVATION_ZINDEX,
                },
            ]}
            />
        );
    };

    render() {
        const {onPress, children} = this.props
        const {style, color, title, disabled} = this.state

        if(children) {
            console.log('have children')
            return(
                <TouchableWithoutFeedback onLayout={this.onLayoutChanged} onPressIn={this.onPressIn} onPress={this.onPress}>
                    <View style={[styles.button, style]}>
                        {children}
                        {this.renderOpacityBackground()}
                        {this.renderRippleView()}

                    </View>
                </TouchableWithoutFeedback>
            )
        }

        return(
            <TouchableWithoutFeedback onLayout={this.onLayoutChanged} onPressIn={this.onPressIn} onPress={this.onPress} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                <View style={[styles.button, style]}>
                    <Text style={[styles.textStyle, {color: color}]}>
                            {title}
                    </Text>
                    {this.renderOpacityBackground()}
                    {this.renderRippleView()}

                </View>
            </TouchableWithoutFeedback>
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
