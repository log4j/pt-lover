import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ForumTopic, Forum, ForumSection, ForumMessage } from '../models/forum';

import { WebHttp } from './web-http';
/*
  Generated class for the ForumData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ForumData {

	constructor(
		public http: Http,
		public webHttp: WebHttp,
	) {
		console.log('Hello ForumData Provider');
	}


	loadForumHome(): Promise<ForumSection> {
		return this.webHttp.get('forums.php').then(data => {
			// console.log(data);
			// torrent.loadDetail(data, this.webHttp);
			let section = new ForumSection();
			section.loadData(data, this.webHttp);
			return section;
		});
	}

	loadForumTopicList(forum: Forum, option?: { next?: boolean, forceClear?: boolean }): Promise<Forum> {
		let fetchUrl = 'forums.php' + forum.url;
		if (option && option.next) {
			fetchUrl += '&page=' + (forum.page + 1);
		}
		return this.webHttp.get(fetchUrl).then(data => {
			forum.loadTopicList(data, this.webHttp, option && option.forceClear);
			if (option && option.next) {
				forum.page++;
			} else {
				forum.page = 0;
			}
			return forum;
		})
	}

	loadForumTopicMessages(topic: ForumTopic, option?: { next?: boolean, previous?: boolean, first?: boolean, last?: boolean }): Promise<ForumTopic> {
		let fetchUrl = 'forums.php' + topic.url;
		let page = topic.page;
		if (option) {
			if (option.next && page < topic.maxPage) {
				page++;
			}

			else if (option.previous && page > 0) {
				page--;
			}

			if (option.first) {
				page = 0;
			}

			if (option.last) {
				page = topic.maxPage;
			}



		}
		fetchUrl += '&page=' + page;
		console.log(fetchUrl);
		return this.webHttp.get(fetchUrl).then(data => {
			topic.loadMessages(data, this.webHttp);
			topic.setPage(page);
			// topic.page = page;
			return topic;
		})
	}

	postTopic(forum: Forum, subject: string, content: string) {
		let body = {
			'id': forum.id,
			'type': 'new',
			'subject': subject,
			'body': content
		};

		console.log(forum, body);

		// if(userId){
		// body.shbox_text = +text;
		// }
		return this.webHttp.post('forums.php?action=post', body).then(data => {
			console.log(data);
			//this data is the html for new topic content,
			let topic = new ForumTopic();
			topic.loadMessages(data, this.webHttp);

			if (topic.id) {
				//posted!!
				//still need to reload current forum(topic list)
				return this.loadForumTopicList(forum, { forceClear: true }).then(forumData => {
					return topic.id;
				});
			} else {
				return null;
			}


		})
	}

	postReply(topic: ForumTopic, content: string, comment?: ForumMessage) {
		let body = {
			'id': topic.id,
			'type': 'reply',
			'body': comment ? ('[quote=[@' + comment.userName + ']]' + comment.getQuoteString() + '[/quote]' + content) : content
		};

		return this.webHttp.post('forums.php?action=post', body).then(data => {
			// console.log(data);

			return topic.loadLastPageMessage(data, this.webHttp);

			// return data;
		})
	}

	postRewardViaForum(msg: ForumMessage, amount: number) : Promise<{result:boolean,err?: any}> {
		let body = {
			postid: msg.id,
			rewards: amount
		}

		return this.webHttp.post('postreward.php', body).then(data => {
			console.log(data);

			let error = this.webHttp.findElement(data, (item) => {
				return item.tagName === 'td' && item.children && item.children.length && item.children[0].tagName === 'h2' && item.children[0].text === 'Error';
			})

			if (error) {
				return { result: false, err: this.webHttp.findElement(error, (item => { return item.tagName === 'td' && item.class === 'text' })).text };
			} else {
				return { result: true };
			}


		});

	}

	loadForumSection(forum: Forum, option?: { next?: boolean }) {

	}

}
