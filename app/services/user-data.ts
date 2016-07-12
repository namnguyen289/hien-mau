import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';
import {LocationData} from './location-data';

export declare class UserInfo {
    uid: string;
    avatarImg: string;
    displayName: string;
    email: string;
    phone: string;
    address: string;
    bloodType: string;
    rh: string;
    gender: string;
    birthday: any;
}

@Injectable()
export class UserData {

    HAS_LOGGED_IN: string = 'hasLoggedIn';
    AUTH_INFO: string = 'AUTH_INFO';
    AVATAR_DEFAULT: string = "/img/none_avatar.png";
    storage = new Storage(LocalStorage);
    error: any;
    authProvider: any;
    authData: any;

    defaultUserInfo: UserInfo = {
        uid: "",
        avatarImg: '/img/none_avatar.png',
        displayName: '',
        email: '',
        phone: '',
        address: '',
        bloodType: 'O',
        rh: 'Rh',
        gender: 'm',
        birthday: '1988-08-29'
    }

    constructor(
        private events: Events,
        public locationData: LocationData,
        public af: AngularFire) {

    }

    getDefaultUserInfo(): UserInfo {
        return JSON.parse(JSON.stringify(this.defaultUserInfo));
    }
    /**
     * this create in the user using the form credentials. 
     */
    registerUser(_credentials) {
        this.af.auth.createUser(_credentials)
            .then((user) => {
                console.log(`Create User Success:`, user);
                _credentials.created = true;

                return this.loginWithSocial(_credentials, AuthProviders.Password);
            })
            .catch(e => console.error(`Create User Failure:`, e));
    }

    loginWithSocial(_authProviders, _callBack?) {
        this.af.auth.login({
            provider: _authProviders,//AuthProviders.Google,
            method: AuthMethods.Popup
        }).then((authData) => {
            this.onLogin(authData);
            console.log("callback");
            if (_callBack) _callBack(authData);
        }).catch((error) => {
            this.error = error
            console.log(JSON.stringify(error));
        });
    }
    /**
     * this logs in the user using the form credentials.
     * 
     */
    loginWithPassword(credentials, _callBack?) {
        // login usig the email/password auth provider
        this.af.auth.login(credentials, {
            provider: AuthProviders.Password,
            method: AuthMethods.Password
        }).then((authData) => {
            this.onLogin(authData);
        }).then((authData) => {
            this.onLogin(authData);
            console.log("callback");
            if (_callBack) _callBack(authData);
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

    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value;
        });
    }

    getAuthData(_callback) {
        return this.storage.get(this.AUTH_INFO).then(val=>{
            _callback(val);
        });
    }
    /** 
     * Call after get authentication information 
    */
    onLogin(authData: any) {

        console.log(JSON.stringify(authData));
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.storage.set(this.AUTH_INFO, JSON.stringify(authData));
        this.authData = authData;

        var obj:any = {
            "provider": authData.auth.providerData[0].providerId,
            "email": authData.auth.email || "MISSING",
            "displayName": authData.auth.providerData[0].displayName || authData.auth.email,
        };
        if (authData.auth.providerData[0].providerId != AuthMethods.Password) {
            obj.avatarImg = authData.auth.photoURL || this.AVATAR_DEFAULT;
        }
        const itemObservable = this.af.database.object('/users/' + authData.uid);
        itemObservable.update(obj);
        this.locTracking(authData.uid);
        this.events.publish('user:login');
    }

    updateUserInfo(_userInfor: UserInfo, _callback?) {
        const itemObservable = this.af.database.object('/users/' + _userInfor.uid);
        itemObservable.update({
            "email": _userInfor.email,
            "avatarImg": _userInfor.avatarImg,
            "displayName": _userInfor.displayName,
            "phone": _userInfor.phone,
            "address": _userInfor.address,
            "bloodType": _userInfor.bloodType,
            "rh": _userInfor.rh,
            "gender": _userInfor.gender,
            "birthday": _userInfor.birthday
        });
        this.locTracking(_userInfor.uid);
    }

    locTracking(uid: string) {
        this.locationData.getCurrentPosition(data => {
            const itemObservable = this.af.database.list('/users/' + uid + '/locations/');
            itemObservable.push(data);
            console.log(data);
        });
    }

    getUserInfor(uid: string): FirebaseObjectObservable<any> {
        return this.af.database.object('/users/' + uid);
    }
}
