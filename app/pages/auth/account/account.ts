import {Page, NavController, NavParams,Platform} from 'ionic-angular';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {UserData} from '../../../services/user-data';
interface UserInfo {
    avatarImg: string;
    userName: string;
    email: string;
    phone: string;
    address: string;
    bloodType: string;
    rh: string;
    gender: string;
    birthday: any;
}

@Page({
    templateUrl: 'build/pages/auth/account/account.html'
})

export class AccountPage {
    username: string = '';
    authData: any;
    useAvatar: string = '';
    accountSeg:string = 'infor';
    isAndroid: boolean = false;
    storage = new Storage(LocalStorage);
    userInfo: UserInfo = {
        avatarImg: '/img/none_avatar.png',
        userName: '',
        email: '',
        phone: '',
        address: '',
        bloodType: 'O',
        rh:'Rh',
        gender: 'm',
        birthday: '1988-08-29'
    };

    constructor(public userData: UserData, navParams: NavParams, platform: Platform) {
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