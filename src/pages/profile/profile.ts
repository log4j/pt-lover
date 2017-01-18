import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { User } from '../../models/user';

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
	user:User = null;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public torrentData: TorrentData,
		public userData: UserData
	) {

		// this.torrentData.login().subscribe(data=>{
		// console.log(data);
		// });
		this.loadUserInformation();
	}

	loadUserInformation() {
		this.userData.loadHomeData().then(data=>{
			if(data){
				this.user = data.user;
			}
		});
	}

	ionViewDidLoad() {
	}

}
