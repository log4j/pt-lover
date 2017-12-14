import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ToastController, Loading, LoadingController, AlertController, PopoverController } from 'ionic-angular';

import { ForumData } from '../../providers/forum-data';
import { UserData } from '../../providers/user-data';
import { User } from '../../models/user';
import { ForumTopic, ForumMessage } from '../../models/forum';
import { RewardOptions } from '../reward-options/reward-options';
/*
  Generated class for the ForumTopic page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-forum-topic',
	templateUrl: 'forum-topic.html'
})
export class ForumTopicPage {
	@ViewChild(Content) content: Content;

	topic: ForumTopic;
	isLoading: boolean = false;
	user: User;
	loader: Loading;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public forumData: ForumData,
		public userData: UserData,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public popoverCtrl: PopoverController,
		public toastCtrl: ToastController
	) {

		this.topic = this.navParams.data.topic;
		this.user = this.userData.user;

		this.loadTopicMessages();

	}

	loadTopicMessages() {
		this.isLoading = true;
		return this.forumData.loadForumTopicMessages(this.topic).then(data => {
			this.isLoading = false;
			// console.log(data);
			return data;
		})
	}

	showLoading() {
		this.loader = this.loadingCtrl.create({
			content: "正在载入, 请稍等..."
		});
		this.loader.present();
	}

	hideLoading() {
		if (this.loader) {
			this.loader.dismiss();
		}
	}

	postComment(comment?: ForumMessage, fab?) {
		// console.log(comment);

		if (fab) {
			fab.close();
		}

		let message = "";
		if (comment) {
			message = "引用" + comment.userName + "的评论:\"" + comment.getQuoteString() + "\"";
		}
		let prompt = this.alertCtrl.create({
			title: '添加评论',
			message: message,
			inputs: [
				{
					name: 'message',
					placeholder: '添加评论'
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
					text: '评论',
					handler: data => {
						console.log('Saved clicked', data);


						if (data && data.message) {

							this.showLoading();
							this.forumData.postReply(this.topic, data.message, comment).then(res => {
								this.hideLoading();
								setTimeout(() => {
									this.content.scrollToBottom();
								}, 500);
								// this.loadTopicMessages();
							});
							// this.torrentData.postTorrentComment(body).then(res=>{
							// 	this.loadComments().then(comms=>{
							// 		this.hideLoading()
							// 	});
							// });
						}


						// 
						// this.userData.shout(data.message,message?message.userId:null).then(res=>{
						// 	console.log(res);
						// 	this.loadChatData().then(loadData=>{
						// 		
						// 	});
						// })

					}
				}
			]
		});
		prompt.present();
	}

	previousPage(fab) {
		fab.close();
		this.isLoading = true;
		this.forumData.loadForumTopicMessages(this.topic, { previous: true }).then(data => {
			this.isLoading = false;
			this.content.scrollToTop();
		})
	}

	nextPage(fab) {
		fab.close();
		this.isLoading = true;
		this.forumData.loadForumTopicMessages(this.topic, { next: true }).then(data => {
			this.isLoading = false;
			this.content.scrollToTop();
		})
	}

	firstPage(fab) {
		fab.close();
		this.isLoading = true;
		this.forumData.loadForumTopicMessages(this.topic, { first: true }).then(data => {
			this.isLoading = false;
			this.content.scrollToTop();
		})
	}

	lastPage(fab) {
		fab.close();
		this.isLoading = true;
		this.forumData.loadForumTopicMessages(this.topic, { last: true }).then(data => {
			this.isLoading = false;
			this.content.scrollToTop();
		})
	}


	ionViewDidLoad() {
		console.log('ionViewDidLoad ForumTopicPage');
		console.log(this.user);
	}

	postRewardSheet($event, comment) {
		console.log(comment);
		let popover = this.popoverCtrl.create(RewardOptions);
		popover.onDidDismiss((amount) => {
			if (amount) {
				this.isLoading = true;
				this.forumData.postRewardViaForum(comment, amount).then((data: { result: boolean, err?: any }) => {
					this.isLoading = false;
					if (data && data.result) {
						this.toastCtrl.create({
							message: '魔力已送出',
							duration: 2000,
							position: 'top'
						}).present();
					} else {
						this.toastCtrl.create({
							message: '魔力发送失败,' + data.err,
							duration: 2000,
							position: 'top'
						}).present();
					}

				})
			}

		});
		popover.present({
			ev: $event
		});
	}

}
