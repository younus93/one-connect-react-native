import React from 'react';
import { Text, View, StyleSheet, Image, ImageBackground, Switch } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../constants';
import Button from '../custom/button';
import Manager from '../service/dataManager';
import I18n, { SaveLocale } from '../service/i18n';
import Privacy from "../screens/privacySetting";
export default class CustomDrawerContentComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            switchValue: I18n.locale == 'en' ? true : false
        }
    }
    navigateToScreen = (route, props = null) => () => {
        console.log("Navigating to ", route);
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params: props
        });
        console.log(navigateAction);
        this.props.navigation.dispatch(navigateAction);
    }

    _signOut = () => {
        AsyncStorage.removeItem('@appKey')
            .then(response => {
                console.log("token successfully removed")
                this.props.navigation.navigate('Login')
                //TODO: log out
            })
            .catch(error => {
                console.log("error logging out")
                //TODO: show error
            })
    }

    _toggleSwitch = (newValue) => {
        this.setState(previousState => ({
            switchValue: newValue
        }))

        newValue ? SaveLocale('th') : SaveLocale('en')
    }

    render() {
        const iconSize = 18
        console.log(Manager);
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ justifyContent : 'center', width : 'auto' }}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: Manager.profilePicUrl
                            }}
                            // defaultSource={require("../resources/dummy_profile.png")}
                            resizeMode="cover"
                            onError={error => console.log(error)}
                        />
                        <Button onPress={this.navigateToScreen('Profile', { accessLevel: 1 })}>
                            <View style={{flexDirection: 'row',
                                marginLeft : '18%',
                                padding: 20,
                                alignItems: 'center',}}>
                                <View style={styles.textBody}>
                                    <Text style={styles.bodyTextstyle}>View Profile</Text>
                                </View>
                            </View>
                        </Button> 
                    </View>
                </View>
                <View style={styles.body}>
                
                    <Button onPress={this.navigateToScreen('NewsFeed')}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="rss-square" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>{I18n.t('Newsfeed')}</Text>
                            </View>
                        </View>
                    </Button>

                    <Button onPress={this.navigateToScreen('Friends')}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="user-friends" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>{I18n.t('Friends')}</Text>
                            </View>
                        </View>
                    </Button>

                    <Button onPress={this.navigateToScreen('Batch')}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="th-list" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>{I18n.t('Batches')}</Text>
                            </View>
                        </View>
                    </Button>

                    <Button onPress={this.navigateToScreen('Notification')}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="bell" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>{I18n.t('Notifications')}</Text>
                            </View>
                        </View>
                    </Button>

                    <Button onPress={this.navigateToScreen('ChangePassword')}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="key" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>{I18n.t('Change_Password')}</Text>
                            </View>
                        </View>
                    </Button>

                    {/* <Button onPress={this.navigateToScreen('Privacy')}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="user-secret" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>{I18n.t('Privacy')}</Text>
                            </View>
                        </View>
                    </Button> */}

                    <View style={styles.item}>
                        <View>
                            <Text style={styles.bodyTextstyle}>En</Text>
                        </View>
                        <View>
                            <Switch value={this.state.switchValue} onValueChange={this._toggleSwitch} trackColor={{ false: 'orange' }} />
                        </View>
                        <View>
                            <Text style={styles.bodyTextstyle}>Th</Text>
                        </View>
                    </View>

                </View>

                <Button style={styles.footer} onPress={this.navigateToScreen('AuthLoading', { action: 'logout' })}>
                    <View>
                        <SafeAreaView forceInset={{ bottom: 'always' }}>
                            <Text style={styles.signOut}>{I18n.t('Signout')}</Text>
                        </SafeAreaView>
                    </View>
                </Button>

            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface
    },
    image: {
        borderRadius: 50,
        marginLeft : '30%',
        width: 100,
        height: 100
    },
    header: {
        backgroundColor: Colors.primary,
        opacity: 0.8,
        paddingTop: 40,
        height: '30%',
        justifyContent : 'center'
    },
    body: {
        // marginVertical: 20
        flex: 1
    },
    item: {
        flexDirection: 'row',
        // paddingLeft: 15,
        padding: 20,
        alignItems: 'center',
    },
    textBody: {
        flex: 1,
        marginLeft: 20,
    },
    icon: {
        width: 25,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyTextstyle: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        backgroundColor: Colors.primary,
        // marginTop: 'auto',
        padding: 15
    },
    signOut: {
        textAlign: 'center',
        fontWeight: '700',
        //paddingTop: 10,
        fontSize: 20,
        color: Colors.onPrimary
    },
    itemText: {
        paddingLeft: 10,
        fontSize: 14,
        fontWeight: "400"
    },
});
