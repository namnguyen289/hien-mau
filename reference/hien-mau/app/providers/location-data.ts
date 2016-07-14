import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {Geolocation} from 'ionic-native';

@Injectable()
export class LocationData {
    currentLocation: any = {
        accuracy: "",
        latitude: "",
        longitude: "",
        time: new Date().toString()
    };
    subscription: any;
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
    clearWatch() {
        this.subscription.unsubscribe();
    }
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
}
