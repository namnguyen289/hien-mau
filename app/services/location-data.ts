import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {Geolocation} from 'ionic-native';

@Injectable()
export class LocationData {
    currentLocation: any = {
        accuracy: "",
        latitude:"",
        longitude:"",
        time:new Date().toString()
    };
    subscription:any;
    constructor(
        private events: Events) {


    }
    getCurrentPosition(_callBack) {
        Geolocation.getCurrentPosition().then((resp) => {
            //resp.coords.latitude
            //resp.coords.longitude            
            // console.log(resp.coords.latitude + '   ' + resp.coords.longitude);
            this.currentLocation.latitude = resp.coords.latitude;
            this.currentLocation.longitude = resp.coords.longitude;
            this.currentLocation.accuracy = resp.coords.accuracy;
            this.currentLocation.time = new Date().toString();
            _callBack(this.currentLocation);
        });
    }
    watchLocation(_callBack) {
        this.subscription = Geolocation.watchPosition().subscribe(position => {
            this.currentLocation.latitude = position.coords.latitude;
            this.currentLocation.longitude = position.coords.longitude;            
            this.currentLocation.accuracy = position.coords.accuracy;            
            this.currentLocation.time = new Date().toString();
            _callBack(this.currentLocation);
        });
    }
    clearWatch(){
        this.subscription.unsubscribe();
    }
}
