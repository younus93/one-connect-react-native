import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {Colors} from '../constants';

export default class Button extends React.Component {
    constructor(props){
        super(props)

    }

    render() {
        return(
            <TouchableWithoutFeedback onPress={this.props.onPress} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                <View style={[styles.button, this.props.style]}>
                    <Text style={{
                        color: this.props.color, fontWeight: '600'
                    }}>
                        {this.props.title}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        backgroundColor: Colors.secondaryDark,
        borderRadius: 30,
        marginVertical: 10,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
