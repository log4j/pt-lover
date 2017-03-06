import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

import { TorrentAlertDetailPage } from '../torrent-alert-detail/torrent-alert-detail';



import { PushData } from '../../providers/push-data';
// import { UserData } from '../../providers/user-data';



import { AlertRule } from '../../models/alert';


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

	rules: AlertRule[];
	isLoading: boolean = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public pushData: PushData,
		public modalCtrl: ModalController,
		public viewCtrl: ViewController
	) {

		this.rules = [];

		this.loadAlertRules();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TorrentAlertPage');


	}

	loadAlertRules() {
		this.isLoading = true;
		return this.pushData.getTorrentAlertRules().then(res => {
			this.isLoading = false;
			if (res && res.length) {
				this.rules = res;
			}
			// console.log(this.rules);
			return res;
		});
	}



	showTorrentAlertDetail(rule?: AlertRule) {
		let modal = this.modalCtrl.create(TorrentAlertDetailPage, { rule: rule });
		modal.onWillDismiss((data: any) => {
			// console.log('on dismiss');
			this.loadAlertRules();
		});
		// console.log('show modal');
		modal.present();
	}

	// dismiss() {
	// 	this.viewCtrl.dismiss();
	// }
}
