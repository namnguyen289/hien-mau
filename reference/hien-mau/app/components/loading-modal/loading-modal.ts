import { Component } from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

/*
  Generated class for the LoadingModal component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
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

  show() {
    this.isBusy = true;
  }

  hide() {
    this.isBusy = false;
  }
}
