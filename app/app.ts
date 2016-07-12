import {Component, ViewChild, enableProdMode} from '@angular/core';
import {ionicBootstrap, Events, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar,Splashscreen} from 'ionic-native';
import {UserData} from './services/user-data';
import {LocationData} from './services/location-data';
import {LoginPage} from './pages/auth/login/login';
import {HomePage} from './pages/home/home';
import {ListPage} from './pages/list/list';
import {AccountPage} from './pages/auth/account/account';
import {MapsPage} from './pages/maps/maps';
// import {ListPage} from './pages/list/list';
import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods
} from 'angularfire2';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any }>;
  authProvider: any;
  hasLogined: boolean = false;
  authData: any;

  constructor(
    private events: Events,
    private platform: Platform,
    private userData: UserData,
    private menu: MenuController
  ) {
    Splashscreen.show();
    this.authProvider = AuthProviders;
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HomePage },
      { title: ' List page', component: ListPage },
      { title: 'Map', component: MapsPage }
    ];
    // Splashscreen.hide();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });

    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      //  this.hasLogined = hasLoggedIn === 'true';
      if (hasLoggedIn === 'true') this.logged();
    });

    this.listenToLoginEvents();
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  account(_event) {
    _event.preventDefault();
    this.nav.push(AccountPage, this.authData);
  }

  logOut() {
    this.userData.logout();
  }

  loginWithSocial(_authProvider, _event) {
    // _event.preventDefault();
    console.log("start login" + _authProvider);
    this.userData.loginWithSocial(_authProvider, (val) => {
      console.log(JSON.stringify(val));
      this.nav.setRoot(HomePage);
    }
    );
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.logged();
      console.log('user:login');
    });

    this.events.subscribe('user:signup', () => {
      this.logged();
      console.log('user:signup');
    });

    this.events.subscribe('user:logout', () => {
      this.hasLogined = false;
      this.nav.setRoot(LoginPage);
      console.log('user:logout');
    });
  }
  logged() {
    this.hasLogined = true;
    // this.authData = this.userData.authData;
    this.userData.getAuthData().then((value) => {
      this.authData = JSON.parse(value);
      this.userData.locTracking(this.authData.uid);
      // console.log(this.authData);
      this.nav.setRoot(HomePage);
    });
  }
}
enableProdMode();
ionicBootstrap(MyApp, [
  FIREBASE_PROVIDERS,
  // Initialize Firebase app  
  defaultFirebase({
    apiKey: "AIzaSyBGqdHqg2C_x-1llpBPJmLaxzvZOsevWeU",
    authDomain: "hienmau-4e39a.firebaseapp.com",
    databaseURL: "https://hienmau-4e39a.firebaseio.com",
    storageBucket: "hienmau-4e39a.firebaseapp.com",
  }),
  UserData,
  LocationData
]);