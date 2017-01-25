import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController, AlertController } from 'ionic-angular';


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

	username: string = '';
	password: string = '';
	checkcode: string = '';
	checkcodeNeeded: boolean = false;
	checkcodeUrl: string = '';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public userData: UserData,
		public viewCtrl: ViewController,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController
	) {


	}

	prepareLogin() {
		let loader = this.loadingCtrl.create({
			content: "正在获取登录信息, 请稍等..."
		});
		loader.present();
		this.userData.prepareLogin().then(data => {
			loader.dismiss();

			if (data) {
				this.checkcodeUrl = data.checkcodeUrl;
				this.checkcodeNeeded = data.checkcodeNeeded;
				this.checkcode = data.checkcode;
			} else {
				let alert = this.alertCtrl.create({
					title: '连接失败!',
					subTitle: '无法连接葡萄服务器,请稍后再试...',
					buttons: ['确定']
				});
				alert.present();
			}

		});
	}

	ionViewDidLoad() {
		this.prepareLogin();
		console.log('ionViewDidLoad LoginPage');
	}

	login() {


		let loader = this.loadingCtrl.create({
			content: "正在验证, 请稍等..."
		});
		loader.present();

		this.userData.login(this.username, this.password, this.checkcode).then(data => {

			loader.dismiss();

			if (data && data.user) {
				// console.log(data);
				this.viewCtrl.dismiss(data);
			} else {
				let alert = this.alertCtrl.create({
					title: '登录失败!',
					subTitle: data.error,
					buttons: ['确定']
				});
				alert.present();
			}

		});
	}

}
