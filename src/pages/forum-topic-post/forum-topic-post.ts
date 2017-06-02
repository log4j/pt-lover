import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ForumData } from '../../providers/forum-data';

import { Forum } from '../../models/forum';
/*
  Generated class for the ForumTopicPost page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-forum-topic-post',
	templateUrl: 'forum-topic-post.html'
})
export class ForumTopicPostPage {
	forum: Forum;
	title: string;
	content: string;

	@ViewChild('titleInput') titleInput;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public forumData: ForumData) {

		this.forum = navParams.data;



	}

	postTopic() {
		this.forumData.postTopic(this.forum, this.title, this.content).then(data => {
			//should return a id
			if (data) {
				this.viewCtrl.dismiss(data);
			} else {
				//alert: fail!

			}

		});
	}

	dismiss(data?: any) {
		// using the injected ViewController this page
		// can "dismiss" itself and pass back data
		this.viewCtrl.dismiss(data);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ForumTopicPostPage');

		setTimeout(() => {
			this.titleInput.setFocus();
		}, 150);
	}

}
