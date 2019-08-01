import React, {Component} from 'react';
import {StyleSheet, Text, View, Animated, Easing, ActivityIndicator, ImageBackground, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Colors} from '../constants';
import Manager from '../service/dataManager';



export default class AuthLoading extends Component {
    constructor(props){
        super(props)
        this.loaderTranslateXValue = new Animated.Value(0)

        const action = props.navigation.getParam('action', 'login')
        this.state = {
            animatedState: true,
            width: 50,
            height: 2,
            indicatorText: action == 'logout' ? 'logging out' : 'logging in'
            // indicatorText: 'logging in'
        }

    }

    componentDidMount() {
        const {indicatorText} = this.state
        // this._animateLoader(this.state.width)
        switch(indicatorText) {
            case 'logging in' : this._login(); break;
            case 'logging out': this._logout(); break;
            default: this._logout()
        }
    }

    _login = () => {
        AsyncStorage.multiGet(['@appKey','@profilePic'])
        .then(res => {
            if(res[0][1]){
                Manager.setToken(res[0][1], res[1][1])
                // this.setState({
                //     animatedState: false
                // })
                this.props.navigation.navigate('Drawer')
            }
            else{
                // this.setState({
                //     animatedState: false
                // })
                this.props.navigation.navigate('Login')
            }
        })
        .catch(error => {
            // this.setState({
            //     animatedState: false
            // })
            this.props.navigation.navigate('Login')
        })
    }

    _logout = () => {
        let keys = ['@appKey', '@profilePic'];
        AsyncStorage.multiRemove(keys)
        .then(response => {
            this.setState({
                animatedState: false
            })
            this.props.navigation.navigate('Login')
        })
        .catch(error => {
            console.log("error logging out")
            //TODO: show error
        })
    }

    _animateLoader = (value) => {
        translateValue = value
        Animated.timing(this.loaderTranslateXValue, {
            toValue: translateValue,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            if(this.state.animatedState){
                let v = translateValue == this.state.width ? 0 : this.state.width
                this._animateLoader(v)
            }
        })
    }

    onLayoutChanged = event => {
        try {
            // get width and height of wrapper
            const {nativeEvent: { layout: { width, height },},} = event;
            this.setState({
                width: width - 3,
                height: height
            });
        } catch (e) {
            this.setState({
                width: 50,
                height: 2
            });
        }
    };

    render() {
        const {height} = this.state
        return(
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <Image style={styles.image} source={require('../resources/Beebuck_Logo.png')} imageStyle={{resizeMode: 'contain'}}>
                    </Image>
                </View>
                <View style={styles.indicator}>
                    <Text style={{fontSize: 10, fontWeight: '500', paddingBottom: 10}}>{this.state.indicatorText}</Text>
                    <ActivityIndicator animating={this.state.animatedState} size="small" color={Colors.secondaryDark} />
                </View>
            </View>
        )
    }
}

// <View style={styles.loader} onLayout={this.onLayoutChanged}>
//     <Animated.View style={{opacity: 1, width: 5, height:height, backgroundColor: Colors.alternative, transform: [{translateX:this.loaderTranslateXValue}]}}/>
// </View>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        opacity: 0.8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    indicator: {
        marginBottom: 50,
        position: 'absolute',
        bottom: 0,
    },
    loader: {
        marginTop: 10,
        height: 2,
        backgroundColor: Colors.primaryLight,
        // opacity: 0.3,
        justifyContent: 'center',
    },
    image: {
        //width: '100%',
        //height: '100%',
        justifyContent: "center",
    },
})
