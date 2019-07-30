import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, FlatList, Alert} from "react-native";
import { DrawerActions } from 'react-navigation-drawer';
import Feed from '../custom/feed';
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from '../custom/button';

export default class NewsFeed extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'NEWS FEEDS',
        headerLeft: (
            <Button style={{borderRadius: 20}} onPress={navigation.getParam('hamPressed')} >
                <Icon name="bars" size={22} color={Colors.onPrimary} style={{padding:10}}/>
            </Button>
        ),
        headerLeftContainerStyle: {
            paddingLeft: 15
        }
    })

    constructor(props){
        super(props)
        this.data = []
        this.state = {
            data: [],
            loading: true,
            refreshing: false,
            error: false,
            totalPage: 0,
            currentPage: 0,
            updateToggle: false
        }
    }

    componentDidMount() {
        console.log("news feed component did mount")
        Manager.addListener('NEWS_S', this._newsSuccess)
        Manager.addListener('NEWS_E', this._newsError)

        Manager.addListener('LIKE_S', this._likeSuccess)
        Manager.addListener('LIKE_E', this._likeError)

        Manager.addListener('UPDATENEWS', this._updateNews)

        Manager.newsFeeds('/api/newsfeeds?page=1', 'GET')

        this.props.navigation.setParams({ hamPressed: this._hamPressed });
    }

    componentWillUnmount() {
        console.log("news feed component did un mount")
        Manager.removeListener('NEWS_S', this._newsSuccess)
        Manager.removeListener('NEWS_E', this._newsError)

        Manager.removeListener('LIKE_S', this._likeSuccess)
        Manager.removeListener('LIKE_E', this._likeError)

        Manager.removeListener('UPDATENEWS', this._updateNews)
    }

    _hamPressed = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    _updateNews = () => {
        console.log("updating news")
        this.setState(previousState => ({
            updateToggle: !previousState.updateToggle
        }))
    }

    _newsSuccess = (data) => {
        console.log("news feed successfull : ", data)
        // TODO: FIX IT.
        this.data = [...this.data, ...data.data]
        this.setState(state => ({
            loading: false,
            refreshing: false,
            data: this.data,
            totalPage: data.meta.total,
            currentPage: data.meta.current_page
        }));
    }

    _newsError = (error) => {
        console.log("newsFeed, error received :", error)
        this.setState({
            loading: false,
            refreshing: false,
            error: true,
            totalPage: 0,
            currentPage: 0
        })
    }

    _likeSuccess = (data) => {
        console.log("like success data : ", data)
        this._updateNews()
    }

    _likeError = (error) => {
        console.log("like success data : ", error)
    }

    _openFeed = (item) => {
        this.props.navigation.navigate("OpenFeed", {comment: false, item: item})
    }


    _comment = (item) => {
        this.props.navigation.navigate("OpenFeed", {comment: true, item: item})
    }

    _like = (item) => {
        console.log("item after like: ", item)
        Manager.like(item.resource_url+'/likes', 'POST', {'body':item.likes})

    }

    _institute = (item) => {
        console.log("reached institute callback with ", item)
        this.props.navigation.navigate("Institution", {item: item.institution})
    }

    _renderFeeds = ({item}) => {
        return(
            <Feed
                data={item}
                callback={() => this._openFeed(item)}
                commentCallback={() => this._comment(item)}
                instituteCallback={() => this._institute(item)}
                likeCallback = {() => this._like(item)}
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
        if(!loading && this.data) {
            return(
                <View style={{backgroundColor:Colors.background, padding: 10, justifyContent:"center", alignItems: "center"}}><Text style={{color: Colors.secondaryDark, fontWeight: '500', opacity: 0.4}}>End of list.</Text></View>
            )
        }
        else {
            return(
                <View style={{backgroundColor:Colors.background, padding: 10,paddingTop: 20, justifyContent:"center", alignItems: "center"}}>
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryLight} />
                </View>
            )
        }
    }

    _loadMore = ({distanceFromEnd}) => {
        console.log("inside load more")
        const {currentPage, totalPage, loading} = this.state

        if(currentPage != totalPage && !loading) {
            console.log("loading more data from ", currentPage + 1)
            Manager.newsFeeds(`/api/newsfeeds?page=${currentPage+1}`, 'GET')
            this.setState(state => ({
                loading: true
            }))
        }
    }

    _refresh = () => {
        this.setState({
            data: [],
            loading: true,
            refreshing: true,
            error: false,
            totalPage: 0,
            currentPage: 0,
            updateToggle: false
        })
        Manager.newsFeeds('/api/newsfeeds?page=1', 'GET')
    }

    _keyExtractor = (item, index) => `nsfd-${Math.random(1)}`;

    _searchFilter = (text) => {
        if(!text){
            console.log("no txt")
            this.setState({data: this.data})
        }
        else {
            console.log("search text is :", text)
            const {data} = this.state;
            let regex = new RegExp(text, "i");
            const searchedData = data.filter(item => {
                const match = regex.test(item.institution.name)
                return match
            })
            console.log("searched list : ", searchedData)
            this.setState({data: searchedData})
        }
    };

    render() {
        const {data} = this.state
        console.log("render data is ", data)
        return (
            <View style={styles.container}>
                <FlatList
                data={this.state.data}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderFeeds}
                ItemSeparatorComponent={this._itemSeparator}
                ListEmptyComponent={this._renderEmptyList}
                ListFooterComponent={this._listFooter}
                onEndReached={this._loadMore}
                onEndReachedThreshold={0.7}
                onRefresh={this._refresh}
                refreshing={this.state.refreshing}
                style={{backgroundColor: Colors.background}}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        //padding: 10
    },
    header: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 40,
        backgroundColor: Colors.surface,
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 3,
        borderRadius: 20,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        zIndex: 100
    },
    search:{
        flex: 1,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        justifyContent:'flex-start',
        alignItems: 'flex-start'
    },
    textInput:{
        width: '100%',
        height: '100%',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        fontSize: 16
    },
    drawerButton: {
        marginLeft: 10,
        marginRight: 5,
        borderRadius: 20
    },
});
