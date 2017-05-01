import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RewardOptions page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-reward-options',
	templateUrl: 'reward-options.html',
})
export class RewardOptions {

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController
	) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RewardOptions');
	}

	select(amount) {
		console.log(amount);

		this.viewCtrl.dismiss(amount);
	}



}
