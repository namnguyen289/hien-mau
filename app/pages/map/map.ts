import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';

@Component({
  templateUrl: 'build/pages/map/map.html',
})
export class MapPage {

  map: any;
  mapInitialised: boolean = false;
  apiKey: any = "AIzaSyBGqdHqg2C_x-1llpBPJmLaxzvZOsevWeU";//AIzaSyAh2Lz13gecn31S3llMPJdGDqREt1E4Gh4";

  constructor(private nav: NavController, private connectivity: ConnectivityService) {
    this.loadGoogleMaps();
  }

  loadGoogleMaps(){

    this.addConnectivityListeners();
    if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        if(this.connectivity.isOnline()){
            console.log("online, loading map");

            //Load the SDK
            (<any>window).mapInit=() => {
                              console.log("MAPINIT FUNCTION")
                                this.initMap();
                                this.enableMap();
                            }

            let script = document.createElement("script");
            script.id = "googleMaps";

            if(this.apiKey){
                console.log("API EXISTS");
                script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
            } else {
                script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
            }

            document.body.appendChild(script);

        }
    }else {

        if(this.connectivity.isOnline()){
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

  initMap(){

    this.mapInitialised = true;

    navigator.geolocation.getCurrentPosition( (position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(latLng);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    }, (error) => {
        console.log("this is error",error);

        let mapOptions = {
          center: new google.maps.LatLng(51.508742,-0.120850),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    });

  }

  disableMap(){
    console.log("disable map");
  }

  enableMap(){
    console.log("enable map");
  }

  addConnectivityListeners(){
    var me = this;

    var onOnline = () => {
        setTimeout(() => {
            if(typeof google == "undefined" || typeof google.maps == "undefined"){
                this.loadGoogleMaps();
            } else {
                if(!this.mapInitialised){
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

}
