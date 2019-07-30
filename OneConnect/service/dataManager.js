import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

var EventEmitter = require('EventEmitter');
import Call from './network';

class dataManager {
    constructor() {
        this.eventEmitter = new EventEmitter()
        this.token = null;
        this.profile_pic_url = null;
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

    setToken = (token, profilePic) => {
        this.token = token;
        this.profilePicUrl = profilePic
        AsyncStorage.getItem('@appKey')
        .then(res => {
            if(!res){
                AsyncStorage.multiSet([['@appKey', token], ['@profilePic', profilePic]])
                .then(response => console.log("token saved"))
                .catch(error => console.log("token not saved"))
            }
        })
        .catch(error => {
            console.log("storage error : ", error)
            AsyncStorage.setItem([['@appKey', token], ['@profilePic', profilePic]])
            .then(response => console.log(" token saved"))
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

    submitTag = (uri, method, data=null) => {
        Call(uri, method, data, this.token)
        .then(response => {
            this.eventEmitter.emit('S_TAG_S', response)
        })
        .catch(error => {
            this.eventEmitter.emit('S_TAG_E', error)
        })
    }
}

const Manager = new dataManager()
export default Manager;
