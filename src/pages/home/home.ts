import { Component, ViewChild } from '@angular/core';
import { TorrentData } from '../../providers/torrent-data';
import { UserData } from '../../providers/user-data';
import { NavController, LoadingController, ModalController, Slides, Content, AlertController, Events, Refresher, Loading } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { Notice } from '../../models/notice';
import { Message } from '../../models/message';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	// @ViewChild(Slides) slides: Slides;
	@ViewChild(Content) content: Content;

	@ViewChild(Refresher) refresher: Refresher;

	segment = 'notice';
	notices: Notice[] = [];
	messages: Message[] = [];

	loader: Loading;


	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public alertCtrl: AlertController,
		public torrentData: TorrentData,
		public userData: UserData,
		public events: Events
	) {

		// this.loadHomePageData();

		// this.showLoading();
		// loader.present();

	}

	ngAfterViewInit() {
		console.log('start!!!');
		// this.refresher.
		this.refresher._beginRefresh();
		this.showLoading();
	}

	loadHomePageData() {

		//first check if logged!


		return this.userData.loadHomeData().then(data => {

			if (data && data.user.name) {

				// alert(data.user.name);

				this.notices = data.notices.notices;

				this.events.publish('user:login', data.user, Date.now());

				// this.loadChatData();


			} else {
				//show login modal
				let modal = this.modalCtrl.create(LoginPage,{},{enableBackdropDismiss:true});
				modal.onDidDismiss(data => {
					if (data && data.user && data.notices) {
						this.notices = data.notices.notices;

						this.events.publish('user:login', data.user, Date.now());

						this.loadChatData();
					}
				})
				modal.present();
			}

			return data;
		})

	}

	loadChatData() {
		return this.userData.loadMessages().then(data => {
			this.messages = data.messages;
			return data;
		});
	}

	updateSegment() {
		// console.log('update', this.segment);
		if (this.segment === 'notice'){

		} else if(this.segment === 'chat'){
			if(this.messages === null || this.messages.length==0){
				this.refresher._beginRefresh();
				this.showLoading();
			}
		}
		// 	this.slides.slideTo(0);
		// else
		// 	this.slides.slideTo(1);

		// this.content.scrollToBottom();

	}

	showLoading(){
		this.loader = this.loadingCtrl.create({
			content: "正在载入, 请稍等..."
		});
		this.loader.present();
	}

	hideLoading(){
		if(this.loader){
			this.loader.dismiss();
		}
	}

	slideChanged() {
		// console.log('change@@@@@');

		// let index = this.slides.getActiveIndex();
		// console.log(index);
		// if (index == 0) {
		// 	this.segment === 'notice';
		// } else {
		// 	this.segment === 'chat';
		// }
	}

	tapEvent(event) {
		alert(event);
		console.log(event);
	}

	doRefresh(refresher) {

		if (this.segment === 'chat') {
			this.loadChatData().then(data => {
				if (this.loader)
					this.loader.dismiss();
				refresher.complete();
			})
		} else {

			this.loadHomePageData().then(data => {
				if (this.loader)
					this.loader.dismiss();
				refresher.complete();
			})
		}

	}


	showMessagePrompt(message?: Message) {
		let prompt = this.alertCtrl.create({
			title: '发送信息',
			message: "",
			inputs: [
				{
					name: 'message',
					placeholder: message ? '回复' + message.name + ':' : ''
				},
			],
			buttons: [
				{
					text: '取消',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: '发送',
					handler: data => {
						console.log('Saved clicked',data);

						this.showLoading();
						this.userData.shout(data.message,message?message.userId:null).then(res=>{
							console.log(res);
							this.loadChatData().then(loadData=>{
								this.hideLoading()
							});
						})

					}
				}
			]
		});
		prompt.present();
	}
}
