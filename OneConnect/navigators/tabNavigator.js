import React from 'react';
import { View, Text } from "react-native";
import { createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import FeedStack from './feedStackNavigator';
import ProfileStack from './profileStackNavigator';
import SearchStack from './searchStack';
import NotificationStack from './notificationStack';
import FriendsStack from './friendsStack';
import I18n from '../service/i18n';
import Manager from '../service/dataManager';

import {Colors} from '../constants'

class Lable extends React.Component {
    constructor(props){
        super(props)
        Manager.addListener('LANG_U', this._updateLanguage)
        this.title = props.title
        this.state = {
            lable: props.lable,
        }
    }
    componentWillUnmount() {
        Manager.removeListener('LANG_U', this._updateLanguage)
    }

    _updateLanguage = () => {
        console.log("updating tab lable", this.title, I18n.t(this.title))
        this.setState({
            lable: I18n.t(this.title)
        })
    }

    render() {
        console.log('lable is : ', this.state.lable)
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{this.state.lable}</Text>
            </View>
        )
    }
}


const navigatorConfig = {
    initialRouteName: 'FeedStack',
    resetOnBlur: true,
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let IconComponent = Icon;
            let iconName;
            if (routeName === 'FeedStack') {
                iconName = `home`;
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
            else if (routeName === 'FriendsStack') {
                iconName = 'user-friends'
            }

            // You can return any component that you like here!
            return <IconComponent name={iconName} size={24} color={tintColor} solid={true}/>;
        },
        tabBarLabel: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let lableName;
            let titleName;

            if (routeName === 'FeedStack') {
                titleName = 'Newsfeed'
                lableName = I18n.t('Newsfeed');
            }
            else if (routeName === 'ProfileStack') {
                titleName = 'Profile'
                lableName = I18n.t('Profile');
            }
            else if (routeName === 'SearchStack') {
                titleName = 'Search'
                lableName = I18n.t('Search');
            }
            else if (routeName === 'NotificationStack') {
                titleName = 'Notifications'
                lableName = I18n.t('Notifications');
            }
            else if (routeName === 'FriendsStack') {
                titleName = 'Friends'
                lableName = I18n.t('Friends');
            }

            // return <Lable lable={lableName} title={titleName}/>
        }
    }),
    tabBarOptions: {
        activeTintColor: Colors.yellowDark,
        inactiveTintColor: Colors.greyDark,
        style: {
            backgroundColor: Colors.white
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
    },
    ProfileStack: {
        screen: ProfileStack,
    },
    SearchStack: {
        screen: SearchStack,
    },
    NotificationStack: {
        screen: NotificationStack,
    },
    FriendsStack: {
        screen: FriendsStack,
    }
}, navigatorConfig);

export default Tab;
