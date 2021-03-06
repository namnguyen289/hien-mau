import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2';
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
    crlongitude: any;
    crlatitude: any;
}

@Injectable()
export class UserData {

    HAS_LOGGED_IN: string = 'hasLoggedIn';
    AUTH_INFO: string = 'AUTH_INFO';
    AVATAR_DEFAULT: string = "/img/none_avatar.png";
    storage = new Storage(LocalStorage);
    hasLogined: boolean = false;
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
        birthday: '1988-08-29',
        crlatitude: '10.7975447',
        crlongitude: '106.6468263'
    }

    constructor(
        private events: Events,
        public locationData: LocationData,
        public af: AngularFire) {
        this.checkLogged();
    }

    checkLogged() {
        this.storage.get(this.AUTH_INFO).then(val => {
            this.authData = JSON.parse(val);
            this.hasLogined = this.authData != null;
            // console.log(val);
            // console.log(this.hasLogined);
        }).catch(e => console.log(e));
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
        this.hasLogined = false;
        this.events.publish('user:logout');
    }

    /** 
     * Call after get authentication information 
    */
    onLogin(authData: any) {

        // console.log(JSON.stringify(authData));
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.storage.set(this.AUTH_INFO, JSON.stringify(authData));
        this.authData = authData;
        this.hasLogined = true;

        this.locationData.getCurrentPosition(data => {
            var obj: any = {
                "provider": authData.auth.providerData[0].providerId,
                "email": authData.auth.email || "MISSING",
                "displayName": authData.auth.providerData[0].displayName || authData.auth.email,
                "crlatitude": data.latitude,
                "crlongitude": data.longitude
            };
            if (authData.auth.providerData[0].providerId != AuthMethods.Password) {
                obj.avatarImg = authData.auth.photoURL || this.AVATAR_DEFAULT;
            }
            const itemObservable = this.af.database.object('/users/' + authData.uid);
            itemObservable.update(obj);
            this.locTracking(authData.uid);
            this.events.publish('user:login');
        });
    }

    /**
     * this create in the user using the form credentials. 
     */
    registerUser(_credentials): Promise<FirebaseAuthState> {
        return this.af.auth.createUser(_credentials);
        // .then((user) => {
        //     console.log(`Create User Success:`, user);
        //     _credentials.created = true;
        // })
        // .catch(e => console.error(`Create User Failure:`, e));
    }

    updateUserInfo(_userInfor: UserInfo, _callback?) {

        this.events.publish('event:ShowLoading', 'Updating...');
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
        }).then((val) => this.events.publish('event:HideLoading')).catch(e => {
            this.events.publish('event:HideLoading');
            console.log(e);
        });
        this.locTracking(_userInfor.uid);
    }

    locTracking(uid: string) {
        this.locationData.getCurrentPosition(data => {
            const itemObservable = this.af.database.list('/users/' + uid + '/locations/');
            //to-do open frane when public
            // itemObservable.push(data);
            // console.log(data);
        });
    }

    getUserInfor(uid: string): FirebaseObjectObservable<any> {
        return this.af.database.object('/users/' + uid);
    }
    /**
     * Get Defualt User information Object
     */
    getDefaultUserInfo(): UserInfo {
        return JSON.parse(JSON.stringify(this.defaultUserInfo));
    }

    /**
     * Get list user 
     */
    getListUser(callBack, par?: Object) {
        let result: Array<UserInfo> = new Array<UserInfo>();
        const lstUser = this.af.database.list('/users/', par).subscribe(data => {
            if (data) {
                // console.log(data);
                data.forEach(obj => {
                    result.push(this.obj2UserInfo(obj));
                });
                callBack(result);
            }
        });
    }
    obj2UserInfo(obj: any): UserInfo {
        let user: UserInfo = {
            uid: obj.$key,
            address: obj.address,
            avatarImg: obj.avatarImg,
            birthday: obj.birthday,
            bloodType: obj.bloodType,
            displayName: obj.displayName,
            email: obj.email,
            gender: obj.gender,
            phone: obj.phone,
            rh: obj.rh,
            crlatitude:obj.crlatitude,
            crlongitude:obj.crlongitude
        }
        return user;
    }
}
