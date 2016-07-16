//import Plugin
import {Component, ViewChild, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap, Nav, MenuController, Events, Loading} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire, firebaseAuthConfig, AuthProviders, AuthMethods} from 'angularfire2';
//import providers
import {ConnectivityService} from './providers/connectivity-service/connectivity-service';
import {UserData} from './providers/user-data';
import {LocationData} from './providers/location-data';
import {AppData} from './providers/app-data';
//import pages
import {HomePage} from './pages/home/home';
import {AccountPage} from './pages/auth/account/account';
import {SignUpPage} from './pages/auth/sign-up/sign-up';


@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = HomePage;
  loading: Loading;

  constructor(private events: Events, platform: Platform, private userData: UserData, private appData: AppData, private menu: MenuController
  ) {
    // Splashscreen.show();
    platform.ready().then(() => {
      StatusBar.styleDefault();
      // console.log(userData.hasLogined);   
      this.listenToEvents();
    });
  }

  /**
   * Login with socical option
   */
  loginWithSocial(_authProvider) {
    console.log("start login" + _authProvider);
    this.userData.loginWithSocial(_authProvider, val => this.nav.setRoot(HomePage));
  }
  /**
   * Navigate in menu
   */
  openPage(page) {
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  /**
   * Navigate to account setting
   */
  account(_event) {
    _event.preventDefault();
    this.nav.setRoot(AccountPage, this.userData.authData);
  }

  /**
   * listen to Login Events
   */
  listenToEvents() {
    this.events.subscribe('event:ShowLoading', (param) => {
      this.presentLoading(param);
    });
    this.events.subscribe('event:HideLoading', () => {
      this.hideLoading();
    });
    this.events.subscribe('user:login', () => {
      console.log('user:login');
    });

    this.events.subscribe('user:signup', () => {
      console.log('user:signup');
    });

    this.events.subscribe('user:logout', () => {
      this.nav.setRoot(HomePage);
      console.log('user:logout');
    });
  }
  presentLoading(options: any) {
    let message = 'Pleasess wait...';
    if (typeof options === 'object' && typeof options[0] === 'string') {
      message = options[0];
    }
    try {
      //to-do will fix in beta 11
      this.loading = Loading.create({
        content: message, dismissOnPageChange: true
      });
      this.nav.present(this.loading).catch(e => { console.log(e) });
    } catch (e) {
      console.log(e);
    };
  }

  hideLoading() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
      // this.loading.dismiss();
    };
  }
}

ionicBootstrap(MyApp, [
  FIREBASE_PROVIDERS,
  // Initialize Firebase app  
  defaultFirebase({
    apiKey: "AIzaSyBGqdHqg2C_x-1llpBPJmLaxzvZOsevWeU",
    authDomain: "hienmau-4e39a.firebaseapp.com",
    databaseURL: "https://hienmau-4e39a.firebaseio.com",
    storageBucket: "hienmau-4e39a.firebaseapp.com",
  }),
  ConnectivityService,
  UserData,
  LocationData,
  AppData
]);
