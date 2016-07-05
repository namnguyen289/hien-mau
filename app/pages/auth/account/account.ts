import {Page, NavController, NavParams} from 'ionic-angular';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {UserData} from '../../../services/user-data';

@Page({
    templateUrl: 'build/pages/auth/account/account.html'
})

export class AccountPage {
    username: string = '';
    authData: any;
    useAvatar: string = '';
    storage = new Storage(LocalStorage);
    constructor(public userData: UserData, navParams: NavParams) {
        this.authData = navParams.data;
        // console.log(this.authData);
        // console.log(this.useAvatar);
        this.username = this.authData.auth.displayName;
        this.useAvatar = this.authData && this.authData.auth.photoURL != 'MISSING' ? this.authData.auth.photoURL : "";
    }
    ionViewLoaded() {
        document.getElementById("avatarImg").setAttribute("src", this.useAvatar);
    }
}