import {Modal, NavController, Page, ViewController} from 'ionic-angular';
import {Component, OnInit, Inject} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {UserData} from '../../../services/user-data';

@Page({
    templateUrl: 'build/pages/auth/login/login.html'
})
export class LoginPage {

    error: any;
    authProvider:any;

    constructor(public af: AngularFire,
        public viewCtrl: ViewController,
        public userData:UserData
        ) { 
            this.authProvider = AuthProviders;
        }
    /** 
     * this will dismiss the modal page
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }
   
    loginWithSocial(_credentials,_authProvider,_event){
        _event.preventDefault();

        this.userData.loginWithSocial(_authProvider,(val)=>console.log(val));
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
    login(credentials, _event) {
        _event.preventDefault();

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
                this.dismiss()
            }
        }).then((value) => {
            this.dismiss()
        }).catch((error) => {
            this.error = error
            console.log(error)
        });
    }
}