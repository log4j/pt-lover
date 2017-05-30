import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Events } from 'ionic-angular';

import { TorrentAlertDetailPage } from '../torrent-alert-detail/torrent-alert-detail';


import { Device } from '@ionic-native/device';
import { PushData } from '../../providers/push-data';
import { UserData } from '../../providers/user-data';



import { AlertRule } from '../../models/alert';
import { Type } from '../../models/type';


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
	category: any[];

	categoryKeyMap = {};
	categoryMap = {};

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public pushData: PushData,
		public userData: UserData,
		public events: Events,
		public modalCtrl: ModalController,
		public viewCtrl: ViewController,
		private device: Device
	) {

		this.rules = [];

		for (let i = 0; i < Type.Types.length; i++) {
			this.categoryKeyMap[Type.Types[i].label + "_" + Type.Types[i].value] = true;
		}

		this.loadCategory();
		this.events.subscribe("mode:greenMode", () => {
			this.loadCategory();
		});

		this.loadAlertRules();
	}

	loadCategory() {
		let cates;
		if (this.userData.greenMode) {
			cates = Type.TypesInGreen;
		} else {
			cates = Type.Types;
		}
		this.category = [];
		this.categoryMap = {};
		for (let i = 0; i < cates.length; i++) {
			let obj = {
				type: cates[i],
				checked: false,
				rule: null
			};
			this.category.push(obj)
			this.categoryMap[cates[i].label + "_" + cates[i].value] = obj;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TorrentAlertPage');


	}

	loadAlertRules() {
		this.isLoading = true;
		return this.pushData.getTorrentAlertRules().then(res => {
			this.isLoading = false;
			this.rules = [];
			//reset all element in category 
			for (let i = 0; i < this.category.length; i++) {
				this.category[i].checked = false;
				this.category[i].rule = null;
			}
			if (res && res.length) {


				for (let i = 0; i < res.length; i++) {
					if (this.categoryKeyMap[res[i].keyword + "_" + res[i].category]) {
						let obj = this.categoryMap[res[i].keyword + "_" + res[i].category];
						if (obj) {
							obj.checked = true;
							obj.rule = res[i];
						}
					} else {
						this.rules.push(res[i]);
					}
				}


				// this.rules = res;
			}
			// console.log(this.rules);
			return res;
		});
	}

	toggleCategory(item) {
		console.log(item);
		if (item.checked) {
			let rule = new AlertRule({
				device: this.pushData.pushId ? this.pushData.pushId : 'FAKE_PUSH_ID_' + this.userData.user.name,
				username: this.userData.user.name,
				platform: this.device.platform ? this.device.platform : 'test',
				keyword: item.type.label,
				category: item.type.value
			});

			this.pushData.updateTorrentAlertRule(rule).then(res => {

				if (res) {
					console.log(res, rule);
					item.rule = rule;
				} else {
					item.checked = false;
				}
			});

		} else {
			if (item.rule && item.rule.id) {
				this.pushData.removeTorrentAlertRule(item.rule).then(res => {

					if (res) {
						item.rule = null;
					} else {
						item.checked = true;
					}
				});
			}
		}
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
