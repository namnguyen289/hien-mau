import {Modal, Nav, NavController, Page, ViewController} from 'ionic-angular';
import {Component, OnInit, Inject} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {UserData} from '../../../providers/user-data';
import {HomePage} from '../../home/home';
import {SignUpPage} from '../sign-up/sign-up';

@Page({
    templateUrl: 'build/pages/auth/login/login.html'
})
export class LoginPage {

    error: any;
    authProvider: any;

    constructor(public af: AngularFire,
        public viewCtrl: ViewController,
        public userData: UserData,
        public nav: Nav
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
        this.userData.loginWithSocial(_authProvider, (val) => this.nav.setRoot(HomePage));
    }

    login(credentials, _event) {
        _event.preventDefault();
        this.userData.loginWithPassword(credentials, val => { this.nav.setRoot(HomePage); });
    }
     registerUser(credentials, _event) {
        _event.preventDefault();
        this.nav.setRoot(SignUpPage);
    }
}