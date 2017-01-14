import { Component } from '@angular/core';
import { TorrentData } from '../../providers/torrent-data';
import { UserData } from '../../providers/user-data';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

import {LoginPage} from '../login/login';

import {Notice, NoticeList} from '../../models/notice';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	notices: Notice[] = [];
	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public torrentData: TorrentData,
		public userData: UserData
	) {

		this.loadHomePageData();

	}


	loadHomePageData() {

		//first check if logged!
		let loader = this.loadingCtrl.create({
			content: "正在载入, 请稍等..."
		});
		loader.present();

		this.userData.loadHomeData().then(data => {

			loader.dismiss();
			console.log(data);
			if (data) {
				this.notices = data.notices.notices;
			} else {
				//show login modal
				let modal = this.modalCtrl.create(LoginPage);
				modal.present();
			}
		})

	}

}
