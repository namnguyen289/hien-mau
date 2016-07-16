//import Plugin
import {Component, ViewChild, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap, Nav, MenuController,Events} from 'ionic-angular';
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


@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = HomePage;

  constructor( private events: Events, platform: Platform, private userData: UserData, private appData: AppData, private menu: MenuController
  ) {
    // Splashscreen.show();
    platform.ready().then(() => {
      StatusBar.styleDefault();
      // console.log(userData.hasLogined);      
    });
  }

  /**
   * Login with socical option
   */
  loginWithSocial(_authProvider) {
    console.log("start login" + _authProvider);
    this.userData.loginWithSocial(_authProvider, val=>this.nav.setRoot(HomePage));
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
    this.nav.push(AccountPage, this.userData.authData);
  }

  /**
   * listen to Login Events
   */
  listenToLoginEvents() {
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
