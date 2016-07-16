import {Page, NavController, NavParams, Platform} from 'ionic-angular';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {UserData, UserInfo} from '../../../providers/user-data';
import { AngularFire } from 'angularfire2';

// interface UserInfo {
//     uid:string;
//     avatarImg: string;
//     userName: string;
//     email: string;
//     phone: string;
//     address: string;
//     bloodType: string;
//     rh: string;
//     gender: string;
//     birthday: any;
// }

@Page({
    templateUrl: 'build/pages/auth/account/account.html'
})


export class AccountPage {
    username: string = '';
    authData: any;
    useAvatar: string = '';
    accountSeg: string = 'infor';
    isAndroid: boolean = false;
    storage = new Storage(LocalStorage);
    userInfo: UserInfo = {
        uid: "",
        avatarImg: '/img/none_avatar.png',
        displayName: '',
        email: '',
        phone: '',
        address: '',
        bloodType: 'O',
        rh: 'Rh',
        gender: 'm',
        birthday: '1988-08-29'
    };

    constructor(private events: Events, public userData: UserData, navParams: NavParams, platform: Platform, af: AngularFire) {
        this.authData = navParams.data;
        // console.log(this.authData);
        // console.log(this.useAvatar);
        // this.userInfo.displayName = this.authData.auth.displayName;
        // this.userInfo.avatarImg = this.authData && this.authData.auth.photoURL != 'MISSING' ? this.authData.auth.photoURL : "";
        this.userInfo.uid = this.authData.uid;
        this.events.publish('event:ShowLoading','Loading...');
        userData.getUserInfor(this.userInfo.uid).subscribe(obj => {
            if (obj) {
                this.userInfo.uid = obj.$key;
                this.userInfo.avatarImg = obj.avatarImg;
                this.userInfo.displayName = obj.displayName;
                this.userInfo.email = obj.email;
                this.userInfo.phone = obj.phone;
                this.userInfo.address = obj.address;
                this.userInfo.bloodType = obj.bloodType;
                this.userInfo.rh = obj.rh;
                this.userInfo.gender = obj.gender;
                this.userInfo.birthday = obj.birthday;
            } else {
                this.userInfo = userData.getDefaultUserInfo();
            }
            // console.log(this.userInfo);
            this.events.publish('event:HideLoading');
        });

    }
    ionViewLoaded() {
        document.getElementById("avatarImg").setAttribute("src", this.userInfo.avatarImg);
    }

    update() {
        this.userData.updateUserInfo(this.userInfo);
    }
}