import {Page, NavController, NavParams} from 'ionic-angular';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {ItemDetailsPage} from '../item-details/item-details';


@Page({
  templateUrl: 'build/pages/list/list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, content:string }>;
  itemsJson: Array<any>;


  constructor(private nav: NavController, navParams: NavParams, http: Http) {
    this.items = [];
    http.get('/blog/' + 'posts/default?alt=json').map(res => res.json()).subscribe(data => {
      console.log(data);
      // document.getElementById("cntView").innerHTML = data.feed.entry[0].content.$t;
      this.itemsJson = data.feed.entry;
      this.itemsJson.forEach(itm => {
        this.items.push({
          title: itm.title.$t,
          note: "",
          content : itm.content.$t
        });
      });
    },
      err => {
        console.log("Oops!");
      });
    // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');

    // this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    // 'american-football', 'boat', 'bluetooth', 'build'];


  }

  itemTapped(event, item) {
    this.nav.push(ItemDetailsPage, {
      item: item
    });
  }
}
