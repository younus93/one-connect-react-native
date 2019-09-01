import React from "react";
import {
    View, Text, TouchableOpacity, ScrollView, Dimensions, Image, StyleSheet,
    FlatList, SectionList, SafeAreaView, TouchableWithoutFeedback,
    TextInput, Animated, Easing, ActivityIndicator,
    ImageBackground, Modal, Platform, Linking
} from "react-native";
import TagInput from "react-native-tag-input";
import { Badge, Avatar, ListItem, Icon as RNEIcon, Button as RNButton } from "react-native-elements";
import { SwipeListView } from 'react-native-swipe-list-view';
import { DrawerActions } from 'react-navigation-drawer';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-picker';
import I18n from '../service/i18n';
import Lightbox from 'react-native-lightbox';
import { TabView, SceneMap } from 'react-native-tab-view';
import Toast from 'react-native-simple-toast';

const UUID = require('uuid');

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
        this.props.navigation.setParams({ accessLevel: this.accessLevel });

        this.state = {
            updateNeeded: false,
            isTagModal: false,
            profile: {},
            loading: true,
            error: false,
            errorText: null,
        }
    }

    componentDidMount() {
        console.log("profile mounted")
        Manager.addListener('PROFILE_S', this._profileSuccess)
        Manager.addListener('PROFILE_E', this._profileError)
        Manager.addListener('PIC_S', this._profilePicSuccess)
        Manager.addListener('LANG_U', this._updateLanguage)
        Manager.addListener('D_COMPANY_S', this._removeCompanySuccess)
        Manager.addListener('D_EDUCATION_S', this._removeEducationSuccess)
        Manager.addListener('S_TAG_S', this._tagsSuccess)
        Manager.addListener('S_TAG_REMOVE_S', this._tagsRemoveSuccess)
        Manager.addListener("F_REQUEST_S", this._friendRequestSuccess);
        Manager.profile(this.url, 'GET')
        this.props.navigation.setParams({ backButton: this._backButtonPressed });
        this.props.navigation.setParams({ hamPressed: this._hamPressed });
    }

    componentWillUnmount() {
        console.log("profile unmouted")
        Manager.removeListener('PROFILE_S', this._profileSuccess)
        Manager.removeListener('PROFILE_E', this._profileError)
        Manager.removeListener('PIC_S', this._profilePicSuccess)
        Manager.removeListener('LANG_U', this._updateLanguage)
        Manager.removeListener('D_COMPANY_S', this._removeCompanySuccess)
        Manager.removeListener('D_EDUCATION_S', this._removeEducationSuccess)
        Manager.removeListener('S_TAG_S', this._tagsSuccess)
        Manager.removeListener('S_TAG_REMOVE_S', this._tagsRemoveSuccess)
        Manager.removeListener("F_REQUEST_S", this._friendRequestSuccess);
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

    _removeCompanySuccess = (data) => {
        console.log("Remove Company Success", data);
        this.data = data.data;
        this.setState({
            loading: false,
            error: false,
            profile: data.data,
            errorText: null
        })
        console.log(this.state);
        Toast.showWithGravity("Company Sync successfull!", Toast.SHORT, Toast.TOP)
    }

    _removeEducationSuccess = (data) => {
        console.log("Remove Company Success", data);
        this.data = data.data;
        this.setState({
            loading: false,
            error: false,
            profile: data.data,
            errorText: null
        })
        console.log(this.state);
        Toast.showWithGravity("Education Detail removed!", Toast.SHORT, Toast.TOP)
    }

    _tagsSuccess = data => {
        console.log("tag success data : ", data)
        this.setState({
            // isTagModal: false,
            profile: data.data,
        })
        Toast.showWithGravity("Tags added!", Toast.SHORT, Toast.TOP)
        this._toggleModal();
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

    _makeEmail = (email) => {
        Linking.openURL('mailto:' + email);
    }

    _enlargeImage = () => {
        console.log("enlarging");
        return (
            <Lightbox underlayColor="white">
                <Image
                    style={{ flex: 1, height: 200 }}
                    resizeMode="contain"
                    source={{ uri: this.state.profile.basic.profile_pic }}
                />
            </Lightbox>
        )
    }

    _editPhoto = () => {
        console.log('editing photo')
        const options = {
            title: 'Profile photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log('setting source')
                // const source = { uri: response.uri };
                // You can also display the image using data:
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                console.log("uploading profile pic")
                Manager.uploadPic('/api/profile/pic', 'POST', {
                    type: 'profile_pic', file: {
                        uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://", ""),
                        type: response.type ? response.type : 'image/jpg',
                        name: response.fileName,
                    }
                })
            }
        });
    }

    _needsUpdate = () => {
        console.log("profile needs update")
        this.setState({
            loading: true,
            error: false,
            errorText: null
        })
    }

    _navigateToSettings = () => {
        console.log("navigateing to settings")
        this.props.navigation.navigate('Settings', { data: this.state.profile, callback: this._needsUpdate })
    }

    _profilePicSuccess = (data) => {
        console.log("Profile pic is success", data);
        this.setState({
            profile: data.data
        });
    }

    _getDOB(value) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let dob = "";
        if (value) {
            dob = new Date(value.split('T')[0])
            dob = monthNames[dob.getMonth()] + ' ' + dob.getDate()
        }
        return dob; Î
    }

    _navigateToAddCompany = () => {
        this.props.navigation.navigate('AddCompany')
    }

    _navigateToEducation = () => {
        this.props.navigation.navigate('AddEducation')
    }


    _removeCompany = (company) => {
        console.log(company);
        Manager.removeCompany("/api/companies/delete", "POST", company);
    }

    _removeEducation = (education) => {
        console.log(education);
        Manager.removeEducation(`/api/educations/${education.id}/delete`, "POST");
    }

    _addTag = (text) => {
        console.log(text)
        this.newTag = text
    }

    _submitNewTag = () => {
        console.log("submiting tag : ", this.newTag)
        let tags = this.state.profile.tags.map(item => {
            return item.name
        })
        tags.push(this.newTag.split(','))
        Manager.submitTag('/api/tags', 'POST', {
            "tags": tags.toString()
        });
        this.newTag = null
    }

    _deleteTag = (tag) => {
        console.log("Tag to be removed", tag);
        Manager.deleteTag('/api/tags/delete', 'POST', tag);
    }

    _tagsRemoveSuccess = data => {
        console.log("Tag remove success with data", data);
        this.setState({
            // isTagModal: false,
            profile: data.data,
        })
        Toast.showWithGravity("Tag Removed!", Toast.SHORT, Toast.TOP)
    }


    _toggleModal = () => {
        let state = !this.state.isTagModal;
        this.setState({
            isTagModal: state,
        });
    };

    _renderFriendMeta() {
        if (this.state.profile.editable)
            return null;
        if (this.state.profile.friends_meta.is_friends) {
            return (
                <View style={{ margin: 30, paddingHorizontal: 50 }}>
                    <RNButton titleStyle={{ color: "black" }}
                        buttonStyle={{ backgroundColor: Colors.yellowDark }}
                        title="Unfriend"
                        onPress={() => { this._unfriend(this.state.profile.basic.id) }}
                    />
                </View>
            );
        }
        if (this.state.profile.friends_meta.has_sent_friend_request_to_this_profile)
            return <View style={{ margin: 30, paddingHorizontal: 50 }}>
                <RNButton titleStyle={{ color: "black" }}
                    buttonStyle={{ backgroundColor: Colors.yellowDark }}
                    title="Unsend Request"
                    onPress={() => { this._unsend(this.state.profile.basic.id) }}
                />
            </View>
        if (this.state.profile.friends_meta.has_friend_request_from_this_profile)
            return <View style={{ margin: 10, paddingHorizontal: 50, flexDirection: 'row', justifyContent: 'center' }}>
                <RNButton titleStyle={{ color: "black" }}
                    buttonStyle={{ backgroundColor: Colors.yellowDark, width: 150 }}
                    title="Accept"
                    onPress={() => { this._accept(this.state.profile.basic.id) }}
                />
                <RNButton titleStyle={{ color: "black" }}
                    buttonStyle={{ backgroundColor: Colors.grey, marginLeft: 10, width: 150 }}
                    title="Deny"
                    onPress={() => { this._deny(this.state.profile.basic.id) }}
                />
            </View>
        return <View style={{ margin: 30, paddingHorizontal: 50 }}>
            <RNButton titleStyle={{ color: "black" }}
                buttonStyle={{ backgroundColor: Colors.yellowDark }}
                title="Send Request"
                onPress={() => { this._send(this.state.profile.basic.id) }}
            />
        </View>

    }

    _accept = id => {
        this.requestType == "A";
        Manager.friendRequest("/api/friend-request/accept", "POST", {
            professional_id: id
        });
    };

    _send = id => {
        this.requestType == "A";
        Manager.friendRequest("/api/friend-request/send", "POST", {
            professional_id: id
        });
    };


    _deny = id => {
        console.log("Deny");
        this.requestType = "D";
        Manager.friendRequest("/api/friend-request/deny", "POST", {
            professional_id: id
        });
    };

    _unfriend = id => {
        Manager.friendRequest("/api/friend-request/unfriend", "POST", {
            professional_id: id
        });
    }

    _unsend = id => {
        Manager.friendRequest("/api/friend-request/unfriend", "POST", {
            professional_id: id
        });
    }

    _friendRequestSuccess = response => {
        console.log("Friend Request from notification");
        console.log(response);
        this.setState({ ...this.state, profile: response.profile });
        console.log(this.state);
        Toast.showWithGravity(response.message, Toast.SHORT, Toast.TOP)
    }

    _renderProfile() {
        if (this.state.profile)
            return (
                <ScrollView style={{ backgroundColor: Colors.background }}>
                    <View>
                        <SafeAreaView forceInset={{ top: 'always' }} style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar
                                    size="xlarge"
                                    rounded
                                    source={{ uri: this.state.profile.basic.profile_pic }}
                                    showEditButton={this.state.profile.editable}
                                    onEditPress={this._editPhoto}
                                />
                            </View>
                            {this._renderFriendMeta()}
                            <View style={styles.container}>
                                <View style={styles.bio}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: Colors.yellowDark, fontWeight: '600', fontSize: 20 }}>
                                            {this.state.profile.basic.salutation + ' '
                                                + this.state.profile.basic.f_name + ' '
                                                + this.state.profile.basic.l_name}
                                        </Text>
                                        {
                                            this.state.profile.editable ?
                                                <Button onPress={this._navigateToSettings}>
                                                    <Icon name="edit" color={Colors.yellowDark} style={{ fontSize: 16, marginLeft: 10, marginTop: 5 }}></Icon>
                                                </Button>
                                                : null
                                        }
                                    </View>
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
                                            <Button key={`pelt-${Math.random(1)}`} style={styles.item}
                                                onPress={() => this._makeEmail(this.state.profile.basic.email)}
                                            >
                                                <Entypo name="email" size={18} color={Colors.primaryDark} />
                                                <Text style={styles.itemText}>Email : {this.state.profile.basic.email}</Text>
                                            </Button>
                                            : null
                                    }
                                    {
                                        this.state.profile.basic.website ?
                                            <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                                                <Entypo
                                                    name='network'
                                                    size={18}
                                                    color={Colors.primaryDark}
                                                />
                                                <Text style={styles.itemText}>Website : {this.state.profile.basic.website}</Text>
                                            </View>
                                            : null
                                    }
                                    {
                                        this.state.profile.basic.dob ?
                                            <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                                                <Icon name="calendar-day" size={18} color={Colors.primaryDark} />
                                                <Text style={styles.itemText}>Date of Birth : {this._getDOB(this.state.profile.basic.dob)}</Text>
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
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: Colors.yellowDark, fontWeight: '600', fontSize: 20 }}>
                                            EXPERIENCE
                                        </Text>
                                        {
                                            this.state.profile.editable ?
                                                <Button onPress={this._navigateToAddCompany}>
                                                    <Icon name="plus-circle" color={Colors.yellowDark} style={{ fontSize: 16, marginLeft: 10, marginTop: 3 }}></Icon>
                                                </Button>
                                                : null
                                        }
                                    </View>
                                </View>
                                <View style={styles.sectionBody}>
                                    {
                                        this.state.profile.companies.length > 0 ?
                                            this.state.profile.companies.map(item => {
                                                return (
                                                    <View key={`pelt-${Math.random(1)}`} style={[styles.item, { alignItems: 'flex-start' }]}>
                                                        <Icon name="building" size={35} color={Colors.primaryDark} style={{ padding: 10 }} />
                                                        <View style={{ flex: 1 }}>
                                                            {item.designation ?
                                                                <Text style={[styles.itemText, { fontWeight: '600', fontSize: 16 }]}>
                                                                    {item.designation}
                                                                </Text>
                                                                : null}
                                                            <Text style={[styles.itemText, { paddingTop: 5 }]}>
                                                                {item.name}
                                                            </Text>
                                                        </View>
                                                        {
                                                            this.state.profile.editable ?
                                                                <Button onPress={() => this._removeCompany(item)}>
                                                                    <Icon name="trash" size={18} color={Colors.primaryDark} style={{ padding: 10 }} />
                                                                </Button>
                                                                : null
                                                        }
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
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: Colors.yellowDark, fontWeight: '600', fontSize: 20 }}>
                                            EDUCATION
                                    </Text>
                                        {
                                            this.state.profile.editable ?
                                                <Button onPress={this._navigateToEducation}>
                                                    <Icon name="plus-circle" color={Colors.yellowDark} style={{ fontSize: 16, marginLeft: 10, marginTop: 3 }}></Icon>
                                                </Button>
                                                : null
                                        }
                                    </View>
                                </View>
                                <View style={styles.sectionBody}>
                                    {
                                        this.state.profile.educations.length > 0 ?
                                            this.state.profile.educations.map(item => {
                                                return (
                                                    <View key={`pelt-${Math.random(1)}`} style={[styles.item, { alignItems: 'flex-start' }]}>
                                                        <Icon name="book" size={35} color={Colors.primaryDark} style={{ padding: 10 }} />
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={[styles.itemText, { fontWeight: '600', fontSize: 16 }]}>
                                                                {item.college_name}
                                                            </Text>
                                                            <Text style={[styles.itemText, { paddingTop: 5 }]}>
                                                                {item.degree_name}
                                                            </Text>
                                                        </View>
                                                        {
                                                            this.state.profile.editable ?
                                                                <Button onPress={() => this._removeEducation(item)}>
                                                                    <Icon name="trash" size={18} color={Colors.primaryDark} style={{ padding: 10 }} />
                                                                </Button>
                                                                : null
                                                        }
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
                            <View style={styles.container}>
                                <View style={styles.bio}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: Colors.yellowDark, fontWeight: '600', fontSize: 20 }}>
                                            TAGS
                                        </Text>
                                        {
                                            this.state.profile.editable ?
                                                <Button onPress={this._toggleModal}>
                                                    <Icon name="plus-circle" color={Colors.yellowDark} style={{ fontSize: 16, marginLeft: 10, marginTop: 3 }}></Icon>
                                                </Button>
                                                : null
                                        }
                                    </View>
                                </View>
                                <View style={[styles.sectionBody, { paddingBottom: 20 }]}>
                                    <View>
                                        <Modal animationType="fade" transparent={true}
                                            visible={this.state.isTagModal}
                                            onRequestClose={this._toggleModal}>
                                            <TouchableWithoutFeedback onPress={this._toggleModal} >
                                                <View style={{ flex: 1, backgroundColor: '#00000070', justifyContent: 'center', alignItems: 'center', color: '#FFFFFF', paddingHorizontal: 20 }}>
                                                    <View style={{ backgroundColor: Colors.surface, width: '100%', padding: 20, borderRadius: 20 }}>
                                                        <Text>Enter tags separated by comma</Text>
                                                        <TextInput style={styles.textInput}
                                                            multiline
                                                            placeholder="Add new tag"
                                                            onChangeText={this._addTag}
                                                            allowFontScaling={false}
                                                        />
                                                        <Button style={styles.button} title="SUBMIT" color={Colors.alternative} onPress={this._submitNewTag}>
                                                        </Button>
                                                        <Button style={{
                                                            backgroundColor: Colors.yellowDark,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: 30,
                                                            paddingVertical: 15,
                                                            marginVertical: 10,
                                                        }} title="CLOSE" color={Colors.onPrimary} onPress={this._toggleModal}>
                                                        </Button>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </Modal>
                                    </View>
                                    {
                                        this.state.profile.tags.length > 0 ?
                                            this.state.profile.tags.map((l, i) => (
                                                <ListItem
                                                    // leftAvatar={{ source: { uri: l.avatar_url } }}
                                                    title={l.name}
                                                    rightIcon={
                                                        this.state.profile.editable ?
                                                            <Button onPress={() => this._deleteTag(l)}>
                                                                <Icon name="trash"></Icon>
                                                            </Button>
                                                            : null
                                                    }
                                                />
                                            ))
                                            :
                                            <View>
                                                <Text style={[styles.itemText, { paddingTop: 5 }]}>
                                                    Tags not updated.
                                                </Text>
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

