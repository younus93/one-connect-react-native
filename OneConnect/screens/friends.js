import React from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableWithoutFeedback, ActivityIndicator, Animated, Easing, Image} from "react-native";
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';


export default class Friends extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'FRIENDS',
    })
    constructor(props) {
        super(props)
        this.url = props.navigation.getParam('url', '/api/friends')
        this.data = null
        this.state = {
            loading: true,
            error: false,
            errorText: null
        }
    }

    componentDidMount() {
        Manager.addListener('FRIENDS_S', this._friendSuccess)
        Manager.addListener('FRIENDS_E', this._friendError)

        Manager.friends(this.url, 'GET');
    }

    componentWillUnmount() {
        Manager.removeListener('FRIENDS_S', this._friendSuccess)
        Manager.removeListener('FRIENDS_E', this._friendError)
    }

    _friendSuccess = (data) => {
        console.log("friend data is : ", data)
        this.data = data.data.friends
        this.setState({
            loading: false,
            error: false,
            errorText: null
        })
    }

    _friendError = (error) => {
        console.log("friend, error received :", error)
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

    _navigateMate = (item) => {
        console.log("pressed item :", item)
        this.props.navigation.navigate("Profile", {url: item.resource_url})
    }

    _renderMateList = ({item}) => {
        return(
            <Button onPress={() => this._navigateMate(item)} style={styles.container}>
                    <View style={styles.mate}>
                        <View>
                            <Image style={styles.image}
                                source={{uri: item.profile_pic}}
                                resizeMode='cover'
                                onError={(error) => console.log(error)}
                            />
                        </View>
                        <View>
                            <Text style={styles.name}>{item.f_name + ' ' + item.l_name}</Text>
                        </View>
                    </View>
            </Button>
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
                <View style={{backgroundColor:Colors.background, marginVertical: 5, padding: 10, justifyContent:"center", alignItems: "center"}}><Text style={{color: Colors.secondaryDark, fontWeight: '500', opacity: 0.4}}>End of list.</Text></View>
            )
        }
        else {
            return(
                <View style={{backgroundColor:Colors.background, marginVertical: 5, padding: 10, justifyContent:"center", alignItems: "center"}}>
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryLight} />
                </View>
            )
        }
    }

    _listHeader = () => {
        return(
            <View style={styles.search}>
                <TextInput style={styles.searchText} placeholder="Search list" onChangeText={this._searchFilter}/>
            </View>
        )
    }

    _itemSeparator = (props) => {
        return(
            <View style={{backgroundColor:Colors.background, marginVertical: 5}} />
        )
    }

    _keyExtractor = (item, index) => `bhms-${Math.random(1)}`;

    _searchFilter = (text) => {
        if(!text){
            console.log("no txt")
            this.setState({data: this.data})
        }
        else {
            console.log("search text is :", text)
            // const {data} = this.data;
            let regex = new RegExp('^'+text, "i");
            const searchedData = this.data.filter(item => {
                const match = regex.test(item[0].f_name) || regex.test(item[0].l_name)
                return match
            })
            console.log("searched list : ", searchedData)
            this.setState({data: searchedData})
        }
    };


    render() {
      return (
          <FlatList
            data={this.data}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderMateList}
            ItemSeparatorComponent={this._itemSeparator}
            ListEmptyComponent={this._renderEmptyList}
            ListFooterComponent={this._listFooter}
            ListHeaderComponent={this._listHeader}
            style={styles.listStyle}
        />
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    search: {
        height: 44,
        margin: 10,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    searchText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '400',
        paddingLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paddingHorizontal10: {
        paddingHorizontal: 10
    },
    paddingVertical20: {
        paddingVertical: 20
    },
    listStyle: {
        backgroundColor: Colors.background,
    },
    mate: {
        flexDirection: 'row',
        alignItems: 'center',
        padding:10,
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        paddingLeft: 10,
    },
    batchCourse: {
        fontSize: 14,
        fontWeight: '600',
    },
    batchState:{
        fontSize: 12,
        fontWeight:'600',
    },
    image: {
        borderRadius: 20,
        width: 40,
        height: 40,
    },
});
