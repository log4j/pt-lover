import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { TorrentData } from '../../providers/torrent-data';
import { Torrent,TorrentList } from '../../models/torrent'

/*
  Generated class for the TorrentDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-torrent-detail',
  templateUrl: 'torrent-detail.html'
})
export class TorrentDetailPage {
  torrent: Torrent;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public torrentData: TorrentData
  ) { 

    this.torrent = this.navParams.data;

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TorrentDetailPage');
  }


  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
