import { Component, ViewChild } from '@angular/core';
import { NavController, PopoverController, ModalController, NavParams, List } from 'ionic-angular';


import { TorrentData } from '../../providers/torrent-data';
import { TorrentFilter } from '../../models/filter'
import { TorrentList } from '../../models/torrent'

import { PeerListPopOverPage } from '../peer-list-pop-over/peer-list-pop-over';
import { TorrentFilterPage } from '../torrent-filter/torrent-filter';

/*
  Generated class for the TorrentList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-torrent-list',
  templateUrl: 'torrent-list.html'
})
export class TorrentListPage {
  // the list is a child of the schedule page
  // @ViewChild('torrentList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('torrentList', { read: List }) torrentList: List;

  torrents:TorrentList = new TorrentList(); 

  torrentFilter: TorrentFilter;




  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public torrentData: TorrentData,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController
  ) {

      this.torrentData.getTypes().subscribe(data=>{
        
        this.torrentFilter = new TorrentFilter(data);

        console.log(this.torrentFilter);

      });

      

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TorrentListPage');
    this.updateTorrentList();
  }

  updateTorrentList () {
    // Close any open sliding items when the schedule updates
    this.torrentList && this.torrentList.closeSlidingItems();

    this.torrentData.loadTorrentPage().then(data=>{
        this.torrents = data;
        console.log(this.torrents);
      });
      
  }

  presentPopover(ev) {

    let popover = this.popoverCtrl.create(PeerListPopOverPage, {
    });

    popover.present({
      ev: ev
    });
  }


  presentFilter() {
    let modal = this.modalCtrl.create(TorrentFilterPage, this.torrentFilter);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        console.log(data);
      }
    });

  }

}
