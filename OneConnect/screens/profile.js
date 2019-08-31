import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image, StyleSheet, FlatList, SectionList, SafeAreaView, TouchableWithoutFeedback, TextInput, Animated, Easing, ActivityIndicator, ImageBackground, Modal, Platform, Linking } from "react-native";
import { DrawerActions } from 'react-navigation-drawer';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import I18n from '../service/i18n';
import Lightbox from 'react-native-lightbox';
import { TabView, SceneMap } from 'react-native-tab-view';

export default class Profile extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const accessLevel = navigation.getParam('accessLevel', 0)
        let options = {
            title: navigation.getParam('title'),
            headerLeftContainerStyle: {
                paddingLeft: 15
            }
        }
        if (accessLevel) {
            options['headerLeft'] = <View style={{ flexDirection: 'row' }}>
                <Button style={{ borderRadius: 20 }} onPress={navigation.getParam('hamPressed')} >
                    <Icon name="bars" size={22} color={Colors.onPrimary} style={{ padding: 10 }} />
                </Button>
            </View>
        }
        return options
    }

    constructor(props) {
        super(props)
        this.props.navigation.setParams({ title: I18n.t('Profile') });
        this.url = props.navigation.getParam('url', '/api/profile')
        this.accessLevel = props.navigation.getParam('accessLevel', 0)
        // console.log("profile url is : ", this.url, this.accessLevel, this.accessLevel==1)
        this.props.navigation.setParams({ accessLevel: this.accessLevel });

        this.state = {
            updateNeeded: false,
            loading: true,
            error: false,
            errorText: null,
        }
        console.log(props);
    }

    componentDidMount() {
        console.log("profile mounted")
        Manager.addListener('PROFILE_S', this._profileSuccess)
        Manager.addListener('PROFILE_E', this._profileError)
        Manager.addListener('LANG_U', this._updateLanguage)
        Manager.profile(this.url, 'GET')
        this.props.navigation.setParams({ backButton: this._backButtonPressed });
        this.props.navigation.setParams({ hamPressed: this._hamPressed });
    }

    componentWillUnmount() {
        console.log("profile unmouted")
        Manager.removeListener('PROFILE_S', this._profileSuccess)
        Manager.removeListener('PROFILE_E', this._profileError)
        Manager.removeListener('LANG_U', this._updateLanguage)
    }

    _hamPressed = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    _backButtonPressed = () => {
        console.log("back button pressed")
        const backAction = NavigationActions.back({
            key: null,
        });
        this.props.navigation.dispatch(backAction);
    }

    _profileSuccess = (data) => {
        console.log("profile successful, data received :", data)
        this.data = data.data;
        this.setState({
            loading: false,
            error: false,
            profile: data.data,
            errorText: null
        })
        console.log(this.state);
    }

    renderLightBoxImage = () => {
        return (
            <Image
                style={styles.lightBoxImage}
                resizeMode="contain"
                source={{ uri: this.state.profile.basic.profile_pic }}
            />
        );
    }

    _makeCall = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`
        }
        else {
            phoneNumber = `telprompt:${number}`
        }

        Linking.openURL(phoneNumber);
    }

    _renderProfile() {
        if (this.state.profile)
            return (
                <ScrollView style={{ backgroundColor: Colors.background }}>
                    <View>
                        <SafeAreaView forceInset={{ top: 'always' }} style={{ marginTop : 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Lightbox underlayColor="white"
                                    renderContent={this.renderLightBoxImage}
                                    style={styles.lightBox}>
                                    <Image
                                        style={styles.image}
                                        resizeMode="cover"
                                        source={{ uri: this.state.profile.basic.profile_pic }}
                                    />
                                </Lightbox>
                            </View>
                            <View style={styles.container}>
                                <View style={styles.bio}>
                                    <Text style={{ color: Colors.yellowDark, fontWeight: '600', fontSize: 20 }}>
                                        {this.state.profile.basic.salutation + ' ' + this.state.profile.basic.f_name + ' ' + this.state.profile.basic.l_name}
                                    </Text>
                                </View>
                                <View>
                                    <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                                        <Icon name="smile-wink" size={18} color={Colors.primaryDark} />
                                        <Text style={styles.itemText}>Nick Name : {this.state.profile.basic.nick_name}</Text>
                                    </View>
                                    {this.state.profile.basic.phone_number ?
                                        <Button key={`pelt-${Math.random(1)}`} style={styles.item}
                                            onPress={() => this._makeCall(this.state.profile.basic.phone_number)}
                                        >
                                            <Icon name="phone" size={18} color={Colors.primaryDark} />
                                            <Text style={styles.itemText}>Phone Number : {this.state.profile.basic.phone_number}</Text>
                                        </Button>
                                        : null
                                    }
                                    {
                                        this.state.profile.basic.email ?
                                            <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                                                <Icon name="envelope" size={18} color={Colors.primaryDark} />
                                                <Text style={styles.itemText}>Email : {this.state.profile.basic.email}</Text>
                                            </View>
                                            : null
                                    }
                                    {
                                        this.state.profile.basic.dob ?
                                            <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                                                <Icon name="calendar-day" size={18} color={Colors.primaryDark} />
                                                <Text style={styles.itemText}>Date of Birth : {this.state.profile.basic.dob}</Text>
                                            </View>
                                            : null
                                    }
                                    <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                                        <Icon name="venus-mars" size={18} color={Colors.primaryDark} />
                                        <Text style={styles.itemText}>Gender : {this.state.profile.basic.gender}</Text>
                                    </View>
                                    {
                                        this.state.profile.basic.bio ?
                                            <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                                                <Icon name="id-badge" size={18} color={Colors.primaryDark} />
                                                <Text style={styles.itemText}>About me : {this.state.profile.basic.bio}</Text>
                                            </View>
                                            : null
                                    }
                                </View>

                            </View>
                            <View style={styles.container}>
                                <View style={styles.bio}>
                                    <Text style={{ color: Colors.yellowDark, fontWeight: '600', fontSize: 20 }}>
                                        EXPERIENCE
                                    </Text>
                                </View>
                                <View style={styles.sectionBody}>
                                    {
                                        this.state.profile.companies.length > 0 ?
                                            this.state.profile.companies.map(item => {
                                                return (
                                                    <View key={`pelt-${Math.random(1)}`} style={[styles.item, { alignItems: 'flex-start' }]}>
                                                        <Icon name="building" size={35} color={Colors.primaryDark} style={{padding: 10 }} />
                                                        <View>
                                                            {item.designation ?
                                                                <Text style={[styles.itemText, { fontWeight: '600', fontSize: 16 }]}>
                                                                    {item.designation}
                                                                </Text>
                                                                : null}
                                                            <Text style={[styles.itemText, { paddingTop: 5 }]}>
                                                                {item.name}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                            :
                                            <View key={`pelt-${Math.random(1)}`} style={[styles.item, { alignItems: 'center' }]}>
                                                <View>
                                                    <Text style={[styles.itemText, { paddingTop: 5 }]}>
                                                        Experience not updated
                                                    </Text>
                                                </View>
                                            </View>
                                    }
                                </View>
                            </View>
                            <View style={styles.container}>
                                <View style={styles.bio}>
                                    <Text style={{ color: Colors.yellowDark, fontWeight: '600', fontSize: 20 }}>
                                        EDUCATION
                                    </Text>
                                </View>
                                <View style={styles.sectionBody}>
                                    {
                                        this.state.profile.educations.length > 0 ?
                                        this.state.profile.educations.map(item => {
                                            return (
                                                <View key={`pelt-${Math.random(1)}`} style={[styles.item, { alignItems: 'flex-start' }]}>
                                                    <Icon name="book" size={35} color={Colors.primaryDark} style={{ padding: 10 }} />
                                                    <View>
                                                            <Text style={[styles.itemText, { fontWeight: '600', fontSize: 16 }]}>
                                                                {item.college_name}
                                                            </Text>
                                                        <Text style={[styles.itemText, { paddingTop: 5 }]}>
                                                            {item.degree_name}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                        :
                                        <View key={`pelt-${Math.random(1)}`} style={[styles.item, { alignItems: 'center' }]}>
                                            <View>
                                                <Text style={[styles.itemText, { paddingTop: 5 }]}>
                                                    Educational details not updated
                                                </Text>
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>
                        </SafeAreaView>
                    </View>
                </ScrollView>
            );
        return <Text>Unable to locate Profile</Text>
    }

    render() {
        return (
            <View>
                {this.state.loading ?
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10
                        }}
                    >
                        <ActivityIndicator
                            animating={this.state.loading}
                            size="large"
                            color={Colors.secondaryDark}
                        />
                    </View>
                    : this._renderProfile()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderRadius: 10,
        borderTopWidth: 3,
        borderTopColor: Colors.yellowDark,
        // height : 600,
        backgroundColor: 'white',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.primaryDark
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    tabItemActive: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderBottomColor: '#fff',
        borderBottomWidth: 2
    },
    banner: {
        // width: '100%',
        // aspectRatio: 2,
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 20,
        // paddingBottom: 5,
    },
    image: {
        borderRadius: 92,
        width: 180,
        height: 180,
        backfaceVisibility: 'visible',

    },
    lightBox: {
        width: 180,
        height: 180,
        borderRadius: 92,
    },
    lightBoxImage: {
        borderRadius: 92,
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: 'center',
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

        // opacity: 0.4
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
        flex: 1,
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
    textInput: {
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
        marginVertical: 10,
    },
    headerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondaryDark,
        borderRadius: 5,
        padding: 5,
        // marginHorizontal: 15,
        // marginBottom: 5
    }
});

