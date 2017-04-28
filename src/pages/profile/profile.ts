import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


import { User } from '../../models/user';


import { Device } from '@ionic-native/device';
import { StatusBar } from '@ionic-native/status-bar';



import { TorrentData } from '../../providers/torrent-data';
import { UserData } from '../../providers/user-data';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	user: User = null;
	theme: string = localStorage.getItem("theme");
	themeOptions = [{
		label: '默认',
		value: 'theme-default'
	}, {
		label: '黑色',
		value: 'theme-dark'
	}];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public torrentData: TorrentData,
		public userData: UserData,
		public viewCtrl: ViewController,
		private statusBar: StatusBar,
		private device: Device
	) {

		// this.torrentData.login().subscribe(data=>{
		// console.log(data);
		// });
		this.loadUserInformation();
	}

	loadUserInformation() {
		this.userData.loadHomeData().then(data => {
			if (data) {
				this.user = data.user;
			}
		});
	}

	ionViewDidLoad() {
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	themeChanged($event) {
		if ($event && typeof $event === 'string') {
			console.log('theme changed:', $event, this.theme);

			console.log(localStorage.getItem('theme'));
			localStorage.setItem('theme', this.theme);
			document.getElementsByTagName('body')[0].className = localStorage.getItem("theme");


			switch (this.theme) {
				case ('theme-default'):
					// if(this.device.platform === 'ios'){

					// }
					this.statusBar.styleDefault();

					break;

				case ('theme-dark'):

					this.statusBar.styleBlackTranslucent();

					break;
			}
		}

	}

}
