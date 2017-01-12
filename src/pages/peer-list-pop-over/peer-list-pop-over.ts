import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the PeerListPopOver page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-peer-list-pop-over',
  templateUrl: 'peer-list-pop-over.html'
})
export class PeerListPopOverPage {

  constructor(public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeerListPopOverPage');
  }

}
