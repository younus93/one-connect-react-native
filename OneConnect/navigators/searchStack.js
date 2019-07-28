import { createStackNavigator, createAppContainer } from "react-navigation";
import Search from '../screens/search';

import OpenFeed from '../screens/openFeed';
import Institution from '../screens/institution';
import Courses from '../screens/courses';
import BatchItem from '../screens/batchItem';
import BatchMates from '../screens/batchmates';
import Batch from '../screens/batch';
import Profile from '../screens/profile';

import {Colors} from '../constants'

const navigatorConfig = {
    initialRouteName: 'Search',
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

const SearchStack = createStackNavigator({
    Search: {
        screen: Search,
    },
    Batch: {
        screen: Batch
    },
    BatchItem: {
        screen: BatchItem
    },
    BatchMates: {
        screen: BatchMates
    },
    OpenFeed: {
        screen: OpenFeed
    },
    Institution: {
        screen: Institution
    },
    Courses: {
        screen: Courses
    },
    Profile: {
        screen: Profile,
    },
}, navigatorConfig);

export default SearchStack;
