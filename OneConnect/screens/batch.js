import React from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableWithoutFeedback, ActivityIndicator, Animated, Easing} from "react-native";
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import I18n from '../service/i18n';


export default class Batch extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('title'),
    })

    constructor(props) {
        super(props)
        this.props.navigation.setParams({ title: I18n.t('Batches')});
        this.url = props.navigation.getParam('url', '/api/batches/')
        this.state = {
            data: [],
            loading: true,
            error: false,
            errorText: null,
            updateToggle: false
        }
    }

    componentDidMount() {
        Manager.addListener('BATCH_S', this._batchSuccess)
        Manager.addListener('BATCH_E', this._batchError)
        Manager.addListener('LANG_U', this._updateLanguage)

        Manager.batch(this.url, 'GET');
    }

    componentWillUnmount() {
        Manager.removeListener('BATCH_S', this._batchSuccess)
        Manager.removeListener('BATCH_E', this._batchError)
        Manager.removeListener('LANG_U', this._updateLanguage)
    }

    _updateLanguage = () => {
        this.props.navigation.setParams({ title: I18n.t('Batches')});
        this.setState(previousState => ({
            updateToggle: !previousState.updateToggle
        }))
    }

    _batchSuccess = (data) => {
        console.log("batch data is : ", data)
        this.data = data.data
        this.setState({
            data: this.data,
            loading: false,
            error: false,
            errorText: null
        })
    }

    _batchError = (error) => {
        console.log("batch, error received :", error)
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

    _navigateBatch = (item, animatedValue) => {
        // console.log("pressed item :", item)
        // Animated.sequence([
        //     Animated.timing(animatedValue, {
        //         toValue: .95,
        //         duration: 100,
        //         easing: Easing.ease,
        //     }),
        //     Animated.timing(animatedValue, {
        //         toValue: 1,
        //         duration: 100,
        //         easing: Easing.ease,
        //     })
        // ]).start(() => {
        //     this.props.navigation.navigate("BatchItem", {item: item})
        // })
        this.props.navigation.navigate("BatchItem", {url: item.resource_url})
    }

    _renderBatchList = ({item}) => {
        let state = null
        const animatedValue = new Animated.Value(1)
        const transformation = {
            transform:[{scale: animatedValue}]
        }
        let stateColor = {}
        if(item.is_active) {
            state = 'Active'
            stateColor = {
                color: Colors.safe,
                borderColor: Colors.safe,
                textAlign: 'center'
            }
        }
        else {
            state = 'Suspended'
            stateColor = {
                color: Colors.alert,
                borderColor: Colors.alert,
                textAlign: 'center'
            }
        }
        return(
            <Button style={styles.container} onPress={() => this._navigateBatch(item, animatedValue)}>
                    <View style={styles.batch}>
                        <View stle={{flex:1, paddingRight: 5}}>
                            <Text style={styles.batchCourse}>{item.name}</Text>
                        </View>
                        <View style={[{borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: stateColor.borderColor, paddingVertical: 3, flex: 0.4}]}>
                            <Text style={[styles.batchState, stateColor]}>{state}</Text>
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
                    <Text style={{color: Colors.secondaryDark, fontSize: 22,fontWeight: '700', opacity: 0.4}}>{I18n.t('No_Posts')}</Text>
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
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryDark} />
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

    _keyExtractor = (item, index) => `nsfd-${Math.random(1)}`;

    _searchFilter = (text) => {
        if(!text){
            console.log("no txt")
            this.setState({data: this.data})
        }
        else {
            console.log("search text is :", text)
            // const {data} = this.state;
            let regex = new RegExp('^'+text, "i");
            const searchedData = this.data.filter(item => {
                const match = regex.test(item.name)
                return match
            })
            console.log("searched list : ", searchedData)
            this.setState({data: searchedData})
        }
    };


    render() {
      return (
          <FlatList
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderBatchList}
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
        paddingHorizontal: 10,
        paddingVertical: 5
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
    listStyle: {
        backgroundColor: Colors.background,
        // padding: 10,
    },
    batch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:10,
    },
    batchDate: {
        fontSize: 14,
        fontWeight: '500',
        paddingBottom: 5,
        opacity: 0.5
    },
    batchCourse: {
        fontSize: 14,
        fontWeight: '600',
    },
    batchState:{
        fontSize: 12,
        fontWeight:'600',
    }
});
