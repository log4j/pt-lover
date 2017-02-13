import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


import { PushData } from '../../providers/push-data';


import { AlertRule } from '../../models/alert';
import {Type } from '../../models/type';

/*
  Generated class for the TorrentAlertDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-torrent-alert-detail',
	templateUrl: 'torrent-alert-detail.html'
})
export class TorrentAlertDetailPage {
	rule: AlertRule;
	typeOptions =  Type.Types;

	@ViewChild('keywordInput') keywordInput;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public pushData: PushData
	) {


		this.rule = new AlertRule(this.pushData.pushId);
		console.log(this.rule);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TorrentAlertDetailPage');
		setTimeout(()=>{
			this.keywordInput.setFocus();
		},150);
	}

	applyRules() {
		console.log(this.rule);
		this.viewCtrl.dismiss({

		});
	}

	dismiss(data?: any) {
		// using the injected ViewController this page
		// can "dismiss" itself and pass back data
		this.viewCtrl.dismiss(data);
	}

}
