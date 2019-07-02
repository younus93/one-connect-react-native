import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, FlatList, SectionList, SafeAreaView, TouchableWithoutFeedback, TextInput, Animated, Easing} from "react-native";

import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';

// test data
const profileData = require('../testData/profile.json');


export default class Profile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            saveButtonState: true,
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        Manager.addListener('PROFILE_S', this._profileSuccess)
        Manager.addListener('PROFILE_E', this._profileError)
        Manager.profile('/profile', 'POST')
    }

    componentWillUnmount() {
        Manager.removeListener('PROFILE_S', this._profileSuccess)
        Manager.removeListener('PROFILE_E', this._profileError)
    }

    _profileSuccess = (data) => {
        console.log("profile successful, data received :", data)
        this.setState({
            loading: false,
        })
    }

    _profileError = (error) => {
        console.log("profile, error received :", error)
        this.setState({
            loading: false,
            error: true
        })
    }

    _navigateToChangePassword = () => {
        this.props.navigation.navigate('ChangePassword')
    }

    _toggleSaveButtonState = () => {
        this.setState((previousState) => ({
            saveButtonState: !previousState.saveButtonState
        }));
    }

    render() {
        const {saveButtonState} = this.state
        return (
            <View style={styles.container}>
                <ScrollView alwaysBounceVertical={false} bounces={false}>
                    <ImageView callback={this._toggleSaveButtonState}/>
                    <View style={{justifyContent: 'space-between'}}>
                        <ProfileList user={profileData.user} navigate={this.props.navigation.navigate} callback={this._toggleSaveButtonState}/>
                        <Button style={styles.changePassword} onPress={this._navigateToChangePassword} title="CHANGE PASSWORD" color={Colors.alert}/>
                    </View>
                </ScrollView>
                <Button style={styles.saveButton} title="Save" color={Colors.alternative}/>
            </View>
        );
    }
}





class ImageView extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
      return (
        <View style={styles.profileImage}>
            <SafeAreaView forceInset={{ top: 'always'}}>
                <Image style={styles.image}
                    source={require('../resources/dummy_profile_2.jpg')}
                    resizeMode='cover'
                    defaultSource={require('../resources/dummy_profile.png')}
                    onError={(error) => console.log(eror)}
                />
            </SafeAreaView>
        </View>
      );
    }
}

class ProfileList extends React.Component {
    constructor(props) {
        super(props)
        let {user} = props
        let profileDetails = [{
                    title: 'User details',
                    data: [
                        {'Name':user.f_name + " " + user.family_name},
                        {'Mobile': user.phone_number},
                        {'Email': user.email},
                    ]
                },
            {
                title: 'Account',
                data: [
                    {'Privacy Settings': user.privacy_setting}
                ]
            }]

        this._borderBottomWidth = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]
        this.animatedValue = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]

        this.state = {
            user: profileDetails
        }
    }

    _onPressItem = (index, section) => {
        console.log("Pressed ", index, "th row of ", section.title, " section")
        if (section.title == "Account" && index == 0) {
            console.log("Pressed Privacy settings")
            this.props.navigate("Settings")
        }
    }

    _onFocus = (e,index, section) => {
            Animated.timing(this._borderBottomWidth[index], {
                toValue: 1,
            }).start();

            Animated.timing(this.animatedValue[index], {
                toValue: 1,
                duration: 100,
                easing: Easing.ease,
                // useNativeDriver: true,
            }).start()
    }

    _onBlur = (e, index) => {
        Animated.timing(this._borderBottomWidth[index], {
            toValue: 0,
        }).start();

        Animated.timing(this.animatedValue[index], {
            toValue: 0,
            duration: 100,
            easing: Easing.ease,
            // useNativeDriver: true,
        }).start()
    }

    _renderItem = ({item, index, section}) => {
        console.log(item, index, section)
        let key = Object.keys(item)

        if (section.title == "User details") {
            const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
            return (
                <TouchableWithoutFeedback onPress={() => this._onPressItem(index, section)}>
                    <View style={styles.item} key={`prle-${Math.random(1)}`}>
                        <Text style={styles.itemsTextLabel}>{key}</Text>
                        <AnimatedTextInput style={[styles.itemText, {transform: [
                                {
                                    scaleX: this.animatedValue[index].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 2]
                                    })
                                },
                                {
                                    scaleY: this.animatedValue[index].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 2]
                                    })
                                }
                            ], borderBottomWidth: this._borderBottomWidth[index]}]} onChangeText={(text) => this.props.callback()} defaultValue={item[key[0]]} onFocus={(e) => this._onFocus(e, index, section)} onBlur={(e) => this._onBlur(e, index)}/>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        else if (section.title == "Account") {
            return (
                <TouchableWithoutFeedback onPress={() => this._onPressItem(index, section)}>
                    <View style={styles.item} key={`prle-${Math.random(1)}`}>
                        <Text style={styles.itemsTextLabel}>{key}</Text>
                        <Text style={styles.itemText}>{item[key[0]]}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }

    _renderSection = ({section: {title}}) => {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionText}>{title}</Text>
            </View>
        )
    }

    _keyExtractor = (item, index) => `prle-${index}`;

    render() {
        let {user} = this.state
        return(
            <SectionList
                renderItem={this._renderItem}
                renderSectionHeader={this._renderSection}
                sections={user}
                keyExtractor={this._keyExtractor}
                bounces={false}
            />
        )
    }
}

class Tags extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <Text>Hell</Text>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    profileImage: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        padding: 30,
    },
    image: {
        borderRadius: 92,
        width: 180,
        height: 180,
        backfaceVisibility: 'visible',
    },
    section: {
        padding: 10,
        paddingTop: 20,
        backgroundColor: Colors.background,
        // opacity: 0.5,
    },
    sectionText: {
        fontWeight: 'bold',
        fontSize: 18,
        opacity: 0.25,
        color: Colors.onSecondary
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingVertical: 20,
        backgroundColor: Colors.surface
    },
    itemText: {
        flex:1,
        fontSize: 12,
        fontWeight: 'normal',
        color: Colors.onSurface,
        borderColor: Colors.alternative,
    },
    itemsTextLabel: {
        flex:1,
        fontSize: 14,
        fontWeight: 'bold',
        opacity: 0.7,
        color: Colors.onSurface
    },
    changePassword: {
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.alert,
        marginHorizontal: 15,
        paddingVertical: 10
    },
    saveButton: {
        marginHorizontal: 15,
        marginVertical: 0,
        marginBottom: 5
    }
});


// {
//     translateX: this.animatedValue[index].interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 50]
//     })
// },
// {
//     translateY: this.animatedValue[index].interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 25]
//     })
// },
// {
//     scaleX: this.animatedValue[index].interpolate({
//         inputRange: [0, 1],
//         outputRange: [1, 2]
//     })
// },
// {
//     scaleY: this.animatedValue[index].interpolate({
//         inputRange: [0, 1],
//         outputRange: [1, 2]
//     })
// }
