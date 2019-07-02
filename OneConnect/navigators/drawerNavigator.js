import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';

// Navigator Imports
import Tab from './tabNavigator';

// Screen Import
import Batch from '../screens/batch';
import Settings from '../screens/settings';

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
    // Settings: {
    //     screen: Settings,
    // },
    // Batch: {
    //     screen: Batch
    // }
}, navigatorConfig);

export default Drawer;
