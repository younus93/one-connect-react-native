import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, FlatList, SectionList, SafeAreaView, TouchableWithoutFeedback, TextInput, Animated, Easing, ActivityIndicator,ImageBackground, Modal, Platform} from "react-native";
import {Colors} from '../constants';
import Manager from '../service/dataManager';
import Button from '../custom/button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from "react-native-modal-datetime-picker";
import ErrorHandler from '../custom/errorHandler';

export default class AddCompany extends React.Component {
    constructor(props){
        super(props)
        this.formData = {}
        this.industryType = null

        this.state = {
            updateNeeded: false,
            loading: false,
            error: false,
            errorText: null,
            isDateTimePickerVisible: false,
            started_working_at: 'Started working at',
            ended_working_at: 'Ended working at',
            industry_type: 'Industry type',
            isIndustryTypeVisible: false,
            modalBackground: null,
        }
    }

    componentDidMount() {
        console.log("add company mounted")
        Manager.addListener('A_COMPANY_S', this._companySuccess)
        Manager.addListener('A_COMPANY_E', this._companyError)
        Manager.addListener('INDUSTRY_S', this._industrySuccess)
        Manager.addListener('INDUSTRY_E', this._industryError)

        Manager.industryType('/api/companies/industry-types', 'GET')
    }

    componentWillUnmount() {
        console.log("add company unmouted")
        Manager.removeListener('A_COMPANY_S', this._companySuccess)
        Manager.removeListener('A_COMPANY_E', this._companyError)
        Manager.removeListener('INDUSTRY_S', this._industrySuccess)
        Manager.removeListener('INDUSTRY_E', this._industryError)
    }

    _toggleError = (state=null) => {
        console.log('toggling error')
        this.setState(previousState => ({
            error: state ? state: !previousState.error,
            errorText: null,
            modalBackground: null
        }))
    }

    _companySuccess = data => {
        console.log("add company success : ", data)
        this.setState({
            loading: false,
            error: true,
            errorText: "Company added successfully",
            modalBackground: Colors.safeDark
        })
        Manager.emitEvent('EXPERIENCE_U', data)
    }

    _companyError = error => {
        console.log("add company error : ", error)
        this.setState({
            loading: false,
            error: true,
            errorText: "Sorry, company could not be added",
            modalBackground: Colors.error
        })
    }
    _industrySuccess = data => {
        console.log("industry success : ", data)
        this.industryType = data.types
    }

    _industryError = error => {
        console.log("industry success : ", error)
    }


    _storeInfo = (text, type) => {
        console.log('type : ', type)
        switch(type) {
            case 'name':
                this.formData['name'] = text;
                break;
            case 'industry_type':
                this.formData['industry_type'] = text;
                break;
            case 'address':
                this.formData['address'] = text;
                break;
            case 'country':
                this.formData['country'] = text;
                break;
            case 'phone_number':
                this.formData['phone_number'] = text;
                break;
            case 'email':
                this.formData['email'] = text;
                break;
            case 'website':
                this.formData['website'] = text;
                break;
            case 'bio':
                this.formData['bio'] = text;
                break;
            case 'designation':
                this.formData['designation'] = text;
                break;
            case 'started_working_at':
                this.formData['started_working_at'] = text;
                break;
            case 'ended_working_at':
                this.formData['ended_working_at'] = text;
                break;

        }
    }

    _hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    _handleDatePicked = date => {
        console.log("A date has been picked: ", date, this.datePickerFor);
        let d = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
        this.setState(previousState => {
            let newState = {
                isDateTimePickerVisible: false,
            }
            newState[this.datePickerFor] = d
            return newState
        })
        this._storeInfo(d, this.datePickerFor)
    };

    _showDateTimePicker = (type) => {
        this.datePickerFor = type
        this.setState({ isDateTimePickerVisible: true });
    }

    _showIndustryType = () => {
        this.setState({ isIndustryTypeVisible: true });
    }

    _renderForm = () =>{
        return(
            <View>
                <TextInput style={styles.textInput}
                    placeholder="Name"
                    onChangeText={(text) => this._storeInfo(text, 'name')}
                    allowFontScaling={false}
                    returnKeyType='next'
                    textContentType='name'

                />
                <TouchableWithoutFeedback onPress={this._showIndustryType} >
                    <View style={styles.textInput}>
                        <Text style={styles.itemText}>{this.state.industry_type}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TextInput style={styles.textInput}
                    placeholder="Address"
                    onChangeText={(text) => this._storeInfo(text, 'address')}
                    allowFontScaling={false}
                    returnKeyType='next'
                    textContentType='streetAddressLine1'

                />
                <TextInput style={styles.textInput}
                    placeholder="Country"
                    onChangeText={(text) => this._storeInfo(text, 'country')}
                    allowFontScaling={false}
                    returnKeyType='next'
                    textContentType='countryName'
                />
                <TextInput style={styles.textInput}
                    placeholder="Phone number"
                    onChangeText={(text) => this._storeInfo(text, 'phone_number')}
                    allowFontScaling={false}
                    returnKeyType='next'
                    textContentType='telephoneNumber'
                    keyboardType='number-pad'

                />
                <TextInput style={styles.textInput}
                    placeholder="Email"
                    onChangeText={(text) => this._storeInfo(text, 'email')}
                    allowFontScaling={false}
                    returnKeyType='next'
                    textContentType='emailAddress'
                    keyboardType='email-address'
                />
                <TextInput style={styles.textInput}
                    placeholder="Website"
                    onChangeText={(text) => this._storeInfo(text, 'website')}
                    allowFontScaling={false}
                    returnKeyType='next'
                    textContentType='none'

                />
                <TextInput style={styles.textInput}
                    placeholder="Bio"
                    onChangeText={(text) => this._storeInfo(text, 'bio')}
                    allowFontScaling={false}
                    returnKeyType='next'
                    textContentType='none'
                    multiline={true}
                />
                <TextInput style={styles.textInput}
                    placeholder="Designation"
                    onChangeText={(text) => this._storeInfo(text, 'designation')}
                    allowFontScaling={false}
                    returnKeyType='done'
                    textContentType='jobTitle'

                />
                <TouchableWithoutFeedback onPress={() => this._showDateTimePicker('started_working_at')} >
                    <View style={styles.textInput}>
                        <Text style={styles.itemText}>{this.state.started_working_at}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this._showDateTimePicker('ended_working_at')} >
                    <View style={styles.textInput}>
                        <Text style={styles.itemText}>{this.state.ended_working_at}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    _submit = () => {
        console.log('submitting : ', this.formData)
        if(this.formData['name'] && this.formData['designation']) {
            this.setState({
                loading: true
            })
            Manager.addCompany('/api/companies', 'POST', this.formData)
        }
        else {
            console.log("Please fill all the inputs")
            this.setState({
                error: true,
                errorText: "Nothing to add",
                modalBackground: Colors.error
            })
        }
    }

    _toggleModal = () => {
        this.setState({
            isIndustryTypeVisible: false
        });
    };

    _handleIndustryType = industry => {
        console.log("An industry has been picked: ", industry);
        this.setState({
            isIndustryTypeVisible: false,
            industry_type: industry
        })
        this._storeInfo(industry, 'industry_type')

    };

    render() {
        return(
            <ErrorHandler backgroundColor={this.state.modalBackground} error={this.state.error} errorText={this.state.errorText} callback={this._toggleError}>
            <ScrollView style={styles.container}>
                {this._renderForm()}
                <View style={{margin: 10, marginTop: 20, marginBottom: 40}}>
                    <Button onPress={()=>{this._submit()}} style={styles.button} title="SUBMIT" color={Colors.alternative}>
                    </Button>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <View>
                    <Modal animationType="slide" visible={this.state.isIndustryTypeVisible} onRequestClose={this._toggleModal}>
                        <IndustryModal data={this.industryType} callback={this._handleIndustryType}/>

                    </Modal>
                </View>
                {
                    this.state.loading ?
                        <View style={{position:'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '100%',
                            backgroundColor:'black',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: 0.7
                        }}
                        >
                            <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryDark} />
                        </View>
                    : null
                }
            </ScrollView>
            </ErrorHandler>
        )
    }

}

class IndustryModal extends React.Component {
    constructor(props) {
        super(props)
        this.data = props.data
        this.state = {
            data: this.data
        }

    }

    _keyExtractor = (item, index) => `nsfd-${Math.random(1)}`;

    _searchFilter = (text) => {
        if(!text){
            console.log("no txt")
            this.setState({data: this.data})
        }
        else {
            console.log("search text is :", text)
            let regex = new RegExp('^'+text, "i");
            const searchedData = this.data.filter(item => {
                const match = regex.test(item)
                return match
            })
            console.log("searched list : ", searchedData)
            this.setState({data: searchedData})
        }
    };

    _listHeader = () => {
        return(
            <View style={styles.search}>
                <TextInput style={styles.searchText} placeholder="Search list" onChangeText={this._searchFilter}/>
            </View>
        )
    }

    _itemSeparator = (props) => {
        return(
            <View style={{backgroundColor:Colors.background, marginVertical: 5}} />
        )
    }

    _renderEmptyList = () => {
        const {loading} = this.state
        if(!loading){
            return(
                <View style={{
                    backgroundColor: Colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 1,
                    height: '100%',
                    width: '100%',
                }}>
                    <Text style={{color: Colors.secondaryDark, fontSize: 22,fontWeight: '700', opacity: 0.4}}>Data not available.</Text>
                </View>
            )
        }
        return null
    }

    _listFooter = () => {
        const {loading} = this.state
        if(!loading) {
            return(
                <View style={{backgroundColor:Colors.background, marginVertical: 5, padding: 10, justifyContent:"center", alignItems: "center"}}><Text style={{color: Colors.secondaryDark, fontWeight: '500', opacity: 0.4}}>End of list.</Text></View>
            )
        }
        else {
            return(
                <View style={{backgroundColor:Colors.background, marginVertical: 5, padding: 10, justifyContent:"center", alignItems: "center"}}>
                    <ActivityIndicator animating={this.state.loading} size="large" color={Colors.secondaryDark} />
                </View>
            )
        }
    }

    _select = (industry) => {
        this.props.callback(industry)
    }

    _renderIndustryList = ({item}) => {
        return(
            <TouchableWithoutFeedback onPress={() => this._select(item)} >
                <View style={styles.industryItem}>
                    <Text style={styles.industryText}>{item}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return(
            <FlatList
              data={this.state.data}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderIndustryList}
              ItemSeparatorComponent={this._itemSeparator}
              ListEmptyComponent={this._renderEmptyList}
              ListFooterComponent={this._listFooter}
              ListHeaderComponent={this._listHeader}
              style={styles.listStyle}
          />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    button: {
        backgroundColor: Colors.secondaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 15,
    },
    itemText:{
        fontSize: 12,
        opacity: 0.7
    },
    listStyle: {
        backgroundColor: Colors.background,
    },
    industryItem: {
        // flex: 1,
        backgroundColor: Colors.surface,
        padding: 20,
    },
    search: {
        height: 44,
        margin: 10,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    searchText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '400',
        paddingLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    industryText: {
        fontSize: 14,
        fontWeight: '600',

    }
})
