import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Events } from 'ionic-angular';

import { TorrentData } from '../../providers/torrent-data';
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

  enableTop: boolean = false;
  enableHot: boolean = false;
  showAvatar: boolean = true;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public torrentData: TorrentData,
    public events: Events
  ) {
    this.torrentFilter = navParams.data;

    this.enableHot = this.torrentData.enableHot;
    this.enableTop = this.torrentData.enableTop;
    this.showAvatar = this.torrentData.showAvatar;
  }

  resetFilters() {
    this.torrentFilter.types.forEach(filter => {
      filter.checked = true;
    })
    this.enableHot = false;
    this.enableTop = false;
    this.showAvatar = true;
  }

  applyFilters() {

    let data = {
      enableHot: this.enableHot,
      enableTop: this.enableTop,
      showAvatar: this.showAvatar
    };

    this.torrentData.saveFilterData(data);
    this.events.publish('filters:publish');
    this.viewCtrl.dismiss(data);
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
