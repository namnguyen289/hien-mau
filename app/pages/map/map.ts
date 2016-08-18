import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';
import {LocationData} from '../../providers/location-data';
import {UserData, UserInfo} from '../../providers/user-data';

@Component({
    templateUrl: 'build/pages/map/map.html',
})
export class MapPage {

    map: any;
    mapInitialised: boolean = false;
    apiKey: any = "AIzaSyBGqdHqg2C_x-1llpBPJmLaxzvZOsevWeU";//AIzaSyAh2Lz13gecn31S3llMPJdGDqREt1E4Gh4";

    markers: Array<any> = [];

    constructor(private nav: NavController, public userData: UserData, private connectivity: ConnectivityService, private locData: LocationData) {
        this.loadGoogleMaps();
    }

    loadGoogleMaps() {

        this.addConnectivityListeners();
        if (typeof google == "undefined" || typeof google.maps == "undefined") {

            console.log("Google maps JavaScript needs to be loaded.");
            this.disableMap();

            if (this.connectivity.isOnline()) {
                console.log("online, loading map");

                //Load the SDK
                (<any>window).mapInit = () => {
                    console.log("MAPINIT FUNCTION")
                    this.initMap();
                    this.enableMap();
                }

                let script = document.createElement("script");
                script.id = "googleMaps";

                if (this.apiKey) {
                    console.log("API EXISTS");
                    script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
                } else {
                    script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
                }

                document.body.appendChild(script);

            }
        } else {

            if (this.connectivity.isOnline()) {
                console.log("showing map");
                this.initMap();
                this.enableMap();
            }
            else {
                console.log("disabling map");
                this.disableMap();
            }

        }

    }

    initMap() {

        this.mapInitialised = true;
        let locationOptions = { timeout: 10000, enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log(position);

            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            let marker = new google.maps.Marker({
                map: this.map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10
                },
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            let content = "<h6>Your current location</h6>";

            this.addInfoWindow(marker, content);
        }, (error) => {
            console.log("this is error", error);

            let mapOptions = {
                center: new google.maps.LatLng(51.508742, -0.120850),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        }, locationOptions);

    }

    disableMap() {
        console.log("disable map");
    }

    enableMap() {
        console.log("enable map");
    }

    addConnectivityListeners() {
        var me = this;

        var onOnline = () => {
            setTimeout(() => {
                if (typeof google == "undefined" || typeof google.maps == "undefined") {
                    this.loadGoogleMaps();
                } else {
                    if (!this.mapInitialised) {
                        this.initMap();
                    }

                    this.enableMap();
                }
            }, 2000);
        };

        var onOffline = () => {
            this.disableMap();
        };

        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);

    }

    addMarker() {
        this.userData.getListUser(data => {
            this.clearMarkers();
            data.forEach(element => {
                if (element.crlatitude && element.crlongitude) {
                    let crloc: any = { lat: element.crlatitude * 1, lng: element.crlongitude * 1 };
                    let marker = new google.maps.Marker({
                        map: this.map,
                        animation: google.maps.Animation.DROP,
                        position: crloc
                    });
                    console.log(crloc);
                    let content = "<div id='" + element.uid + "'> <h6>" + element.displayName + "</h6>" +
                        "Nhóm Máu: " + element.bloodType + "" + element.rh + "</div>";

                    this.addInfoWindow(marker, content);
                    this.updateMarker(marker, element);
                    console.log(this.markers);

                }
            });
        });
        // let marker = new google.maps.Marker({
        //     map: this.map,
        //     animation: google.maps.Animation.DROP,
        //     position: this.map.getCenter()
        // });

        // let content = "<h4>Information!</h4>";

        // this.addInfoWindow(marker, content);
    }
    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(this.map, marker);
        });
    }
    updateMarker(marker: any, element: any) {
        let isExisted: boolean = false;
        this.markers.forEach(val => {
            if (val.uid == element.uid) {
                isExisted = true;
                val.item.setMap(null);
                val.item = marker;
            }
        });
        if (!isExisted) {
            this.markers.push({ uid: element.uid, item: marker });
        }
    }

    clearMarkers() {
        this.markers.forEach(val => {
            val.item.setMap(null);
        });
        this.markers = [];
    }
}
