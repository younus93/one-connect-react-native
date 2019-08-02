import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, FlatList, SectionList, SafeAreaView, TouchableWithoutFeedback, TextInput, Animated, Easing, ActivityIndicator,ImageBackground, Modal, Platform, Linking} from "react-native";
import { DrawerActions } from 'react-navigation-drawer';
import { NavigationActions } from 'react-navigation';
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import I18n from '../service/i18n';


export default class Profile extends React.Component {
    static navigationOptions = ({navigation}) => {
        const accessLevel = navigation.getParam('accessLevel', 0)
        let options = {title: navigation.getParam('title'),
        headerLeftContainerStyle: {
            paddingLeft: 15
        }}
        if(accessLevel) {
            options['headerLeft'] = <View style={{flexDirection: 'row'}}>
                <Button style={{borderRadius: 20}} onPress={navigation.getParam('hamPressed')} >
                    <Icon name="bars" size={22} color={Colors.onPrimary} style={{padding:10}}/>
                </Button>
            </View>
        }
        return options
    }


    constructor(props){
        super(props)
        this.props.navigation.setParams({ title: I18n.t('Profile')});
        this.url = props.navigation.getParam('url', '/api/profile')
        this.accessLevel = props.navigation.getParam('accessLevel', 0)
        // console.log("profile url is : ", this.url, this.accessLevel, this.accessLevel==1)
        this.props.navigation.setParams({accessLevel: this.accessLevel });

        this.state = {
            updateNeeded: false,
            loading: true,
            error: false,
            errorText: null
        }
    }

    componentDidMount() {
        console.log("profile mounted")
        Manager.addListener('PROFILE_S', this._profileSuccess)
        Manager.addListener('PROFILE_E', this._profileError)
        Manager.addListener('LANG_U', this._updateLanguage)

        Manager.profile(this.url, 'GET')

        this.props.navigation.setParams({backButton: this._backButtonPressed });
        this.props.navigation.setParams({hamPressed: this._hamPressed });
    }

    componentWillUnmount() {
        console.log("profile unmouted")
        Manager.removeListener('PROFILE_S', this._profileSuccess)
        Manager.removeListener('PROFILE_E', this._profileError)
        Manager.removeListener('LANG_U', this._updateLanguage)
    }

    _updateLanguage = () => {
        this.props.navigation.setParams({ title: I18n.t('Profile')});
        this.setState(previousState => {
            updateNeeded: !previousState.updateNeeded
        })
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
        this.data = data.data
        this.setState({
            loading: false,
            error: false,
            errorText: null
        })
    }

    _profileError = (error) => {
        console.log("profile, error received :", error)
        this.setState({
            loading: false,
            error: true,
            errorText: null
        })
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
        this.props.navigation.navigate('Settings', {data: this.data, callback: this._needsUpdate})
    }

    render() {

        if(this.state.loading){
            return(
                <View style={[styles.container, {justifyContent:'center', alignItems: 'center'}]}>
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryDark} />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <ScrollView alwaysBounceVertical={false} bounces={false}>
                    <ImageView accessLevel={this.accessLevel} data={this.data}/>
                    <ProfileList accessLevel={this.accessLevel} data={this.data} navigate={this._navigateToSettings}navigation={this.props.navigation}/>
                </ScrollView>
            </View>
        );
    }
}





class ImageView extends React.Component {
    constructor(props){
        super(props);
        this.data = props.data
        this.accessLevel = props.accessLevel
        this.requestType = null

        this.state = {
            updateToggle: false,
            profilePhoto: {uri: this.data.basic.profile_pic},
            bannerPhoto: {uri: this.data.basic.banner_pic}
        }
    }

    componentDidMount() {
        Manager.addListener('F_REQUEST_S', this._requestSuccess)
        Manager.addListener('F_REQUEST_E', this._requestError)
    }

    componentWillUnmount() {
        Manager.removeListener('F_REQUEST_S', this._requestSuccess)
        Manager.removeListener('F_REQUEST_E', this._requestError)
    }

    _requestSuccess = data => {
        if(data){
            if(data.success){
                switch(this.requestType) {
                    case 'S':
                        this.data.friends_meta.has_sent_friend_request_to_this_profile = true;
                        break;
                    case 'U':
                        this.data.friends_meta.is_friends = false;
                        this.data.friends_meta.has_sent_friend_request_to_this_profile = false;
                        this.data.friends_meta.has_friend_request_from_this_profile = false;
                        Manager.emitEvent('NOTIFICATION_U')
                        break;
                    case 'A':
                        this.data.friends_meta.is_friends = true;
                        Manager.emitEvent('NOTIFICATION_U')
                        break;
                }
            }
        }
        console.log("f request success data : ", data)
        this.setState(previousState => ({
            updateToggle: !previousState.updateToggle,
        }))
    }

    _requestError = error => {
        console.log("f request error data : ", error)
        // this.setState(previousState => ({
        //     updateToggle: !previousState.updateToggle,
        //     isTagModal: false
        // }))
    }

    _sendFriendRequest = () => {
        console.log("sending friend request")
        this.requestType = 'S'
        Manager.friendRequest('/api/friend-request/send', 'POST', {professional_id: this.data.basic.id})
    }

    _unFriend = () => {
        console.log("sending unfriend request")
        this.requestType = 'U'
        Manager.friendRequest('/api/friend-request/unfriend', 'POST', {professional_id: this.data.basic.id})
    }

    _acceptRequest = () => {
        console.log("accepting request")
        this.requestType = 'A'
        Manager.friendRequest('/api/friend-request/accept', 'POST', {professional_id: this.data.basic.id})
    }

    _denyRequest = () => {
        console.log("accepting request")
        this.requestType = 'U'
        Manager.friendRequest('/api/friend-request/deny', 'POST', {professional_id: this.data.basic.id})
    }

    _renderFriendRequestControll = () => {
        if(!this.accessLevel) {
            if(!this.data.friends_meta.is_friends) {
                if(this.data.friends_meta.has_friend_request_from_this_profile) {
                    return(
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: Colors.surface, padding: 10, justifyContent: 'flex-end', alignItems: 'center'}}>

                            <View>
                                <Button style={{borderWidth: StyleSheet.hairlineWidth, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: Colors.safe, paddingHorizontal:5, marginBottom: 5}} onPress={this._acceptRequest} rippleColor={Colors.safe}>
                                    <Icon name="user-check" size={12} color={Colors.safe} />
                                    <Text style={{fontWeight: '600', fontSize: 14, color: Colors.safe}}> Accept Friend Request </Text>
                                </Button>
                                <Button style={{borderWidth: StyleSheet.hairlineWidth, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: Colors.primaryDark, paddingHorizontal:5}} onPress={this._denyRequest} rippleColor={Colors.primaryDark}>
                                    <Icon name="user-times" size={12} color={Colors.primaryDark} />
                                    <Text style={{fontWeight: '600', fontSize: 14, color: Colors.primaryDark}}> Deny Friend Request </Text>
                                </Button>
                            </View>
                        </View>
                    )
                }
                if(!this.data.friends_meta.has_sent_friend_request_to_this_profile){
                    return(
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: Colors.surface, padding: 10, justifyContent: 'flex-end', alignItems: 'center'}}>

                            <Button style={{borderWidth: StyleSheet.hairlineWidth, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: Colors.safe, paddingHorizontal:5}} onPress={this._sendFriendRequest} rippleColor={Colors.safe}>
                                <Icon name="user-plus" size={12} color={Colors.safe} />
                                <Text style={{fontWeight: '600', fontSize: 14, color: Colors.safe}}> Send Friend Request </Text>
                            </Button>
                        </View>
                    )
                }
                return(
                    <View style={{flex: 1, flexDirection: 'row', backgroundColor: Colors.surface, padding: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontWeight: '600', fontSize: 14, color: Colors.secondaryDark}}>Friend Request Sent</Text>
                    </View>
                )
            }
            return(
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: Colors.surface, padding: 10, justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Button style={{borderWidth: StyleSheet.hairlineWidth, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: Colors.secondaryDark,paddingHorizontal:5}} onPress={this._unFriend} rippleColor={Colors.secondaryDark}>
                        <Icon name="user-minus" size={12} color={Colors.secondaryDark} />
                        <Text style={{fontWeight: '600', fontSize: 14, color: Colors.secondaryDark}}> Un-Friend </Text>
                    </Button>
                </View>
            )
        }
        return null
    }

    _editPhoto = (type) => {
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

                if(type == 'profile'){
                    console.log("uploading profile pic")
                    Manager.uploadPic('/api/profile/pic', 'POST', {type: 'profile_pic', file: {
                        uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://",""),
                        type: response.type ? response.type : 'image/jpg',
                        name: response.fileName,
                    }})
                    this.setState({
                        profilePhoto: source,
                    });
                }
                else if(type == 'banner'){
                    console.log("uploading banner pic")
                    Manager.uploadPic('/api/profile/pic', 'POST', {type: 'banner_pic', file: {
                        uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://",""),
                        type: response.type ? response.type : 'image/jpg',
                        name: response.fileName,
                    }})
                    this.setState({
                        bannerPhoto: source,
                    });
                }
            }
        });
    }

    render() {
      return (
          <View>
          <ImageBackground style={styles.banner} source={this.state.bannerPhoto} blurRadius={3} imageStyle={{resizeMode: 'cover'}}>
              <SafeAreaView forceInset={{ top: 'always'}}>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      <Image style={styles.image}
                          source={this.state.profilePhoto}
                          resizeMode='cover'
                          defaultSource={require('../resources/dummy_profile.png')}
                          onError={(error) => console.log(error)}
                      />
                      {
                          this.accessLevel ?
                          <Button style={{marginLeft: -40,marginTop: -10, padding: 10, alignSelf: 'flex-start'}} onPress={() => this._editPhoto('profile')}>
                              <Icon name="pen" size={16} color={Colors.secondaryDark}/>
                          </Button>
                          :
                          null
                      }
                  </View>
                  <View style={styles.bio}>
                      <Text style={{color: Colors.alternative, fontWeight: '600', fontSize: 18}}>{this.data.basic.salutation + ' ' + this.data.basic.f_name + ' ' + this.data.basic.l_name}</Text>
                      <Text style={{paddingTop: 5,color: Colors.alternative, fontWeight: '600', fontSize: 14}}>{this.data.current_company ? this.data.current_company.designation + ' at ' + this.data.current_company.name: null}</Text>
                  </View>

              </SafeAreaView>
              {
                  this.accessLevel ?
                  <Button style={{padding: 10, alignSelf: 'flex-end'}} onPress={() => this._editPhoto('banner')}>
                      <Icon name="pen" size={16} color={Colors.secondaryDark}/>
                  </Button>
                  :
                  null
              }
          </ImageBackground>
          <View>
            {this._renderFriendRequestControll()}
          </View>
          </View>

      );
    }
}




class ProfileList extends React.Component {
    constructor(props) {
        super(props)
        this.data = props.data
        this.accessLevel = props.accessLevel
        this.newTag = null
        this.state = {
            isTagModal: false,
            updateToggle: false
        }

    }

    componentDidMount() {
        Manager.addListener('S_TAG_S', this._tagsSuccess)
        Manager.addListener('S_TAG_E', this._tagsError)
        Manager.addListener('EXPERIENCE_U', this._refresh)

    }

    componentWillUnmount() {
        Manager.removeListener('S_TAG_S', this._tagsSuccess)
        Manager.removeListener('S_TAG_E', this._tagsError)
        Manager.removeListener('EXPERIENCE_U', this._refresh)
    }

    _refresh = (data) => {
        this.data = data.data
        this.newTag = null
        this.setState({
            updateToggle: false
        })
    }

    _tagsSuccess = data => {
        console.log("tag success data : ", data)
        this.data.tags.push(data.data.pop())
        this.setState(previousState => ({
            updateToggle: !previousState.updateToggle,
            isTagModal: false
        }))
    }

    _tagsError = error => {
        console.log("tag error data : ", error)
        // this.setState(previousState => ({
        //     updateToggle: !previousState.updateToggle,
        //     isTagModal: false
        // }))
    }

    _makeCall = (number) =>  {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`
        }
        else {
            phoneNumber = `telprompt:${number}`
        }

        Linking.openURL(phoneNumber);
    }

    _renderBasicSection = (section) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let dob = new Date(section.dob.split('T')[0])
        dob = monthNames[dob.getMonth()] + ' ' + dob.getDate()
        return (
            <View>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="user" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.f_name + ' ' + section.l_name}</Text>
                </View>
                <Button key={`pelt-${Math.random(1)}`} style={styles.item} onPress={() => this._makeCall(section.phone_number)}>
                    <Icon name="phone" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.phone_number}</Text>
                </Button>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="envelope" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.email}</Text>
                </View>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="calendar-day" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{dob}</Text>
                </View>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="venus-mars" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.gender}</Text>
                </View>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="id-badge" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.bio}</Text>
                </View>
            </View>
        )
    }

    _navigateToAddCompany = () => {
        this.props.navigation.navigate('AddCompany')
    }

    _renderExperienceSection = (section) => {
        console.log("section data : ", section)
        if(section.length >= 0) {
            // {
            //     this.accessLevel ?
            //     <Button style={{padding: 10}} onPress={this.props.navigate}>
            //         <Icon name="pen" size={16} color={Colors.secondaryLight}/>
            //     </Button>
            //     :
            //     null
            // }
            return(
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10}}>
                        <Text style={styles.header}>Experience</Text>
                        {
                            this.accessLevel ?
                            <View style={styles.header}>
                            <Button style={styles.headerButton} onPress={this._navigateToAddCompany} color={Colors.alternative} title="Add Company"/>
                            </View>
                            :
                            null
                        }
                    </View>

                    <View style={styles.sectionBody}>
                    {
                        section.map(item => {
                            return(
                                <View key={`pelt-${Math.random(1)}`} style={[styles.item, {alignItems: 'flex-start'}]}>
                                    <Icon name="building" size={35} color={Colors.primaryDark} style={{backgroundColor: Colors.background, padding: 10}}/>
                                    <View>
                                        <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16}]}>{item.designation}</Text>
                                        <Text style={[styles.itemText, {paddingTop: 5}]}>{item.name}</Text>
                                        <Text style={[styles.itemText, {paddingTop: 5}]}>Since {item.started_working_at.split(' ')[0]}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                    </View>
                </View>
            )
        }
        return null
    }

    _showTagModal = () => {
        this.setState({ isTagModal: true });
    }

    _renderTagsSection = (section) => {
        console.log("section data : ", section)
        if(section.length >= 0) {
            //<Icon name="pen" size={16} color={Colors.secondaryLight}/>
            return(
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10}}>
                        <Text style={styles.header}>{I18n.t('Tags')}</Text>
                        {
                            this.accessLevel ?
                            <View style={styles.header}>
                            <Button style={styles.headerButton} onPress={this._showTagModal} color={Colors.alternative} title="Add Tag" />
                            </View>
                            :
                            null
                        }
                    </View>

                    <View style={[styles.sectionBody, {flexDirection: 'row', flexWrap: 'wrap', padding: 10}]}>
                    {
                        section.map(item => {
                            return(
                                    <View key={`pelt-${Math.random(1)}`} style={[{margin: 5, borderRadius:20, padding:8, paddingHorizontal: 12, borderWidth: 1}]}>
                                        <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16, paddingLeft: 0}]}>{item.name}</Text>
                                    </View>
                            )
                        })
                    }
                    </View>
                </View>
            )
        }
        return null
    }

    _toggleModal = () => {
        console.log('toggling modal')
        this.newTag = null
        this.setState({
            isTagModal: false
        });
    };

    _addTag = (text) => {
        console.log(text)
        this.newTag = text
    }

    _submitNewTag = () => {
        console.log("submiting tag : ", this.newTag)
        let tags = this.data.tags.map(item => {
            return item.name
        })
        tags.push(this.newTag)
        Manager.submitTag('/api/tags', 'POST', {
            "tags": tags.toString()
        });
        this.newTag = null
    }

    _navigateToPrivacy = (item) => {
        this.props.navigation.navigate('Privacy', {data: item})
    }

    _renderPrivacySetting = (section) => {
        console.log("section data : ", section)
        if(this.accessLevel) {
            return(
                <View>
                    <View style={{width: '100%', padding: 10}} />

                    <View style={[styles.sectionBody, {flexDirection: 'row', flexWrap: 'wrap'}]}>
                        <Button onPress={() => this._navigateToPrivacy(section)} style={{backgroundColor: Colors.surface, flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', padding: 15}}>
                            <Text style={[{opacity: 1, fontSize: 18, fontWeight: '600', color: Colors.onSurface,}]}>Privacy setting</Text>
                            <Icon name="chevron-right" size={22} color={Colors.secondaryDark}/>
                        </Button>
                    </View>
                </View>
            )
        }
        return null
    }

    render() {
        return(
            <View>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.header}>{I18n.t('Profile_Information')}</Text>
                        {
                            this.accessLevel ?
                            <Button style={{padding: 10}} onPress={this.props.navigate}>
                                <Icon name="pen" size={16} color={Colors.secondaryDark}/>
                            </Button>
                            :
                            null
                        }
                    </View>
                    <View style={styles.sectionBody}>
                        {this._renderBasicSection(this.data.basic)}
                    </View>
                </View>
                {this._renderExperienceSection(this.data.companies)}
                {this._renderTagsSection(this.data.tags)}
                {this._renderPrivacySetting(this.data.privacy)}
                <View style={{width: '100%', padding: 10}} />
                <View>
                    <Modal animationType="fade" transparent={true} visible={this.state.isTagModal} onRequestClose={this._toggleModal}>
                        <TouchableWithoutFeedback onPress={this._toggleModal} >
                            <View style={{flex: 1, backgroundColor: '#00000070', justifyContent: 'center', alignItems:'center', color: '#FFFFFF', paddingHorizontal: 20}}>
                                <View style={{backgroundColor: Colors.surface, width: '100%', padding: 20, borderRadius: 20}}>
                                    <TextInput style={styles.textInput}
                                        placeholder="Add new tag"
                                        onChangeText={this._addTag}
                                        allowFontScaling={false}

                                    />
                                    <Button style={styles.button} title="SUBMIT" color={Colors.alternative} onPress={this._submitNewTag}>
                                    </Button>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            </View>
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
    },
    header: {
        paddingLeft: 10,
        paddingTop: 18,
        paddingBottom: 8,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.onSurface,
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
