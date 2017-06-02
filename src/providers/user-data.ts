import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { WebHttp } from './web-http';
import { ServerHttp } from './server-http';
import { User } from '../models/user';
import { NoticeList } from '../models/notice';
import { MessageList } from '../models/message';
import { QuestionSet } from '../models/question';


import { Device } from '@ionic-native/device';
import { StatusBar } from '@ionic-native/status-bar';

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

	greenMode: boolean = false;



	constructor(
		public events: Events,
		public storage: Storage,
		public http: Http,
		public webHttp: WebHttp,
		public serverHttp: ServerHttp,
		private device: Device,
		private statusBar: StatusBar
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

		let releaseDate = new Date(2017, 5, 8);
		let today = new Date();
		let days = (releaseDate.getTime() - today.getTime());
		console.log(days, days / (1000 * 60 * 60 * 24));
		//check user and date
		if (this.user.name !== 'yangmang' && days < 0) {
			this.greenMode = false;
		}

		return { user: this.user, notices: this.noticeList };
	}

	loadHomeData(): Promise<{ user: User, notices: NoticeList }> {
		if (this.user) {
			return new Promise<{ user: User, notices: NoticeList }>(resolve => resolve({ user: this.user, notices: this.noticeList }));
		} else {
			// return this.webHttp.get('http://pt.test/index.php').then(data => {
			return this.webHttp.get('index.php').then(data => {
				if (data) {

					this.fecthLatestSplash();
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

			let list = new MessageList(data);

			if (this.greenMode) {
				if (list.messages && list.messages.length) {
					for (let i = list.messages.length - 1; i--; i >= 0) {
						if (list.messages[i].name === '葡萄娘'
							|| list.messages[i].content.indexOf('美国') >= 0
							|| list.messages[i].content.indexOf('米国') >= 0
							|| list.messages[i].content.indexOf('美帝') >= 0
							|| list.messages[i].content.indexOf('米帝') >= 0
							|| list.messages[i].content.indexOf('PT') >= 0
							|| list.messages[i].content.indexOf('BT') >= 0
						) {
							list.messages.splice(i, 1);
						}
					}
				}

			}
			if (this.messageList) {
				//append to front
				list.append(this.messageList.messages);
			}

			this.messageList = list;

			return this.messageList;
		})
	}

	loadQuestions(): Promise<QuestionSet> {
		this.questionSet = null;
		if (this.questionSet) {
			return new Promise<QuestionSet>(resolve => {
				return resolve(this.questionSet);
			});
		}
		else
			return this.webHttp.get('faq.php', true).then(data => {
				let questionSet = new QuestionSet();
				questionSet.updateQuestions(data, this.webHttp);
				this.questionSet = questionSet;
				return questionSet;
			});

	}

	fecthLatestSplash(): Promise<any> {
		return new Promise<any>(resolve => {
			return this.serverHttp.post('splash', { id: localStorage.getItem('splashId') }).then(data => {
				console.log(data);

				if (data && data.result && data.data) {
					localStorage.setItem('splashId', data.data.id);
					localStorage.setItem('splash', data.data.data);
				}

				return resolve(data);
			})
		});
	}



	loadThemeSetting() {
		return new Promise<string>(resolve => {
			switch (localStorage.getItem('theme')) {
				case ('theme-default'):
					// if(this.device.platform === 'ios'){

					// }
					this.statusBar.styleDefault();
					if (this.device.platform == 'android') {
						this.statusBar.backgroundColorByHexString("#DDDEDE");
					}
					break;

				case ('theme-dark'):

					this.statusBar.styleBlackTranslucent();

					if (this.device.platform == 'android') {
						this.statusBar.backgroundColorByHexString("#353A3D");
					}
					break;
			}

			return resolve(localStorage.getItem('theme'));
		});
	}
}
