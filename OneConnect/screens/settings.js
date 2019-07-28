import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, FlatList, SectionList, SafeAreaView, TouchableWithoutFeedback, TextInput, Animated, Easing, ActivityIndicator, KeyboardAvoidingView} from "react-native";

import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ErrorHandler from '../custom/errorHandler';


export default class Settings extends React.Component {
    constructor(props){
        super(props)
        this.data = this.props.navigation.getParam('data', null)
        this.opacity = new Animated.Value(0)
        this.editable = null
        this.state = {
            loading: false,
            error: false,
            errorText: null,
            modalBackground: null
        }
    }

    componentDidMount() {
        console.log("setting mounted")
        Manager.addListener('PROFILE_S', this._profileSuccess)
        Manager.addListener('PROFILE_E', this._profileError)
    }

    componentWillUnmount() {
        console.log("setting unmouted")
        Manager.removeListener('PROFILE_S', this._profileSuccess)
        Manager.removeListener('PROFILE_E', this._profileError)
    }

    _profileSuccess = (data) => {
        console.log("settings successful, data received :", data)
        this.data = data.data
        this.editable = null
        this.setState({
            loading: false,
            error: true,
            errorText: "Setting saved successfully",
            modalBackground: Colors.safeDark
        })
    }

    _profileError = (error) => {
        console.log("setting, error received :", error)
        this.editable = null
        this.setState({
            loading: false,
            error: true,
            errorText: "Sorry, changes could not be saved",
            modalBackground: Colors.error
        })
    }

    _toggleError = (state=null) => {
        console.log('toggling error')
        this.setState(previousState => ({
            error: state ? state: !previousState.error,
            errorText: null,
            modalBackground: null
        }))
    }


    _navigateToChangePassword = () => {
        this.props.navigation.navigate('ChangePassword')
    }

    _editField = (updates) => {
        this.editable = updates
    }

    _save = () => {
        if(this.editable) {
            console.log("save")
            this.setState({
                loading: true
            })

            Animated.timing(this.opacity, {
                toValue: 0.7,
                duration: 100
            }).start(() => {
                Manager.profile('/api/profile', 'POST', this.editable);
                this.props.navigation.getParam('callback')()
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

    // <Button style={styles.changePassword} onPress={this._navigateToChangePassword} title="CHANGE PASSWORD" color={Colors.alert} rippleColor={Colors.alert}/>

    render() {
        return (
            <ErrorHandler backgroundColor={this.state.modalBackground} error={this.state.error} errorText={this.state.errorText} callback={this._toggleError}>
                <KeyboardAvoidingView style={{flex: 1, paddingBottom: 50}} behavior="padding">
                <View style={styles.container}>
                    <ScrollView alwaysBounceVertical={false} bounces={false}>
                        <ImageView data={this.data} callback={this._toggleSaveButtonState}/>
                        <View style={{justifyContent: 'space-between'}}>
                            <ProfileList data={this.data} navigate={this.props.navigation.navigate} callback={this._editField}/>
                        </View>
                    </ScrollView>
                    <Button onPress={this._save} style={styles.saveButton} title="Save" color={Colors.alternative}/>
                </View>
                </KeyboardAvoidingView>
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
                            <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryLight} />
                        </Animated.View>
                    : null
                }
            </ErrorHandler>
        );
    }
}





class ImageView extends React.Component {
    constructor(props){
        super(props);
        this.data = props.data
    }

    render() {
      return (
          <View style={styles.banner}>
              <SafeAreaView forceInset={{ top: 'always'}}>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image style={styles.image}
                          source={require('../resources/dummy_profile.png')}
                          resizeMode='cover'
                          defaultSource={require('../resources/dummy_profile.png')}
                          onError={(error) => console.log(eror)}
                      />
                  </View>
                  <View style={styles.bio}>
                      <Text style={{color: Colors.onPrimary, fontWeight: '600', fontSize: 18}}>{this.data.basic.salutation + ' ' + this.data.basic.f_name + ' ' + this.data.basic.l_name}</Text>
                      <Text style={{paddingTop: 5,color: Colors.onPrimary, fontWeight: '600', fontSize: 14}}>{this.data.current_company.designation + ' at ' + this.data.current_company.name}</Text>
                  </View>
              </SafeAreaView>
          </View>
      );
    }
}

class ProfileList extends React.Component {
    constructor(props) {
        super(props)
        let data = props.data

        this._borderBottomWidth = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]
        this.animatedValue = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]
        this.editable = {}
        this.state = {
            user: data
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

            // Animated.timing(this.animatedValue[index], {
            //     toValue: 1,
            //     duration: 100,
            //     easing: Easing.ease,
            //     // useNativeDriver: true,
            // }).start()
    }

    _onBlur = (e, index) => {
        Animated.timing(this._borderBottomWidth[index], {
            toValue: 0,
        }).start();

        // Animated.timing(this.animatedValue[index], {
        //     toValue: 0,
        //     duration: 100,
        //     easing: Easing.ease,
        //     // useNativeDriver: true,
        // }).start()
    }

    _editField = (field, text) => {
        switch(field) {
            case 'f_name':
                this.editable.f_name = text
                break;
            case 'l_name':
                this.editable.l_name = text
                break;
            case 'phone':
                this.editable.phone_number = text
                break;
            case 'email':
                this.editable.email = text
                break;
        }
        console.log("editable is : ", this.editable)
        this.props.callback(this.editable)
    }

    _renderBasicSection = (section) => {
        const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
        return (
            <View key={`prle-${Math.random(1)}`}>
                <TouchableWithoutFeedback onPress={() => this._onPressItem(0, section)}>
                    <View style={styles.item}>
                        <Icon name="user" size={18} color={Colors.primaryDark} />
                        <AnimatedTextInput style={[styles.itemText, {borderBottomWidth: this._borderBottomWidth[0]}]} onChangeText={(text) => this._editField('f_name', text)} defaultValue={section.f_name} value={this.editable.f_name} onFocus={(e) => this._onFocus(e, 0, section)} onBlur={(e) => this._onBlur(e, 0)}/>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => this._onPressItem(1, section)}>
                    <View style={styles.item}>
                        <Icon name="user" size={18} color={Colors.primaryDark} />
                        <AnimatedTextInput style={[styles.itemText, {borderBottomWidth: this._borderBottomWidth[1]}]} onChangeText={(text) => this._editField('l_name', text)} defaultValue={section.l_name} value={this.editable.l_name} onFocus={(e) => this._onFocus(e, 1, section)} onBlur={(e) => this._onBlur(e, 1)}/>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => this._onPressItem(2, section)}>
                    <View style={styles.item}>
                        <Icon name="phone" size={18} color={Colors.primaryDark} />
                        <AnimatedTextInput style={[styles.itemText, {borderBottomWidth: this._borderBottomWidth[2]}]} onChangeText={(text) => this._editField('phone', text)} defaultValue={section.phone_number} value={this.editable.phone_number} onFocus={(e) => this._onFocus(e, 2, section)} onBlur={(e) => this._onBlur(e, 2)}/>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => this._onPressItem(3, section)}>
                    <View style={styles.item}>
                        <Icon name="envelope" size={18} color={Colors.primaryDark} />
                        <AnimatedTextInput style={[styles.itemText, {borderBottomWidth: this._borderBottomWidth[3]}]} onChangeText={(text) => this._editField('email', text)} defaultValue={section.email} value={this.editable.email} onFocus={(e) => this._onFocus(e, 3, section)} onBlur={(e) => this._onBlur(e, 3)}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    render() {
        let {user} = this.state
        return(
            <View>
                <View>
                    <View style={{paddingLeft: 10, paddingTop: 18, paddingBottom: 8}}>
                        <Text style={styles.header}>Profile Information</Text>
                    </View>
                    <View style={styles.sectionBody}>
                        {this._renderBasicSection(user.basic)}
                    </View>
                </View>
            </View>
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
    banner: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        // padding: 30,
    },
    image: {
        borderRadius: 92,
        width: 180,
        height: 180,
        backfaceVisibility: 'visible',
    },
    bio: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    sectionBody: {
        backgroundColor: Colors.surface,
    },
    header: {
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
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '400',
    },
    itemsTextLabel: {
        flex:1,
        fontSize: 14,
        fontWeight: 'bold',
        opacity: 0.7,
        color: Colors.onSurface
    },
    changePassword: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.alert,
        marginHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10
    },
    saveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondaryDark,
        borderRadius: 30,
        paddingVertical: 15,
        marginHorizontal: 15,
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
