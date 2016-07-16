import {Injectable} from '@angular/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';


import {MapPage} from '../pages/map/map';
import {HomePage} from '../pages/home/home';


@Injectable()
export class AppData {
    menuPages: Array<{ title: string, component: any }>;
    authProvider: any;

    constructor() {
    this.authProvider = AuthProviders;
        this.menuPages = [
            { title: 'Home', component: HomePage },
            { title: 'Map', component: MapPage }
        ];
    }
    
}