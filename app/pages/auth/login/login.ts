import {Modal,Nav, NavController, Page, ViewController} from 'ionic-angular';
import {Component, OnInit, Inject} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {UserData} from '../../../services/user-data';
import {HomePage} from '../../home/home';

@Page({
    templateUrl: 'build/pages/auth/login/login.html'
})
export class LoginPage {

    error: any;
    authProvider: any;

    constructor(public af: AngularFire,
        public viewCtrl: ViewController,
        public userData: UserData,
        public nav:Nav
    ) {
        this.authProvider = AuthProviders;
    }
    /** 
     * this will dismiss the modal page
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }

    loginWithSocial(_credentials, _authProvider, _event) {
        _event.preventDefault();

        this.userData.loginWithSocial(_authProvider, (val) => console.log(JSON.stringify(val)));
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
        this.userData.loginWithPassword(credentials,val=>{this.nav.setRoot(HomePage);});
    }
}