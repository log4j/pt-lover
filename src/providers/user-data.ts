import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { WebHttp } from './web-http';
import {User} from '../models/user';

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

	login(username) {
		this.storage.set(this.HAS_LOGGED_IN, true);
		this.setUsername(username);
		this.events.publish('user:login');
	};

	signup(username) {
		this.storage.set(this.HAS_LOGGED_IN, true);
		this.setUsername(username);
		this.events.publish('user:signup');
	};

	logout() {
		this.storage.remove(this.HAS_LOGGED_IN);
		this.storage.remove('username');
		this.events.publish('user:logout');
	};

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

	loadHomeData():Promise<User>{
		if(this.user){
			return new Promise<User>(resolve=>resolve(this.user));
		}else{
			// return this.webHttp.get('http://pt.test/index.php').then(data=>{
			return this.webHttp.get('assets/data/pages/index.html').then(data=>{


				



				if(data){
					//already in
					let body = this.webHttp.fintElement(data, item=>{
						return item.tagName==='table' && item.id==="userbar";
					});
					return new User(body);
				}else{
					//require login!!
					//pop login page


					return null;
				}

				
			})
		}
	}

}
