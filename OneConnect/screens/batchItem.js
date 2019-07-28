import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, ActivityIndicator, ScrollView, SafeAreaView, Image, ImageBackground } from "react-native";
import MapView from 'react-native-maps';
import { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Feed from '../custom/feed';


export default class BatchItem extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'VIEWING BATCH',
    })

    constructor(props) {
        super(props)
        this.item = {}
        this.url = this.props.navigation.getParam('url')
        console.log('batch item : ', this.item)
        this.state = {
            loading: true,
            error: false,
            errorText: null
        }
    }

    componentDidMount() {
        Manager.addListener('BATCHITEM_S', this._batchItemSuccess)
        Manager.addListener('BATCHITEM_E', this._batchItemError)
        console.log("url is ", this.url)
        Manager.batchItem(this.url, 'GET');
    }

    componentWillUnmount() {
        Manager.removeListener('BATCHITEM_S', this._batchItemSuccess)
        Manager.removeListener('BATCHITEM_E', this._batchItemError)
    }

    _batchItemSuccess = (data) => {
        console.log("batch data is : ", data)
        this.item = data.data
        this.setState({
            loading: false,
            error: false,
            errorText: null
        })
    }

    _batchItemError = (error) => {
        this.setState({
            loading: false,
            error: true,
            errorText: null
        })
    }

    _toggleError = (state=null) => {
        this.setState(previousState => ({
            error: state ? state: !previousState.error
        }))
    }

    _openFeed = (item) => {
        this.props.navigation.navigate("OpenFeed", {comment: false, item: item})
    }


    _comment = (item) => {
        this.props.navigation.navigate("OpenFeed", {comment: true, item: item})
    }

    _institute = (item) => {
        console.log("reached institute callback with ", item)
        // this.props.navigation.navigate("Institution", {item: item.institution})
    }



    _renderFeeds = ({item}) => {
        return(
            <Feed
                data={item}
                callback={() => this._openFeed(item)}
                commentCallback={() => this._comment(item)}
                instituteCallback={() => this._institute(item)}
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
                <View style={{backgroundColor:Colors.background, padding: 10, justifyContent:"center", alignItems: "center"}}>
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryLight} />
                </View>
            )
        }
    }

    _keyExtractor = (item, index) => `nsfd-${Math.random(1)}`;



    render() {
        if(this.state.loading){
            return(
                <View style={[styles.container, {justifyContent:'center', alignItems: 'center'}]}>
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryLight} />
                </View>
            )
        }

        return(
            <View style={styles.container}>
                <ScrollView alwaysBounceVertical={false} bounces={false}>
                    <View style={styles.banner}>
                        <Image style={styles.image}
                        source={{uri: this.item.institution ? this.item.institution.profile_pic: null}}
                        resizeMode='cover'
                        defaultSource={require('../resources/in_2.jpg')}
                        onError={(error) => console.log(eror)}
                        />
                        <View style={styles.bio}>
                            <Text style={styles.bannerText}>{this.item.institution ? this.item.institution.name : 'None'}</Text>
                            <Text style={styles.bannerText}>{this.item.course.name}</Text>
                            <Text style={styles.bannerText}>{this.item.name}</Text>
                        </View>
                        <View style={styles.tabs}>
                            <Button onPress={() => this.props.navigation.navigate('BatchMates', {'item': this.item.batchmates})} style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={[styles.bannerText, {fontSize: 16}]}>{this.item.batchmates_count}</Text>
                                <Text style={[styles.bannerText, {fontSize: 16}]}>Professionals</Text>
                            </Button>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={[styles.bannerText, {fontSize: 16}]}>{this.item.batch_reminders_count}</Text>
                                <Text style={[styles.bannerText, {fontSize: 16}]}>Announcements</Text>
                            </View>
                        </View>
                    </View>
                    <FlatList
                    data={this.item.posts}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderFeeds}
                    ItemSeparatorComponent={this._itemSeparator}
                    ListEmptyComponent={this._renderEmptyList}
                    ListFooterComponent={this._listFooter}
                    style={{backgroundColor: Colors.background}}
                    />
                </ScrollView>

                <Button style={styles.button} onPress={() => this.props.navigation.navigate('BatchMates', {'item': this.item.batchmates})} title="Batchmates" color={Colors.alternative}>
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    button: {
        backgroundColor: Colors.secondaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 15,
        margin: 10,
    },
    body: {
        // padding: 10
    },
    banner: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
    },
    image: {
        borderRadius: 50,
        width: 100,
        height: 100,
        backfaceVisibility: 'visible',
    },
    bio: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    bannerText: {
        color: Colors.onPrimary,
        fontWeight: '600',
        fontSize: 18,
        paddingTop: 5
    },
    tabs: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    header: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.onSurface,
        opacity: 0.2
    },
    textMain: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.onSurface,
        paddingVertical: 10
    },
    textSecondary: {
        fontSize: 14,
        fontWeight: '300',
        color: Colors.onSurface,
        opacity: 0.5,
        paddingVertical: 5
    }
});
