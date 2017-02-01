import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, Loading, LoadingController, AlertController } from 'ionic-angular';

import { ForumData } from '../../providers/forum-data';
import { ForumTopic, ForumMessage } from '../../models/forum';
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

	loader: Loading;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public forumData: ForumData,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController
	) {

		this.topic = this.navParams.data.topic;

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
								console.log(res);
								this.hideLoading();
								console.log(this.topic);
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
	}

}
