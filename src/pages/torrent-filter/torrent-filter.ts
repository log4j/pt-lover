import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';


import { TorrentFilter } from '../../models/filter'

/*
  Generated class for the TorrentFilter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-torrent-filter',
  templateUrl: 'torrent-filter.html'
})
export class TorrentFilterPage {

  torrentFilter: TorrentFilter;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.torrentFilter = navParams.data;
  }

  resetFilters(){
    this.torrentFilter.types.forEach(filter=>{
      filter.checked = true;
    })
  }

  applyFilters() {
  
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TorrentFilterPage');
  }

}
