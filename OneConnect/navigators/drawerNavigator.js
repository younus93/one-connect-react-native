import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';

// Routes
import Tab from './tabNavigator';
import AuthLoading from '../screens/authLoading';

// Custom components import
import CustomDrawerContentComponent from '../custom/customDrawerContentComponent'


// Navigator configuration object
const navigatorConfig = {
    initialRouteName: 'Tab',
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
        activeTintColor: '#e91e63',
        itemsContainerStyle: {
            marginVertical: 0,
        },
        iconContainerStyle: {
            opacity: 1
        }
    },
    backBehavior: 'initialRoute'
    // navigationOptions: ({navigation}) =>{
    //     console.log("***", navigation)
    // }
}

// Navigator object
const Drawer = createDrawerNavigator({
    Tab: {
        screen: Tab
    },
    AuthLoading: {
        screen: AuthLoading,
    },
    // ChangePassword: {
    //     screen: ChangePassword
    // }
}, navigatorConfig);

export default Drawer;
