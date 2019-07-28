import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator,SafeAreaView, TextInput} from "react-native";
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Icon from 'react-native-vector-icons/FontAwesome5';


export default class Notification extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'NOTIFICATION',
    })

    constructor(props){
        super(props)
        this.type = ['Birthdays', "Friend requests"]
        this.data = null
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        console.log("notification component did mount")
        this.props.navigation.setParams({ backButton: this._backButtonPressed});
        Manager.addListener('NOTIFICATION_S', this._notificationSuccess)
        Manager.addListener('NOTIFICATION_E', this._notificationError)

        Manager.notification(`/api/notifications?date=2019-07-18`, 'GET')
    }

    _notificationSuccess = (data) => {
        console.log('notification data : ', data)
        this.data = data.data
        this.setState({
            loading: false
        })
    }

    _notificationError = (error) => {
        console.log("notification error : ", error)
    }

    _backButtonPressed = () => {
        console.log("back button pressed")
        const backAction = NavigationActions.back({
            key: null,
        });
        this.props.navigation.dispatch(backAction);
    }

    _renderBirthdays = (section) => {
        console.log("birthday section : ", section)
        if(section  && section.length > 0){
            console.log("data availabe")
            return(
                section.map(item => {
                    console.log("item is ", item.type)
                    if(item.type == 'batches'){
                        console.log("its a batch")
                        return(
                            <View key={`pelt-${Math.random(1)}`} style={[styles.item, {alignItems: 'flex-start'}]}>
                                <View>
                                    <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16}]}>Birthday 1</Text>
                                </View>
                            </View>
                        )
                    }
                    return null
                })
            )
        }
        return(
            <View style={{
                backgroundColor: Colors.background,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
                width: '100%',
            }}>
                <Text style={{color: Colors.secondaryDark, fontSize: 16,fontWeight: '700', opacity: 0.4}}>You don't have any friend's birthday today.</Text>
            </View>
        )
    }

    _renderBatchMessages = (section) => {
        console.log("batch messages : ", section)
        if(section && section.length > 0){
            console.log("data availabe")
            return(
                section.map(item => {
                    console.log("item is ", item.type)
                    if(item.type == 'posts'){
                        console.log("its a post")
                        return(
                            <View key={`pelt-${Math.random(1)}`} style={[styles.item, {borderBottomWidth: StyleSheet.hairlineWidth, alignItems: 'flex-start'}]}>
                                <View>
                                    <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16}]}>Message 1</Text>
                                </View>
                            </View>
                        )
                    }
                    return null
                })
            )
        }
        return(
            <View style={{
                backgroundColor: Colors.background,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
                width: '100%',
            }}>
                <Text style={{color: Colors.secondaryDark, fontSize: 16,fontWeight: '700', opacity: 0.4}}>NO new message.</Text>
            </View>
        )
    }

    render() {
        return(
            <View style={styles.container}>
                {
                    this.state.loading ?
                    <View style={{justifyContent: "center", alignItems: "center", padding: 10}}>
                        <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryLight} />
                    </View>
                    :null
                }
                <ScrollView>
                {
                    this.data ?
                    <View>
                    <View>
                        <View style={{paddingLeft: 10, paddingTop: 18, paddingBottom: 8}}>
                            <Text style={styles.bodyHeader}>Birthdays</Text>
                        </View>
                        <View style={styles.sectionBody}>
                            {this._renderBirthdays(this.data.birthdays)}
                        </View>
                    </View>

                    <View>
                        <View style={{paddingLeft: 10, paddingTop: 18, paddingBottom: 8}}>
                            <Text style={styles.bodyHeader}>Messages</Text>
                        </View>
                        <View style={styles.sectionBody}>
                            {this._renderBatchMessages(this.data.batch_messages)}
                        </View>
                    </View>
                    </View>
                    :null

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
        // flex: 1,
        flexDirection: 'row',
        // justifyContent: 'flex-start',
        alignItems: 'center',
        height: 46,
        backgroundColor: Colors.surface,
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
})
