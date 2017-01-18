import { Component } from '@angular/core';
import { NavController,ViewController, NavParams,LoadingController } from 'ionic-angular';


import { UserData } from '../../providers/user-data';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public userData: UserData,
		public viewCtrl: ViewController,
		public loadingCtrl: LoadingController
	) { }

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	login() {


		let loader = this.loadingCtrl.create({
			content: "正在验证, 请稍等..."
		});
		loader.present();

		this.userData.login().then(data=>{

			loader.dismiss();

			// console.log(data);
			this.viewCtrl.dismiss(data);
		});
	}

}
