import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { ForumData } from '../../providers/forum-data';


import { Forum } from '../../models/forum';

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
	forum: Forum;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public forumData: ForumData
	) {

		this.forum = this.navParams.data.forum;

		this.forumData.loadForumTopicList(this.forum).then(data => {
			console.log(data);
			this.forum = data;
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ForumTopicListPage');
	}

}
