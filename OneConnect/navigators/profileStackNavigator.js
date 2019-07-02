import { createStackNavigator, createAppContainer } from "react-navigation";

// Screen Imports
import Profile from '../screens/profile';
import Settings from '../screens/settings';
import ChangePassword from '../screens/changePassword';

import {Colors} from '../constants'

const navigatorConfig = {
    initialRouteName: 'Profile',
    defaultNavigationOptions: {
        headerStyle: {
            borderBottomWidth: 0
        },
        headerTintColor: Colors.onPrimary,
        headerBackTitle: null,
        headerTransparent: true
    }
};

const ProfileStack = createStackNavigator({
    Profile: {
        screen: Profile
    },
    Settings: {
        screen: Settings,
        navigationOptions: () => ({
            title: `Settings`,
            headerStyle: {
                backgroundColor: Colors.primary
            },
            headerTransparent: false
        }),
    },
    ChangePassword: {
        screen: ChangePassword,
        navigationOptions: () => ({
            title: `Change Password`,
            headerStyle: {
                backgroundColor: Colors.primary
            },
            headerTransparent: false
        }),
    }
}, navigatorConfig);

export default ProfileStack;
