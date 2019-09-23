import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {UpdateLocale, SaveLocale} from '../service/i18n';

var EventEmitter = require('EventEmitter');
import Call from './network';

class dataManager {
    constructor() {
        this.eventEmitter = new EventEmitter()
        this.token = null;
        this.profile_pic_url = null;
        this.user = null;
        this.locale = 'th';
    }

    updateLocale = (locale) => {
        this.locale = locale
    }

    addListener = (event, target) => {
        this.eventEmitter.addListener(event, target)
    }

    removeListener = (event, target) => {
        this.eventEmitter.removeListener(event, target)
    }

    emitEvent = (eventName, data=null) => {
        this.eventEmitter.emit(eventName, data)
    }

    setToken = (token, profilePic,id, user) => {
        console.log("User sent ",user, token, profilePic, id);
        this.token = token;
        this.profilePicUrl = profilePic;
        this.user = user; 
        console.log('setToken',id)
        AsyncStorage.multiGet(['@appKey', '@locale','@id'])
        .then(res => {
            console.log('setToken inside async storage',res)
            console.log("async storage", token, profilePic, id, user);
            if(!res[0][1]){
                AsyncStorage.multiSet([['@appKey', token], ['@profilePic', profilePic],['@id',id+""]])
                .then(response => {console.log('setToken',id);console.log("token saved")})
                .catch(error => console.log("token not saved",error))
            }

            if(res[1][1]) {
                UpdateLocale(res[1][1])
            }
        })
        .catch(error => {
            console.log("storage error : ", error)
            AsyncStorage.multiSet([['@appKey', token], ['@profilePic', profilePic]])
            .then(response => console.log(" token saved z"))
            .catch(error => console.log("token not saved"))
        })
    }

    login = (uri, method, data=null) => {
        Call(uri, method, data)
        .then(response => {
            if(!response.data.login) {
                throw(Error(response.data.message))
            }
            this.eventEmitter.emit('LOGIN_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('LOGIN_E', error)
        })
    }

    newsFeeds = (uri, method, data=null) => {

        Call(uri, method, data, this.token)
        .then(response => {

            this.eventEmitter.emit('NEWS_S', response)
        })
        .catch(error => {

            this.eventEmitter.emit('NEWS_E', error)
        })
    }

    getFeedComments = (uri, method, data=null) => {

        Call(uri, method, data, this.token)
        .then(response => {

            this.eventEmitter.emit('COMMENTS_S', response)
        })
        .catch(error => {

            this.eventEmitter.emit('COMMENTS_E', error)
        })
    }

    postComments = (uri, method, data=null) => {

        Call(uri, method, data, this.token)
        .then(response => {

            this.getFeedComments(uri, 'GET')
            // this.eventEmitter.emit('NEW_COMMENTS_S', response)
        })
        .catch(error => {

            this.eventEmitter.emit('NEW_COMMENTS_E', error)
        })
    }

    deleteComments = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            console.log('deleteComment',response)
            if(response.action){
                this.eventEmitter.emit('DELETE_COMMENT_S',response)
            }
            // this.eventEmitter.emit('NEW_COMMENTS_S', response)
        })
        .catch(error => {
            console.log('deleteComment',error)
        })
    }
    
    like = (uri, method, data=null) => {

        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('LIKE_S', response)
        })
        .catch(error => {

            this.eventEmitter.emit('LIKE_E', error)
        })
    }

    profile = (uri, method, data=null) => {

        Call(uri, method, data, this.token)
        .then(response => {

            this.eventEmitter.emit('PROFILE_S', response)
        })
        .catch(error => {

            this.eventEmitter.emit('PROFILE_E', error)
        })
    }

    batch = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('BATCH_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('BATCH_E', error)
        })
    }

    batchItem = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('BATCHITEM_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('BATCHITEM_E', error)
        })
    }

    batchMates = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('MATES_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('MATES_E', error)
        })
    }

    courseItem = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('COURSEITEM_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('COURSEITEM_E', error)
        })
    }

    institution = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('INSTITUTE_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('INSTITUTE_E', error)
        })
    }

    search = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('SEARCH_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('SEARCH_E', error)
        })
    }

    notification = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('NOTIFICATION_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('NOTIFICATION_E', error)
        })
    }

    friends = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('FRIENDS_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('FRIENDS_E', error)
        })
    }

    friendRequest = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('F_REQUEST_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('F_REQUEST_E', error)
        })
    }

    submitTag = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('S_TAG_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('S_TAG_E', error)
        })
    }

    deleteTag = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('S_TAG_REMOVE_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('S_TAG_E', error)
        })
    }

    uploadPic = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('PIC_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('PIC_E', error)
        })
    }

    addCompany = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('A_COMPANY_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('A_COMPANY_E', error)
        })
    }

    removeCompany = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('D_COMPANY_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('D_COMPANY_E', error)
        })
    }

    addEducation = (uri, method, data=null) => {
        console.log("Education", this.token);
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('A_EDUCATION_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('A_EDUCATION_E', error)
        })
    }

    removeEducation = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('D_EDUCATION_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('D_EDUCATION_E', error)
        })
    }

    industryType = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('INDUSTRY_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('INDUSTRY_E', error)
        })
    }

    privacy = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('PRIVACY_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('PRIVACY_E', error)
        })
    }

    flagPost = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('POST_FLAG_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('POST_FLAG_E', error)
        })
    }

    flagComment = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('COMMENT_FLAG_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('COMMENT_FLAG_E', error)
        })
    }

    forgotPassword = (uri, method, data=null) => {
        console.log('forgotPassword',data)
        Call(uri, method, data, this.token)
        .then(response => {
            console.log("forgotPassword",response.data.action)
            if(response.data.action===true)
            this.eventEmitter.emit('FORGOT_S', response)
            else {
            console.log("forgotPassword error",response)
            this.eventEmitter.emit('FORGOT_E',response)
            }
        })
        .catch(error => {
            console.log("forgotPassword error",error)
            this.eventEmitter.emit('FORGOT_E', error)
        })
    }
}

const Manager = new dataManager()
export default Manager;
