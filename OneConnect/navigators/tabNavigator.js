import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import FeedStack from './feedStackNavigator';
import ProfileStack from './profileStackNavigator';
import SearchStack from './searchStack';
import NotificationStack from './notificationStack';

import {Colors} from '../constants'


//`newspaper${focused ? '' : '-outline'}`
const navigatorConfig = {
    initialRouteName: 'FeedStack',
    resetOnBlur: true,
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
            else if (routeName === 'SearchStack') {
                iconName = 'search'
            }
            else if (routeName === 'NotificationStack') {
                iconName = 'bell'
            }

            // You can return any component that you like here!
            return <IconComponent name={iconName} size={20} color={tintColor} />;
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
    backBehavior: 'history'
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
    },
    SearchStack: {
        screen: SearchStack,
        navigationOptions: {
            title: 'Search'
        }
    },
    NotificationStack: {
        screen: NotificationStack,
        navigationOptions: {
            title: 'Notification'
        }
    }
}, navigatorConfig);

export default Tab;
