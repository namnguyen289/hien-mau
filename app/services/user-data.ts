import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {AngularFire, AuthProviders, AuthMethods } from 'angularfire2';


@Injectable()
export class UserData {

    HAS_LOGGED_IN: string = 'hasLoggedIn';
    AUTH_INFO:string = 'AUTH_INFO';
    storage = new Storage(LocalStorage);
    error: any;
    authProvider: any;
    authData:any;

    constructor(
        private events: Events,
        public af: AngularFire) {

    }

    login(username) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        // this.setUsername(username);
        this.events.publish('user:login');
    }
    /**
     * this create in the user using the form credentials. 
     *
     * we are preventing the default behavor of submitting 
     * the form
     * 
     * @param _credentials {Object} the email and password from the form
     * @param _event {Object} the event information from the form submit
     */
    registerUser(_credentials) {
        this.af.auth.createUser(_credentials)
            .then((user) => {
                console.log(`Create User Success:`, user);
                _credentials.created = true;

                return this.loginWithSocial(_credentials,AuthProviders.Password);
            })
            .catch(e => console.error(`Create User Failure:`, e));
    }

    loginWithSocial(_authProviders, _callBack?) {
        this.af.auth.login({
            provider: _authProviders,//AuthProviders.Google,
            method: AuthMethods.Popup
        }).then((authData) => {
            console.log(authData)
            this.storage.set(this.HAS_LOGGED_IN, true);
            this.storage.set(this.AUTH_INFO,JSON.stringify(authData));
            this.authData = authData;
            // already has user... need better info??
            if (!authData) {
                // this.dismiss()
            }
            
            const itemObservable = this.af.database.object('/users/' + authData.uid);
            itemObservable.set({
                "provider": authData.auth.providerData[0].providerId,
                "avatar": authData.auth.photoURL || "MISSING",
                "email": authData.auth.email || "MISSING",
                "displayName": authData.auth.providerData[0].displayName || authData.auth.email,
            })
            this.events.publish('user:login');
        }).then((value) => {
            if(_callBack)_callBack(value);
            // this.dismiss()
        }).catch((error) => {
            this.error = error
            console.log(error)
        });
    }
    /**
     * this logs in the user using the form credentials.
     * 
     * if the user is a new user, then we need to create the user AFTER
     * we have successfully logged in
     * 
     * @param _credentials {Object} the email and password from the form
     * @param _event {Object} the event information from the form submit
     */
    loginWithPassword(credentials) {
        // if this was called from the register user,  the check if we 
        // need to create the user object or not
        let addUser = credentials.created
        credentials.created = null;

        // login usig the email/password auth provider
        this.af.auth.login(credentials, {
            provider: AuthProviders.Password,
            method: AuthMethods.Password
        }).then((authData) => {
            console.log(authData)

            if (addUser) {
                const itemObservable = this.af.database.object('/users/' + authData.uid);
                itemObservable.set({
                    "provider": authData.auth.providerData[0].providerId,
                    "avatar": authData.auth.photoURL || "MISSING",
                    "displayName": authData.auth.providerData[0].displayName || authData.auth.email,
                })
            } else {
                // this.dismiss()
            }
        }).then((value) => {
            // this.dismiss()
        }).catch((error) => {
            this.error = error
            console.log(error)
        });
    }

    logout() {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove(this.AUTH_INFO);
        this.events.publish('user:logout');
    }

    // return a promise
    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value;
        });
    }
    
    getAuthData(){
        return this.storage.get(this.AUTH_INFO).then((value) => {
            return value;
        });
    }
}
