import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { ForumData } from '../../providers/forum-data';

import { ForumSection } from '../../models/forum';

import { ForumTopicListPage } from '../forum-topic-list/forum-topic-list';

/*
  Generated class for the ForumList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-forum-list',
	templateUrl: 'forum-list.html'
})
export class ForumListPage {
	forumSection: ForumSection;
	isLoading: boolean = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public forumData: ForumData
	) {

		this.forumSection = new ForumSection();

	}
	ionViewDidLoad() {
		console.log('forum list load');
		this.forumData.loadForumHome().then(data => {
			this.forumSection = data;
			this.isLoading = false;
		});
	}

	openForum(forum) {
		this.navCtrl.push(ForumTopicListPage, { forum: forum });
	}

}
