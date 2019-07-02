import React from 'react';
import {Button} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import NewsFeed from '../screens/newsFeed';
import OpenFeed from '../screens/openFeed';

import {Colors} from '../constants'

const navigatorConfig = {
    initialRouteName: 'NewsFeed',
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Colors.primary
        },
        headerTintColor: Colors.onPrimary,
        headerTitleAllowFontScaling: false,
        headerBackTitle: null,
    }
};

const FeedStack = createStackNavigator({
    NewsFeed: {
        screen: NewsFeed
    },
    OpenFeed: {
        screen: OpenFeed
    }
}, navigatorConfig);

export default FeedStack;
