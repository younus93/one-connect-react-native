import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator,SafeAreaView, TextInput, Keyboard, Image} from "react-native";
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import { DrawerActions } from 'react-navigation-drawer';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import I18n from '../service/i18n';


export default class Search extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: '',
        header: null
    })

    constructor(props){
        super(props)
        this.type = ['users', "batches", "posts"]
        this.data = null

        this.showUser= true,
        this.showPost= true,
        this.showInstitution= true,
        this.showCourses= true,
        this.showBatches= true

        this.state = {
            loading: false,
            updateToggle: false,
            showAll: true,
            showUser: true,
            userBackground: Colors.alternative,
            institutionBackground: Colors.alternative,
            coursesBackground: Colors.alternative,
            postsBackground: Colors.alternative,
            batchesBackground: Colors.alternative,
            showPost: true,
            showInstitution: true,
            showCourses: true,
            showBatches: true
        }
    }

    _searchTextChange = (text) => {
        console.log("search text changed")
        this.searchText = text

    }
    _onEndEditing = () => {
        console.log("on end editing")
        // this.setState({
        //     loading: true
        // })
        // Manager.search(`/api/search?query=${this.searchText}`, 'GET')
    }

    _onSubmitEditing = () => {
        console.log("on submit editing")
        this.setState({
            loading: true
        })
        Manager.search(`/api/search?query=${this.searchText}`, 'GET')
    }

    componentDidMount() {
        console.log("search component did mount")
        this.props.navigation.setParams({ backButton: this._backButtonPressed});
        Manager.addListener('SEARCH_S', this._searchSuccess)
        Manager.addListener('SEARCH_E', this._searchError)
    }

    componentWillUnmount() {
        console.log("search component will unmount")
        Manager.removeListener('SEARCH_S', this._searchSuccess)
        Manager.removeListener('SEARCH_E', this._searchError)
    }

    _searchSuccess = (data) => {
        console.log('search data : ', data)
        this.data = data.data
        this.setState({
            loading: false
        })
    }

    _searchError = (error) => {
        console.log("search error : ", error)
    }

    _backButtonPressed = () => {
        console.log("back button pressed")
        const backAction = NavigationActions.back({
            key: null,
        });
        this.props.navigation.dispatch(backAction);
    }

    _navigateBatch = (item) => {
        this.props.navigation.navigate("BatchItem", {url: item.url})
    }

    _renderBatches = () => {
        if(this.data){
            let list = this.data.filter(item => {
                const match = item.type == 'batches' ? true: false
                return match
            })

            if(list.length > 0){
                return(
                    <View>
                        <View style={{paddingLeft: 10, paddingTop: 18, paddingBottom: 8}}>
                            <Text style={styles.bodyHeader}>{I18n.t('Batches')}</Text>
                        </View>
                        <View style={styles.sectionBody}>
                        {
                            list.map(item => {
                                return(
                                    <Button key={`pelt-${Math.random(1)}`} onPress={() => this._navigateBatch(item)}>
                                        <View style={[styles.item, {alignItems: 'flex-start'}]}>
                                            <View>
                                                <Text style={[styles.itemText, {fontWeight: '600', fontSize:    16}]}>{item.title}</Text>
                                            </View>
                                        </View>
                                    </Button>
                                )
                            })
                        }
                        </View>
                    </View>
                )
            }
            return null
        }
        return null
    }

    _navigatePost = (item) => {
        this.props.navigation.navigate("OpenFeed", {item: item.searchable})
    }

    _renderPosts = () => {
        if(this.data){
            let list = this.data.filter(item => {
                const match = item.type == 'posts' ? true: false
                return match
            })

            if(list.length > 0){
                return(
                    <View>
                        <View style={{paddingLeft: 10, paddingTop: 18, paddingBottom: 8}}>
                            <Text style={styles.bodyHeader}>{I18n.t('POST')}</Text>
                        </View>
                        <View style={styles.sectionBody}>
                        {
                            list.map(item => {
                                return(
                                    <Button onPress={() => this._navigatePost(item)} key={`pelt-${Math.random(1)}`} style={[styles.item]}>
                                        <View>
                                            <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16}]}>{item.title}</Text>
                                        </View>
                                    </Button>
                                )
                            })
                        }
                        </View>
                    </View>
                )
            }
            return null
        }
        return null
    }

    _navigateUser = (item) => {
        this.props.navigation.navigate("Profile", {url: item.url})
    }

    _renderUsers = () => {
        if(this.data){
            let list = this.data.filter(item => {
                const match = item.type == 'users' ? true: false
                return match
            })

            if(list.length > 0){
                return(
                    <View>
                        <View style={{paddingLeft: 10, paddingTop: 18, paddingBottom: 8}}>
                            <Text style={styles.bodyHeader}>{I18n.t('Users')}</Text>
                        </View>
                        <View style={styles.sectionBody}>
                        {
                            list.map(item => {
                                return(
                                    <Button onPress={() => this._navigateUser(item)} key={`pelt-${Math.random(1)}`} style={[styles.item]}>
                                        <View>
                                            <Image style={styles.image}
                                                source={{uri: item.searchable.basic.profile_pic}}
                                                defaultSource={require('../resources/in_2.jpg')}
                                                resizeMode='cover'
                                                onError={(error) => console.log(error)}
                                            />
                                        </View>
                                        <View>
                                            <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16}]}>{item.title}</Text>
                                        </View>
                                    </Button>
                                )
                            })
                        }
                        </View>
                    </View>
                )
            }
            return null
        }
        return null
    }

    _navigateCourse = (item) => {
        // this.props.navigation.navigate("BatchItem", {url: item.url})
        this.props.navigation.navigate("Courses", {url: item.url})
    }

    _renderCourses = () => {
        if(this.data){
            let list = this.data.filter(item => {
                const match = item.type == 'courses' ? true: false
                return match
            })

            if(list.length > 0){
                return(
                    <View>
                        <View style={{paddingLeft: 10, paddingTop: 18, paddingBottom: 8}}>
                            <Text style={styles.bodyHeader}>{I18n.t('Courses')}</Text>
                        </View>
                        <View style={styles.sectionBody}>
                        {
                            list.map(item => {
                                return(
                                    <Button onPress={() => this._navigateCourse(item)} key={`pelt-${Math.random(1)}`} style={[styles.item]}>
                                        <View>
                                            <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16}]}>{item.title}</Text>
                                        </View>
                                    </Button>
                                )
                            })
                        }
                        </View>
                    </View>
                )
            }
            return null
        }
        return null
    }

    _navigateInstitute = (item) => {
        this.props.navigation.navigate("Institution", {item: item.searchable})
    }

    _renderInstitutions = () => {
        if(this.data){
            let list = this.data.filter(item => {
                const match = item.type == 'institutions' ? true: false
                return match
            })

            if(list.length > 0){
                return(
                    <View>
                        <View style={{paddingLeft: 10, paddingTop: 18, paddingBottom: 8}}>
                            <Text style={styles.bodyHeader}>{I18n.t('Institutions')}</Text>
                        </View>
                        <View style={styles.sectionBody}>
                        {
                            list.map(item => {
                                return(
                                    <Button onPress={() => this._navigateInstitute(item)} key={`pelt-${Math.random(1)}`} style={[styles.item]}>
                                        <View>
                                            <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16}]}>{item.title}</Text>
                                        </View>
                                    </Button>
                                )
                            })
                        }
                        </View>
                    </View>
                )
            }
            return null
        }
        return null
    }

    _renderSearchBar = () => {
        return(
            <SafeAreaView forceInset={{ top: 'always'}}>
                <View style={styles.header}>
                    <Button style={styles.drawerButton} onPress={this._backButtonPressed} >
                        <Icon name="arrow-left" size={22} color={Colors.onSurface} style={{padding:10}}/>
                    </Button>
                    <View style={styles.search}>
                        <TextInput style={styles.textInput}
                            placeholder="Search"
                            allowFontScaling={false}
                            onChangeText={this._searchTextChange}
                            onSubmitEditing={this._onSubmitEditing}
                            autoCorrect={false}
                            autoFocus={true}
                            enablesReturnKeyAutomatically={true}
                            returnKeyType='search'
                            />
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    _updateFilter = () => {
        console.log("new filter state: ")
        this.setState(previousState => ({
            updateToggle: !previousState.updateToggle
        })
    )
    }

    _renderFilters = () => {
        console.log("render filter : ", this.state)

        return(
            <View>
                <ScrollView horizontal={true}>
                    <Button onPress={() => {this.setState(previousState => ({
                        showUser: !previousState.showUser,
                        userBackground: !previousState.showUser? Colors.alternative : Colors.background
                    }))}}>
                        <View style={[{borderRadius:20, margin: 10, padding:8, borderWidth: 1, backgroundColor: this.state.userBackground}]}>
                            <Text>{I18n.t('Users')}</Text>
                        </View>
                    </Button>
                    <Button onPress={() => {this.setState(previousState => ({
                        showInstitution: !previousState.showInstitution,
                        institutionBackground: !previousState.showInstitution? Colors.alternative : Colors.background
                    }))}}>
                        <View style={[{borderRadius:20, margin: 10, padding:8, borderWidth: 1, backgroundColor: this.state.institutionBackground}]}>
                            <Text>{I18n.t('Institutions')}</Text>
                        </View>
                    </Button>
                    <Button onPress={() => {this.setState(previousState => ({
                        showBatches: !previousState.showBatches,
                        batchesBackground: !previousState.showBatches? Colors.alternative : Colors.background
                    }))}}>
                        <View style={[{borderRadius:20, margin: 10, padding:8, borderWidth: 1, backgroundColor: this.state.batchesBackground}]}>
                            <Text>{I18n.t('Batches')}</Text>
                        </View>
                    </Button>
                    <Button onPress={() => {this.setState(previousState => ({
                        showCourses: !previousState.showCourses,
                        coursesBackground: !previousState.showCourses? Colors.alternative : Colors.background
                    }))}}>
                        <View style={[{borderRadius:20, margin: 10, padding:8, borderWidth: 1, backgroundColor: this.state.coursesBackground}]}>
                            <Text>{I18n.t('Courses')}</Text>
                        </View>
                    </Button>
                    <Button onPress={() => {this.setState(previousState => ({
                        showPost: !previousState.showPost,
                        postsBackground: !previousState.showPost ? Colors.alternative : Colors.background
                    }))}}>
                        <View style={[{borderRadius:20, margin: 10, padding:8, borderWidth: 1, backgroundColor: this.state.postsBackground}]}>
                            <Text>{I18n.t('POST')}</Text>
                        </View>
                    </Button>
                    </ScrollView>
            </View>
        )
    }


    render() {
        console.log("search render")
        return(
            <View style={styles.container}>
                {this._renderSearchBar()}
                {
                    this.data ?
                    this.data.length > 0 ?
                    this._renderFilters()
                    : null
                    : null
                }
                {
                    this.state.loading ?
                    <View style={{justifyContent: "center", alignItems: "center", padding: 10}}>
                        <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryDark} />
                    </View>
                    :null
                }
                <ScrollView>
                {
                    this.data ?
                    this.data.length > 0 ?
                    <View>
                        {this.state.showUser ? this._renderUsers() : null}
                        {this.state.showInstitution ?  this._renderInstitutions() : null}
                        {this.state.showBatches ? this._renderBatches(): null}
                        {this.state.showCourses ? this._renderCourses(): null}
                        {this.state.showPost ? this._renderPosts(): null}
                    </View>
                    :
                    <View style={{
                        backgroundColor: Colors.background,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 1,
                        width: '100%',
                        paddingTop: 20
                    }}>
                        <Text style={{color: Colors.secondaryDark, fontSize: 22,fontWeight: '700', opacity: 0.4}}>No result</Text>
                    </View>
                    : null
                }
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    bodyHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.onSurface,
        opacity: 0.4
    },
    sectionBody: {
        backgroundColor: Colors.surface,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingVertical: 20,
    },
    itemText: {
        paddingLeft: 10,
        fontSize: 14,
        fontWeight: '400',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 46,
        backgroundColor: Colors.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.background

    },
    search:{
        flex: 1,
        justifyContent:'flex-start',
        alignItems: 'center',
    },
    textInput:{
        height: '100%',
        width: '100%',
        fontSize: 18,
        paddingLeft: 5,
    },
    drawerButton: {
        marginLeft: 5,
        marginRight: 10,
        borderRadius: 20
    },
    image: {
        borderRadius: 20,
        width: 40,
        height: 40,
    },
})
