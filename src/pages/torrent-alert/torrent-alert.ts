import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

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

	rules: AlertRule[]

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public pushData:PushData,
		public modalCtrl: ModalController
	) { 

		this.rules = [];

		this.loadAlertRules();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TorrentAlertPage');


	}

	loadAlertRules(){
		return this.pushData.getTorrentAlertRules().then(res=>{
			if(res && res.length){
				this.rules = res;
			}
			return res;
		});
	}


	showTorrentAlertDetail(rule:AlertRule) {
		let modal = this.modalCtrl.create(TorrentAlertDetailPage,{rule:rule});
		modal.present();

		modal.onWillDismiss((data: any) => {
			this.loadAlertRules();
		});
	}
}
