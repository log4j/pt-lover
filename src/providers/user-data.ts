import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { WebHttp } from './web-http';
import { User } from '../models/user';
import { NoticeList } from '../models/notice';
import { MessageList } from '../models/message';

/*
  Generated class for the UserData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserData {
	_favorites = [];
	HAS_LOGGED_IN = 'hasLoggedIn';
	HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

	user: User;
	noticeList: NoticeList;
	messageList: MessageList;

	constructor(
		public events: Events,
		public storage: Storage,
		public http: Http,
		public webHttp: WebHttp
	) { }

	hasFavorite(sessionName) {
		return (this._favorites.indexOf(sessionName) > -1);
	};

	addFavorite(sessionName) {
		this._favorites.push(sessionName);
	};

	removeFavorite(sessionName) {
		let index = this._favorites.indexOf(sessionName);
		if (index > -1) {
			this._favorites.splice(index, 1);
		}
	};

	// login(username) {
	// 	this.storage.set(this.HAS_LOGGED_IN, true);
	// 	this.setUsername(username);
	// 	this.events.publish('user:login');
	// };

	login(): any {
		let body = {
			'username': 'yangmang',
			'password': 'mission',
			'checkcode': 'XxXx'
		}

		let url = 'takelogin.php';
		// let url = 'http://localhost:8080/https://pt.sjtu.edu.cn/takelogin.php';

		return this.webHttp.post(url, body).then(data => {
			return this.parseIndexPage(data);
		})
	}

	signup(username) {
		this.storage.set(this.HAS_LOGGED_IN, true);
		this.setUsername(username);
		this.events.publish('user:signup');
	};

	logout() {
		return this.webHttp.get(this.user.logOutLink).then(data => {
			this.storage.remove(this.HAS_LOGGED_IN);
			this.storage.remove('username');
			this.events.publish('user:logout');
			this.user = null;
			this.noticeList = null;
			this.messageList = null;
			return data;
		})
	};

	shout(text:string){
		let body = {
			'shbox_text': text,
			'shout': '我喊',
			'action': 'add'
		};

		return this.webHttp.post('shoutboxnew.php', body).then(data => {

			console.log(data);
			return data;
		})
	}

	setUsername(username) {
		this.storage.set('username', username);
	};

	getUsername() {
		return this.storage.get('username').then((value) => {
			return value;
		});
	};

	// return a promise
	hasLoggedIn() {
		return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
			return value === true;
		});
	};

	checkHasSeenTutorial() {
		return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
			return value;
		})
	};

	parseIndexPage(data: any): any {
		let body = this.webHttp.fintElement(data, item => {
			return item.tagName === 'table' && item.id === "userbar";
		});

		let noticeData = this.webHttp.fintElement(data, item => {
			return item.tagName === 'td' && item.children && item.children.length >= 2 && item.children[0].text === '最新公告';
		});

		this.user = new User(body);
		this.noticeList = new NoticeList(noticeData);

		return { user: this.user, notices: this.noticeList };
	}

	loadHomeData(): Promise<{ user: User, notices: NoticeList }> {
		if (this.user) {
			return new Promise<{ user: User, notices: NoticeList }>(resolve => resolve({ user: this.user, notices: this.noticeList }));
		} else {
			// return this.webHttp.get('http://pt.test/index.php').then(data => {
				return this.webHttp.get('index.php').then(data => {
				if (data) {
					//already in
					return this.parseIndexPage(data);
				} else {
					//require login!!
					//pop login page


					return null;
				}


			})
		}
	}

	loadMessages(): Promise<MessageList> {
		if (this.messageList) {
			return new Promise<MessageList>(resolve => resolve(this.messageList));
		} else {
			return this.webHttp.getJson('shoutboxnew.php?action=show&mid=0').then(data => {
				// return this.webHttp.getJson('assets/data/pages/shoutboxnew.json').then(data=>{
				// console.log(data);
				let list = new MessageList(data);
				return list;
			})
		}
	}

}
