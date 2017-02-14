import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


import { PushData } from '../../providers/push-data';
import { UserData } from '../../providers/user-data';


import { AlertRule } from '../../models/alert';
import { Type } from '../../models/type';

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
	typeOptions = Type.Types;

	@ViewChild('keywordInput') keywordInput;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public pushData: PushData,
		public userData: UserData
	) {

		if (this.navParams.data.rule) {
			this.rule = this.navParams.data.rule;
		} else {
			this.rule = new AlertRule({
				device: this.pushData.pushId,
				username: this.userData.user.name
			});
		}

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TorrentAlertDetailPage');
		setTimeout(() => {
			this.keywordInput.setFocus();
		}, 150);
	}

	applyRules() {

		this.pushData.updateTorrentAlertRule(this.rule).then(res => {
			console.log(res);
			if (res) {
				this.viewCtrl.dismiss({

				});
			}
		});

	}

	removeRule() {
		this.pushData.removeTorrentAlertRule(this.rule).then(res => {
			if (res) {
				this.viewCtrl.dismiss({

				});
			}
		});
	}

	dismiss(data?: any) {
		// using the injected ViewController this page
		// can "dismiss" itself and pass back data
		this.viewCtrl.dismiss(data);
	}

}
