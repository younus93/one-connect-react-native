import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, Button} from 'react-native';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import Drawer from './navigators/drawerNavigator';
import LoginScreen from './screens/login';




const navigatorConfig = {
    initialRouteName: 'Login',
};

const RootNavigator = createSwitchNavigator({
    Login: {
        screen: LoginScreen
    },
    Drawer: {
        screen: Drawer
    }
}, navigatorConfig);

const App = createAppContainer(RootNavigator);
export default App;
