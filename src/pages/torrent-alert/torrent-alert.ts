import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { TorrentAlertDetailPage } from '../torrent-alert-detail/torrent-alert-detail';
/*
  Generated class for the TorrentAlert page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-torrent-alert',
	templateUrl: 'torrent-alert.html'
})
export class TorrentAlertPage {

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public modalCtrl: ModalController
		) { }

	ionViewDidLoad() {
		console.log('ionViewDidLoad TorrentAlertPage');
	}


	showTorrentAlertDetail() {
		let modal = this.modalCtrl.create(TorrentAlertDetailPage);
		modal.present();

		modal.onWillDismiss((data: any) => {
			if (data) {
	
			}
		});
	}
}
