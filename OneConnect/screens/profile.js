import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, FlatList, SectionList, SafeAreaView, TouchableWithoutFeedback, TextInput, Animated, Easing, ActivityIndicator,ImageBackground, Modal} from "react-native";
import { DrawerActions } from 'react-navigation-drawer';
import { NavigationActions } from 'react-navigation';
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Icon from 'react-native-vector-icons/FontAwesome5';


export default class Profile extends React.Component {
    static navigationOptions = ({navigation}) => {
        const accessLevel = navigation.getParam('accessLevel', 0)
        let options = {title: 'PROFILE'}
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

        Manager.profile(this.url, 'GET')

        this.props.navigation.setParams({backButton: this._backButtonPressed });
        this.props.navigation.setParams({hamPressed: this._hamPressed });
    }

    componentWillUnmount() {
        console.log("profile unmouted")
        Manager.removeListener('PROFILE_S', this._profileSuccess)
        Manager.removeListener('PROFILE_E', this._profileError)
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
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryLight} />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <ScrollView alwaysBounceVertical={false} bounces={false}>
                    <ImageView data={this.data}/>
                    <ProfileList accessLevel={this.accessLevel} data={this.data} navigate={this._navigateToSettings}/>
                </ScrollView>
            </View>
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
          <ImageBackground style={styles.banner} source={{uri: this.data.basic.banner_pic}} blurRadius={3} imageStyle={{resizeMode: 'cover'}}>
              <SafeAreaView forceInset={{ top: 'always'}}>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image style={styles.image}
                          source={{uri: this.data.basic.profile_pic}}
                          resizeMode='cover'
                          defaultSource={require('../resources/dummy_profile.png')}
                          onError={(error) => console.log(error)}
                      />
                  </View>
                  <View style={styles.bio}>
                      <Text style={{color: Colors.onPrimary, fontWeight: '600', fontSize: 18}}>{this.data.basic.salutation + ' ' + this.data.basic.f_name + ' ' + this.data.basic.l_name}</Text>
                      <Text style={{paddingTop: 5,color: Colors.onPrimary, fontWeight: '600', fontSize: 14}}>{this.data.current_company ? this.data.current_company.designation + ' at ' + this.data.current_company.name: null}</Text>
                  </View>
              </SafeAreaView>
          </ImageBackground>

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
    }

    componentWillUnmount() {
        Manager.removeListener('S_TAG_S', this._tagsSuccess)
        Manager.removeListener('S_TAG_E', this._tagsError)
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

    _renderBasicSection = (section) => {
        return (
            <View>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="user" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.f_name + ' ' + section.l_name}</Text>
                </View>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="phone" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.phone_number}</Text>
                </View>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="envelope" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.email}</Text>
                </View>
                <View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="calendar-day" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.dob.split('T')[0]}</Text>
                </View><View key={`pelt-${Math.random(1)}`} style={styles.item}>
                    <Icon name="venus-mars" size={18} color={Colors.primaryDark} />
                    <Text style={styles.itemText}>{section.gender}</Text>
                </View>
            </View>
        )
    }

    _renderExperienceSection = (section) => {
        console.log("section data : ", section)
        if(section.length > 0) {
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
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.header}>Experience</Text>
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
        if(section.length > 0) {
            //<Icon name="pen" size={16} color={Colors.secondaryLight}/>
            return(
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10}}>
                        <Text style={styles.header}>Tags</Text>
                        {
                            this.accessLevel ?
                            <View style={styles.header}>
                            <Button style={{borderWidth: StyleSheet.hairlineWidth, borderRadius: 5, justifyContent: 'center', alignItems: 'center'}} onPress={this._showTagModal}>
                                <Text style={{fontSize: 16,fontWeight: '600'}}> Add Tag </Text>
                            </Button>
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
                                    <View>
                                        <Text style={[styles.itemText, {fontWeight: '600', fontSize: 16}]}>{item.name}</Text>
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

    render() {
        return(
            <View>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.header}>Profile Information</Text>
                        {
                            this.accessLevel ?
                            <Button style={{padding: 10}} onPress={this.props.navigate}>
                                <Icon name="pen" size={16} color={Colors.secondaryLight}/>
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
        // paddingBottom: 5,
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
        marginVertical: 10,
    },
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
