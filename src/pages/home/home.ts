import { Component, ViewChild } from '@angular/core';
import { TorrentData } from '../../providers/torrent-data';
import { UserData } from '../../providers/user-data';
import { NavController, LoadingController, ModalController, Slides } from 'ionic-angular';

import {LoginPage} from '../login/login';

import {Notice} from '../../models/notice';
import {Message} from '../../models/message';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	@ViewChild(Slides) slides: Slides;

	segment = 'notice';
	notices: Notice[] = [];
	messages: Message[] = [];
	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public torrentData: TorrentData,
		public userData: UserData
	) {

		this.loadHomePageData();

		this.loadChatData();

	}


	loadHomePageData() {

		//first check if logged!
		let loader = this.loadingCtrl.create({
			content: "正在载入, 请稍等..."
		});
		loader.present();

		this.userData.loadHomeData().then(data => {

			loader.dismiss();
			
			if (data) {
				this.notices = data.notices.notices;
			} else {
				//show login modal
				let modal = this.modalCtrl.create(LoginPage);
				modal.present();
			}
		})

	}

	loadChatData() {
		this.userData.loadMessages().then(data=>{
			console.log(data);
			this.messages = data.messages;
		});
	}

	updateSegment(){
		console.log('update', this.segment);
		if(this.segment==='notice')
			this.slides.slideTo(0);
		else
			this.slides.slideTo(1);
	}

	slideChanged(){
		// console.log('change@@@@@');

		let index = this.slides.getActiveIndex();
		console.log(index);
		if(index==0){
			this.segment === 'notice';
		}else{
			this.segment === 'chat';
		}
	}

	tapEvent(event){
		alert(event);
		console.log(event);
	}
}
