import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Device } from '@ionic-native/device';
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
	isSaving: boolean = false;
	isRemoving: boolean = false;

	@ViewChild('keywordInput') keywordInput;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public pushData: PushData,
		public userData: UserData,
		private device: Device
	) {

		if (this.navParams.data.rule) {
			this.rule = this.navParams.data.rule;
		} else {
			this.rule = new AlertRule({
				device: this.pushData.pushId ? this.pushData.pushId : 'FAKE_PUSH_ID_' + this.userData.user.name,
				username: this.userData.user.name,
				platform: this.device.platform ? this.device.platform : 'test'
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
		this.isSaving = true;
		this.pushData.updateTorrentAlertRule(this.rule).then(res => {
			this.isSaving = false;
			if (res) {
				this.viewCtrl.dismiss({

				});
			}
		});

	}

	removeRule() {
		this.isRemoving = true;
		this.pushData.removeTorrentAlertRule(this.rule).then(res => {
			this.isRemoving = false;
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
