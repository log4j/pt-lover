import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { WebHttp } from './web-http';
import { User } from '../models/user';
import { NoticeList } from '../models/notice';
import { MessageList } from '../models/message';
import { QuestionSet } from '../models/question';

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

	questionSet: QuestionSet;

	checkcode: string = '';
	checkcodeNeeded: boolean = true;
	checkcodeUrl: string = '';



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

	prepareLogin(): any {
		return this.webHttp.get('login.php').then(data => {
			if (data) {
				this.checkcodeNeeded = false;
				this.checkcodeUrl = '';
				this.checkcode = '';
				let checkcode = this.webHttp.findElement(data, item => {
					return item.tagName === 'input' && item.name === 'checkcode';
				});
				if (checkcode.value) {
					//already has value, no check needed
					this.checkcode = checkcode.value;
				} else {
					//need checkcode!!!
					let checkCodeImg = this.webHttp.findElement(data, item => {
						return item.tagName === 'img' && item.alt === '验证码';
					});
					console.log(checkCodeImg);
					if (checkCodeImg) {
						this.checkcodeUrl = this.webHttp.host + checkCodeImg.src;
						this.checkcodeNeeded = true;
					}
				}

				return {
					checkcodeNeeded: this.checkcodeNeeded,
					checkcodeUrl: this.checkcodeUrl,
					checkcode: this.checkcode
				}
			} else {
				return null;
			}
		});
	}

	login(username: string, password: string, checkcode?: string): any {
		let body = {
			'username': username,
			'password': password,
			'checkcode': this.checkcode
		}

		if (checkcode) {
			body.checkcode = checkcode;
		}

		let url = 'takelogin.php';
		// let url = 'http://localhost:8080/https://pt.sjtu.edu.cn/takelogin.php';

		return this.webHttp.post(url, body).then(data => {
			// console.log(data);
			if (data) {
				let errorWord = this.webHttp.findElement(data, item => {
					return item.text === '登录失败！';
				})
				console.log(errorWord);


				if (errorWord && errorWord.tagName) {

					let checkcodeError = this.webHttp.findElement(data, item => {
						return item.tagName === 'td' && item.text && item.text.indexOf('请输入正确的验证码') >= 0
					});
					console.log(checkcodeError);
					if (checkcodeError && checkcodeError.tagName) {
						return { user: null, error: '请输入正确的验证码!' };
					} else {
						return { user: null, error: '用户名或密码不正确!或者你还没有通过验证!' };
					}

				} else {
					return this.parseIndexPage(data);
				}
			} else {
				return { user: null, error: '无法连接到葡萄服务器,请稍后尝试...' };
			}



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

	shout(text: string, userId?: string) {
		let body = {
			'shbox_text': (userId ? ('[reply:' + userId + ']:') : '') + text,
			'shout': '我喊',
			'action': 'add'
		};

		// if(userId){
		// body.shbox_text = +text;
		// }
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
			return true;
		})
	};

	parseIndexPage(data: any): any {
		let body = this.webHttp.findElement(data, item => {
			return item.tagName === 'table' && item.id === "userbar";
		});

		let noticeData = this.webHttp.findElement(data, item => {
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

		let mid = '0';
		if (this.messageList && this.messageList.messages.length > 0) {
			mid = this.messageList.messages[0].id;
		}

		return this.webHttp.getJson('shoutboxnew.php?action=show&mid=' + mid).then(data => {
			// return this.webHttp.getJson('assets/data/pages/shoutboxnew.json').then(data=>{
			// console.log(data);
			let list = new MessageList(data);
			if (this.messageList) {
				//append to front
				list.append(this.messageList.messages);
			}

			this.messageList = list;

			return this.messageList;
		})
	}

	loadQuestions(): Promise<QuestionSet> {

		if (this.questionSet) {
			return new Promise<QuestionSet>(resolve => {
				resolve(this.questionSet);
			})
		}
		else
			return this.webHttp.get('faq.php').then(data => {
				let questionSet = new QuestionSet();
				questionSet.updateQuestions(data, this.webHttp);
				this.questionSet = questionSet;
				return questionSet;
			});

	}


}
