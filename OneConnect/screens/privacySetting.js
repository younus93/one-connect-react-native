import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, FlatList, SectionList, SafeAreaView, TouchableWithoutFeedback, TextInput, Animated, Easing, ActivityIndicator,ImageBackground, Modal, Platform, Switch} from "react-native";
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ErrorHandler from '../custom/errorHandler';
import I18n from '../service/i18n';

export default class Privacy extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('title'),
    })

    constructor(props){
        super(props)
        this.props.navigation.setParams({ title: I18n.t('Privacy')});
        this.settingChanges = {}
        this.opacity = new Animated.Value(0)

        this.data = props.navigation.getParam('data', null)
        console.log("privacy data : ", this.data)
        this.settingItems = ['email', 'phone_number', 'designation', 'bio']
        this.level = ['Friends','Batches', 'Courses','Institution','Public']

        this.state = {
            data: this.data,
            loading: false,
            error: false,
            errorText: null,
        }
    }

    componentDidMount() {
        Manager.addListener('PRIVACY_S', this._privacySuccess)
        Manager.addListener('PRIVACY_E', this._privacyError)
        Manager.addListener('LANG_U', this._updateLanguage)
    }

    componentWillUnmount() {
        Manager.removeListener('PRIVACY_S', this._privacySuccess)
        Manager.removeListener('PRIVACY_E', this._privacyError)
        Manager.removeListener('LANG_U', this._updateLanguage)
    }

    _updateLanguage = () => {
        this.props.navigation.setParams({ title: I18n.t('Privacy')});
        this.setState(previousState => {
            updateToggle: !previousState.updateToggle
        })
    }

    _privacySuccess = (data) => {
        console.log("privacy successful, data received :", data)
        // this.data = data
        this.setState({
            loading: false,
            error: false,
            errorText: null
        })
    }

    _privacyError = (error) => {
        console.log("privacy, error received :", error)
        this.setState({
            loading: false,
            error: true,
            errorText: null
        })
    }

    _toggleSwitch = (newValue, item, index) => {
        console.log('switching : ', index, item, newValue)
        console.log('switching : ', this.data[item][index])
        this.data[item][index] = newValue ? 1 : 0

        this.setState({
            data: this.data
        })
    }

    _renderSetting = () => {
        const {data} = this.state
        return(
            Object.keys(this.data).map(item => {
                return(
                    <View key={`pelt-${Math.random(1)}`}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10}}>
                            <Text style={styles.header}>{item.charAt(0).toUpperCase() + item.slice(1).replace('_', " ")}</Text>
                        </View>
                        <View style={styles.sectionBody}>
                        {
                            this.data[item].map((value, index) => {
                                return(
                                    <View key={`prng-${Math.random(1)}`}>
                                        <Text style={styles.bodyTextstyle}>{this.level[index]}</Text>
                                        <Switch value={value ? true : false} onValueChange={(newValue) => this._toggleSwitch(newValue, item, index)}/>
                                    </View>
                                )
                            })
                        }
                        </View>
                    </View>
                )
            })
        )
    }

    _save = () => {
        Object.keys(this.data).forEach((item, index)=> {
            console.log("data item :", item, index, this.data[item][index])
            this.settingChanges[item] = this.data[item].join('')
        })
        console.log('save :', this.settingChanges)

        if(this.settingChanges) {
            console.log("save")
            this.setState({
                loading: true
            })

            Animated.timing(this.opacity, {
                toValue: 0.7,
                duration: 100
            }).start(() => {
                Manager.privacy('/api/profile/privacy', 'POST', this.settingChanges);
            });
        }
        else {
            console.log("Nothing to save")
            this.setState({
                error: true,
                errorText: "Nothing to save",
                modalBackground: Colors.error
            })
        }
    }

    render() {
        return(
            <ErrorHandler backgroundColor={this.state.modalBackground} error={this.state.error} errorText={this.state.errorText} callback={this._toggleError}>
                <View style={styles.container}>
                    <ScrollView>
                        {this._renderSetting()}
                        <Button onPress={this._save} style={styles.button} title={I18n.t('Save')} color={Colors.alternative}/>
                    </ScrollView>
                    {
                        this.state.loading ?
                            <Animated.View style={{position:'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '100%',
                                backgroundColor:'black',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: this.opacity
                            }}
                            >
                                <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryDark} />
                            </Animated.View>
                        : null
                    }
                </View>
            </ErrorHandler>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    banner: {
        // width: '100%',
        // aspectRatio: 2,
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 20,
        paddingBottom: 5,
    },
    image: {
        borderRadius: 92,
        width: 180,
        height: 180,
        // backfaceVisibility: 'visible',
    },
    bio: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    sectionBody: {
        backgroundColor: Colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    header: {
        paddingLeft: 10,
        paddingTop: 18,
        paddingBottom: 8,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.onSurface,
        opacity: 0.4
    },
    sectionText: {
        fontWeight: 'bold',
        fontSize: 18,
        opacity: 0.25,
        color: Colors.onSecondary
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
    itemsTextLabel: {
        flex:1,
        fontSize: 14,
        fontWeight: 'bold',
        opacity: 0.7,
        color: Colors.onSurface
    },
    edit: {
        position: 'absolute',
        right: 20,
        top: 100,
    },
    textInput:{
        backgroundColor: Colors.background,
        padding: 10,
        margin: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.alternative,
        borderRadius: 5,
    },
    button: {
        backgroundColor: Colors.secondaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 15,
        margin: 10,
    },
});
