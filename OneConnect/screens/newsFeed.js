import React from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView, Dimensions, FlatList, TouchableWithoutFeedback} from "react-native";
import { DrawerActions } from 'react-navigation-drawer';
import Feed from '../custom/feed';
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Icon from 'react-native-vector-icons/FontAwesome5';

var {D_height, D_width} = Dimensions.get('window');

export default class NewsFeed extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'NewsFeed',
        headerLeft: (
            <TouchableWithoutFeedback onPress={navigation.getParam('hamPressed')} hitSlop={{top: 5, left: 5, bottom: 5, right: 5}}>
                <Icon name="bars" size={22} color={Colors.onPrimary} />
            </TouchableWithoutFeedback>
        ),
        headerLeftContainerStyle: {
            paddingLeft: 20
        }
    })

    constructor(props){
        super(props)
        this.data = []
        this.state = {
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        console.log("news feed component did mount")
        Manager.addListener('NEWS_S', this._newsSuccess)
        Manager.addListener('NEWS_E', this._newsError)

        Manager.newsFeeds('/api/newsfeeds', 'GET')

        this.props.navigation.setParams({ hamPressed: this._hamPressed });
    }

    componentWillUnmount() {
        Manager.removeListener('NEWS_S', this._newsSuccess)
        Manager.removeListener('NEWS_E', this._newsError)
    }

    _hamPressed = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    _newsSuccess = (data) => {
        this.data = data.data
        console.log("news feed data : ", this.data)
        this.setState({
            loading: false,
        })
    }

    _newsError = (error) => {
        console.log("newsFeed, error received :", error)
        this.setState({
            loading: false,
            error: true
        })
    }

    _openFeed = (item) => {
        this.props.navigation.navigate("OpenFeed", {comment: false, item: item})
    }


    _comment = (item) => {
        this.props.navigation.navigate("OpenFeed", {comment: true, item: item})
    }


    _renderFeeds = ({item}) => {
        console.log("inside render feeds", item)
        return(
            <Feed
                data={item}
                callback={() => this._openFeed(item)}
                commentCallback={() => this._comment(item)}
                touchable
            />
        )
    }

    _itemSeparator = (props) => {
        return(
            <View style={{backgroundColor:Colors.background, paddingVertical: 10}} />
        )
    }

    _renderEmptyList = () => {
        const {loading} = this.state
        if(!loading){
            return(
                <View style={{
                    backgroundColor: Colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 1,
                    height: '100%',
                    width: '100%',
                }}>
                    <Text style={{color: Colors.secondaryDark, fontSize: 22,fontWeight: '700', opacity: 0.4}}>Data not available.</Text>
                </View>
            )
        }
        return null
    }

    _listFooter = () => {
        const {loading} = this.state
        if(!loading) {
            return(
                <View style={{backgroundColor:Colors.background, padding: 10, justifyContent:"center", alignItems: "center"}}><Text style={{color: Colors.secondaryDark, fontWeight: '500', opacity: 0.4}}>End of list.</Text></View>
            )
        }
        else {
            return(
                <View style={{backgroundColor:Colors.background, padding: 10, justifyContent:"center", alignItems: "center"}}>
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryLight} />
                </View>
            )
        }
    }

    _keyExtractor = (item, index) => `nsfd-${Math.random(1)}`;

    render() {
        console.log("this.data", this.data)
      return (
          <FlatList
            data={this.data}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderFeeds}
            ItemSeparatorComponent={this._itemSeparator}
            ListEmptyComponent={this._renderEmptyList}
            ListFooterComponent={this._listFooter}
            style={{backgroundColor: Colors.background}}
        />
      );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        //padding: 10
    },
});
