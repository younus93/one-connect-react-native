// import EventEmitter from 'events';
var EventEmitter = require('EventEmitter');
import Call from './network';

class dataManager {
    constructor() {
        this.eventEmitter = new EventEmitter()
        this.token = null;
    }

    addListener = (event, target) => {
        this.eventEmitter.addListener(event, target)
    }

    removeListener = (event, target) => {
        this.eventEmitter.removeListener(event, target)
    }

    setToken = (token) => {
        this.token = token;
    }

    login = (uri, method, data=null) => {

        Call(uri, method, data)
        .then(response => {

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

    profile = (uri, method, data=null) => {

        Call(uri, method, data, this.token)
        .then(response => {
            
            this.eventEmitter.emit('PROFILE_S', response)
        })
        .catch(error => {

            this.eventEmitter.emit('PROFILE_E', error)
        })
    }
}

const Manager = new dataManager()
export default Manager;
