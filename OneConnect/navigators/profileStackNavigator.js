import React from "react";
import {View,TouchableWithoutFeedback} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Button from '../custom/button';

// Screen Imports
import Profile from '../screens/profile';
import Settings from '../screens/settings';
import AddCompany from '../screens/addCompany';
import ChangePassword from '../screens/changePassword';
import Privacy from '../screens/privacySetting';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../constants'

const navigatorConfig = {
    initialRouteName: 'Profile',
    initialRouteParams: {url: '/api/profile', accessLevel: 1},
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Colors.primary,
            borderBottomWidth: 0
        },
        headerTitleStyle: {
            fontSize: 17
        },
        headerTintColor: Colors.onPrimary,
        headerTitleAllowFontScaling: false,
        headerBackTitle: null,
    },
};

const ProfileStack = createStackNavigator({
    Profile: {
        screen: Profile,
    },
    Settings: {
        screen: Settings,
        navigationOptions: () => ({
            title: `SETTINGS`,
        }),
    },
    ChangePassword: {
        screen: ChangePassword,
        navigationOptions: () => ({
            title: `CHANGE PASSWORD`,
        }),
    },
    AddCompany: {
        screen: AddCompany,
        navigationOptions: () => ({
            title: `ADD COMPANY`,
        }),
    },
    Privacy: {
        screen: Privacy,
        navigationOptions: () => ({
            title: `PRIVACY`,
        }),
    }
}, navigatorConfig);

export default ProfileStack;
