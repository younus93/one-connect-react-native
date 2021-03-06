import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, SafeAreaView, ActivityIndicator, Animated} from 'react-native';
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import ErrorHandler from '../custom/errorHandler';



const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)


type Props = {};
export default class LoginScreen extends Component<Props> {
    constructor(props){
        super(props)
        this.userName = 'test@example.com'
        this.password = 'password'
        this.opacity = new Animated.Value(0)
        this.state = {
            loading: false,
            loggedIn: false,
            error: false,
            errorText: ''
        }
    }

    componentDidMount() {
        Manager.addListener('LOGIN_S', this._loginSuccess)
        Manager.addListener('LOGIN_E', this._loginError)
    }

    componentWillUnmount() {

        Manager.removeListener('LOGIN_S', this._loginSuccess)
        Manager.removeListener('LOGIN_E', this._loginError)
    }

    _toggleError = (state=null) => {
        console.log('toggling error')
        this.setState(previousState => ({
            error: state ? state: !previousState.error
        }))
    }

    _loginSuccess = (data) => {

        Manager.setToken(data.data.token)
        Animated.timing(this.opacity, {
            toValue: 0,
            duration: 10
        }).start(() => {
            this.setState({
                loading: false,
                loggedIn: true,
            })

            this.props.navigation.navigate('Drawer')
        });
    }

    _loginError = (error) => {
        this.setState({
            loading: false,
            error: true,
            errorText: error.message
        })
    }

    _userNameChange = (text) => {
        this.userName = text

    }

    _passwordChange = (text) => {
        this.password = text

    }

    _loginButton = () => {
        if (this.userName  && this.password) {
            this.setState({
                loading: true,
                error: false
            })

            Animated.timing(this.opacity, {
                toValue: 0.7,
                duration: 100
            }).start(() => {
                Manager.login('/api/login', 'POST', {
                    'email': this.userName,
                    'password': this.password
                });
            });
        }
        else {
            if(!this.state.error){
                console.log("empty")
                let e  = new Error('Username/password field empty')
                this._loginError(e)
            }
        }
    }



  render() {
    return (
        <ErrorHandler error={this.state.error} errorText={this.state.errorText} callback={this._toggleError}>
            <DismissKeyboard>
                <View style={[styles.container]}>
                    <View style={styles.header}>
                        <SafeAreaView forceInset={{ top: 'always'}}>
                            <Text style={[styles.headerText, {fontSize: 14}]}>Welcome to</Text>
                            <Text style={styles.headerText}>OneConnect</Text>
                        </SafeAreaView>
                    </View>
                    <View style={[styles.containerBox, styles.shadow]}>
                        <View>
                            <TextInput style={styles.textInput}
                                placeholder="Email*"
                                onChangeText={this._userNameChange}
                                allowFontScaling={false}

                            />
                            <TextInput style={styles.textInput}
                                placeholder="Password*"
                                onChangeText={this._passwordChange}
                                allowFontScaling={false}
                                secureTextEntry
                            />
                        </View>

                        <View style={{margin: 10, marginTop: 50}}>
                            <Text style={styles.textTerm}>By proceeding you agree to the Terms of Services and Privacy Policy</Text>
                            <Button onPress={this._loginButton} title="LOGIN" color={Colors.alternative}/>
                        </View>
                    </View>
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
                </View>
            </DismissKeyboard>
      </ErrorHandler>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    containerBox: {
        padding: 10,
        paddingTop: 50,
        backgroundColor: Colors.surface,
    },
    textInput:{
        backgroundColor: Colors.background,
        padding: 10,
        margin: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.alternative,
        borderRadius: 5,
    },
    textTerm: {
        fontSize: 10,
        alignSelf: 'center',
        paddingBottom: 5,
        color: Colors.onSurface,
        marginTop: 20
    },
    header: {
        backgroundColor: Colors.primary,
        opacity: 0.8,
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
