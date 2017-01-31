import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ForumData } from '../../providers/forum-data';
import { ForumTopic } from '../../models/forum';
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
	topic: ForumTopic;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public forumData: ForumData
	) {

		this.topic = this.navParams.data.topic;

		forumData.loadForumTopicMessages(this.topic).then(data => {
			console.log(data);
			
		})

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ForumTopicPage');
	}

}
