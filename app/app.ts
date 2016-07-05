import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Events, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {UserData} from './services/user-data';
import {LoginPage} from './pages/auth/login/login';
import {HomePage} from './pages/home/home';
import {ListPage} from './pages/list/list';
import {AccountPage} from './pages/auth/account/account';
// import {ListPage} from './pages/list/list';
import {
    FIREBASE_PROVIDERS, defaultFirebase,
    AngularFire, firebaseAuthConfig, AuthProviders,
    AuthMethods
} from 'angularfire2';

@Component({
  templateUrl: 'build/app.html',
    providers: [
        FIREBASE_PROVIDERS,
        // Initialize Firebase app  
        defaultFirebase({
            apiKey: "AIzaSyCwHn4SaG4xAgcjP-7s3Ro4HBUSVX3YqGI",
            authDomain: "hienmau-57688.firebaseapp.com",
            databaseURL: "https://hienmau-57688.firebaseio.com",
            storageBucket: "hienmau-57688.appspot.com",
        }),
        firebaseAuthConfig({
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
            remember: 'default',
            scope: ['email']
        }),
        UserData
    ]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;
  authProvider:any;
  hasLogined:boolean = false;
  authData:any;

  constructor(
    private events: Events,
    private platform: Platform,
    private userData: UserData,
    private menu: MenuController
  ) {
    this.authProvider = AuthProviders;
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HomePage },
      { title: ' List page', component: ListPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });

     this.userData.hasLoggedIn().then((hasLoggedIn) => {
      //  this.hasLogined = hasLoggedIn === 'true';
       if(hasLoggedIn === 'true')this.logged();
    });

    this.listenToLoginEvents();
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  account(_event){
    _event.preventDefault();
    this.nav.push(AccountPage,this.authData);
  }

  logOut(){
    this.userData.logout();
  }

  loginWithSocial(_authProvider,_event){
        _event.preventDefault();

        this.userData.loginWithSocial(_authProvider,(val)=>console.log(val));
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
  logged(){
    this.hasLogined = true;
    // this.authData = this.userData.authData;
    this.userData.getAuthData().then((value)=>{
      this.authData = JSON.parse(value);
      // console.log(this.authData);
      this.nav.setRoot(HomePage);
    });
  }
}

ionicBootstrap(MyApp);
