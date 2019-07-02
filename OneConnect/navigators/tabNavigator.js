import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import FeedStack from './feedStackNavigator';
import ProfileStack from './profileStackNavigator';

import {Colors} from '../constants'


//`newspaper${focused ? '' : '-outline'}`
const navigatorConfig = {
    initialRouteName: 'FeedStack',
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let IconComponent = Icon;
            let iconName;
            if (routeName === 'FeedStack') {
                iconName = `rss-square`;
                // Sometimes we want to add badges to some icons.
                // You can check the implementation below.
                // IconComponent = HomeIconWithBadge;
            }
            else if (routeName === 'ProfileStack') {
                iconName = `user`;
            }

            // You can return any component that you like here!
            return <IconComponent name={iconName} size={25} color={tintColor} />;
        }
    }),
    tabBarOptions: {
        activeTintColor: Colors.secondaryDark,
        inactiveTintColor: Colors.primaryDark,
        style: {
            backgroundColor: Colors.primaryLight
        },
        labelStyle: {
            fontSize: 14
        },
        allowFontScaling: false
    },
    backBehavior: 'initialRoute'
};

const Tab = createBottomTabNavigator({
    FeedStack: {
        screen: FeedStack,
        navigationOptions: {
            title: "NewsFeed"
        }
    },
    ProfileStack: {
        screen: ProfileStack,
        navigationOptions: {
            title: "Profile"
        }
    }
}, navigatorConfig);

export default Tab;
