import React from "react";
import {View,TouchableWithoutFeedback} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Button from '../custom/button';

// Screen Imports
import MyProfile from '../screens/profile';
import Settings from '../screens/settings';
import AddCompany from '../screens/addCompany';
import AddEducation from '../screens/addEducation';
import ChangePassword from '../screens/changePassword';
import Privacy from '../screens/privacySetting';
import Terms from "../screens/termsCondition";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../constants'
import I18n from "../service/i18n";

const navigatorConfig = {
    initialRouteName: 'MyProfile',
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
    MyProfile: {
        screen: MyProfile
    },
    Settings: {
        screen: Settings,
        navigationOptions: () => ({
            title: I18n.t('Settings'),
        }),
    },
    ChangePassword: {
        screen: ChangePassword,
        navigationOptions: () => ({
            title: I18n.t('Change_Password'),
        }),
    },
    AddEducation: {
        screen: AddEducation,
        navigationOptions: () => ({
            title:  I18n.t('Add_Education_Details'),
        }),
    },
    AddCompany: {
        screen: AddCompany,
        navigationOptions: () => ({
            title:  I18n.t('Add_Company_Details'),
        }),
    },
    Privacy: {
        screen: Privacy,
        navigationOptions: () => ({
            title: `PRIVACY`,
        }),
    },
    Terms:{
      screen:Terms,
      navigationOptions: () => ({
          title: `Terms & Conditions`,
      }),
    }
}, navigatorConfig);

export default ProfileStack;
