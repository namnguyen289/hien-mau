import { Component } from '@angular/core';
import { NavController, Page } from 'ionic-angular';
import {Geolocation,GoogleMap, GoogleMapsEvent} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/maps/maps.html',
})
export class MapsPage {
  constructor(private nav: NavController) { }
  ionViewLoaded() {
    // Geolocation.getCurrentPosition().then((resp) => {
    //   //resp.coords.latitude
    //   //resp.coords.longitude
    //   console.log(resp.coords.latitude + '   ' + resp.coords.longitude);
    // });
    // var subscription = Geolocation.watchPosition().subscribe(position => {
    //   console.log(position.coords.longitude + ' ' + position.coords.latitude);
    // });

    // // To stop notifications
    // subscription.unsubscribe();
    let map = new GoogleMap('map');
    map.on(GoogleMapsEvent.MAP_READY).subscribe(() => console.log("Map is ready!"));
    // let mapEle = document.getElementById('map');

    //   let map = new google.maps.Map(mapEle, {
    //     center: mapData.find(d => d.center),
    //     zoom: 16
    //   });
    // this.confData.getMap().then(mapData => {
    //   let mapEle = document.getElementById('map');

    //   let map = new google.maps.Map(mapEle, {
    //     center: mapData.find(d => d.center),
    //     zoom: 16
    //   });

    //   mapData.forEach(markerData => {
    //     let infoWindow = new google.maps.InfoWindow({
    //       content: `<h5>${markerData.name}</h5>`
    //     });

    //     let marker = new google.maps.Marker({
    //       position: markerData,
    //       map: map,
    //       title: markerData.name
    //     });

    //     marker.addListener('click', () => {
    //       infoWindow.open(map, marker);
    //     });
    //   });

    //   google.maps.event.addListenerOnce(map, 'idle', () => {
    //     mapEle.classList.add('show-map');
    //   });

    // });
  }
}
