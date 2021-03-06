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

			localStorage.setItem('theme', this.theme);
			document.getElementsByTagName('body')[0].className = localStorage.getItem("theme");

			let allMetaElements = document.getElementsByTagName('meta');
			let targetMeta;
			//loop through and find the element you want
			for (var i = 0; i < allMetaElements.length; i++) {
				if (allMetaElements[i].getAttribute("name") == "theme-color") {
					//make necessary changes
					targetMeta = allMetaElements[i];

					//no need to continue loop after making changes.
					break;
				}
			}


			switch (this.theme) {
				case ('theme-default'):
					// if(this.device.platform === 'ios'){

					// }
					this.statusBar.styleDefault();


					// targetMeta.setAttribute('content', "#FFFFFF");

					if (this.device.platform == 'android') {
						this.statusBar.backgroundColorByHexString("#DDDEDE");
					}

					break;

				case ('theme-dark'):

					this.statusBar.styleBlackTranslucent();
					// targetMeta.setAttribute('content', "#353A3D");

					if (this.device.platform == 'android') {
						this.statusBar.backgroundColorByHexString("#353A3D");
					}
					break;
			}
		}

	}

}
