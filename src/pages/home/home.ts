import { Component } from '@angular/core';
import { TorrentData } from '../../providers/torrent-data';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public torrentData: TorrentData
  ) {
    
  }

}
