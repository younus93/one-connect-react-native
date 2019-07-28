import { createStackNavigator, createAppContainer } from "react-navigation";
import Notification from '../screens/notification';
import {Colors} from '../constants'

const navigatorConfig = {
    initialRouteName: 'Notification',
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

const NotificationStack = createStackNavigator({
    Notification: {
        screen: Notification,
    },
}, navigatorConfig);

export default NotificationStack;
