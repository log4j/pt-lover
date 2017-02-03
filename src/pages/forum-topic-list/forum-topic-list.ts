import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content } from 'ionic-angular';


import { ForumData } from '../../providers/forum-data';


import { Forum } from '../../models/forum';


import { ForumTopicPage } from '../forum-topic/forum-topic';
import { ForumTopicPostPage } from '../forum-topic-post/forum-topic-post';

/*
  Generated class for the ForumTopicList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-forum-topic-list',
	templateUrl: 'forum-topic-list.html'
})
export class ForumTopicListPage {

	@ViewChild(Content) content: Content;

	forum: Forum;
	isLoading: boolean = true;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public forumData: ForumData,
		public modalCtrl: ModalController
	) {

		this.forum = this.navParams.data.forum;

		this.forum.topics = [];

		this.forumData.loadForumTopicList(this.forum,{forceClear:true}).then(data => {
			console.log(data);
			this.forum = data;
			this.isLoading = false;
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ForumTopicListPage');
	}

	postTopic() {

	}

	showTopicPost() {
		let modal = this.modalCtrl.create(ForumTopicPostPage, this.forum);
		modal.present();

		modal.onWillDismiss((data: any) => {
			if (data) {
				//data is the id of topic just created!!
				this.forum.topics.forEach(item=>{
					if(item.id === data){
						this.content.scrollToTop();
						this.openTopic(item);
						return;
					}
				});
			}
		});
	}

	openTopic(topic) {
		this.navCtrl.push(ForumTopicPage, { topic: topic });
	}

	doInfinite(infiniteScroll) {

		this.forumData.loadForumTopicList(this.forum, { next: true }).then(data => {
			if (data) {
				infiniteScroll.complete();
			} else {
				infiniteScroll.enable(false);
			}
		});

	}

}
