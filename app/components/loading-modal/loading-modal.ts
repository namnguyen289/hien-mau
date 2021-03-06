import { Component } from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'loading-modal',
  templateUrl: 'build/components/loading-modal/loading-modal.html',
  directives: [IONIC_DIRECTIVES]
})
export class LoadingModal {

  isBusy: boolean;

  constructor() {
    this.isBusy = false;
  }
 
  show(){
    this.isBusy = true;
  }
 
  hide(){
    this.isBusy = false;
  }
}
