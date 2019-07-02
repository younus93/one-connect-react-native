import React from "react";
import { View, Text, Button, StyleSheet, Image, TouchableWithoutFeedback, Animated, Easing} from "react-native";
import {Colors} from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ProfileImage from './profileImage'

export default class Comments extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            data: props.data
        }
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={styles.display}>
                    <View style={styles.paddingHorizontal}>
                        <Image style={styles.image}
                            source={require("../resources/dummy_profile.png")}
                            resizeMode='cover'
                            onError={(error) => console.log(error)}
                        />
                    </View>
                </View>
                <View style={[styles.body]}>
                    <View style={[styles.paddingHorizontal10]}>
                        <Text style={styles.headerText}>{this.state.data.poster.f_name + ' ' + this.state.data.poster.l_name}</Text>
                    </View>
                    <View style={[styles.paddingHorizontal10, {paddingTop: 20, paddingBottom: 5}]}>
                        <Text style={styles.bodyText}>{this.state.data.body}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: Colors.surface,
    },
    display: {
        paddingTop:5,
    },
    body: {
        flex: 1,
        marginHorizontal: 3,
        paddingTop: 8,
        paddingBottom: 5,
        justifyContent:'space-between',
        backgroundColor: Colors.background,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    paddingHorizontal10: {
        paddingHorizontal: 10
    },
    paddingVertical20: {
        paddingVertical: 20
    },
    image: {
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    headerText: {
        color: Colors.onSurface,
        fontSize: 14,
        fontWeight: '500',
        paddingBottom: 3,
        opacity: 0.9,
    },
    bodyText: {
        color: Colors.onSurface,
        fontSize: 14,
        fontWeight: '400',
        //opacity: 0.7,
    },
});
