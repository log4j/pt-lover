import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

// import * as Parser from "htmlparser2";

import { Comment, Torrent, TorrentList } from '../models/torrent';

import { WebHttp } from './web-http';

/*
  Generated class for the TorrentData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TorrentData {

	data: any;

	types: any[];

	torrentList: TorrentList;

	SETTING_ENABLE_HOT = 'SETTING_ENABLE_HOT';
	SETTING_ENABLE_TOP = 'SETTING_ENABLE_TOP';
	SETTING_SHOW_AVATAR = 'SETTING_SHOW_AVATAR';

	enableHot: boolean = true;
	enableTop: boolean = true;
	showAvatar: boolean = true;

	constructor(
		public http: Http,
		public webHttp: WebHttp,
		public storage: Storage
	) {

		this.getTypes();
		this.loadSettingsFromStorage();
		// this.loadTorrentPage();
	}

	load(): any {
		if (this.data) {
			return Observable.of(this.data);
		} else {
			return this.http.get('assets/data/torrent-data.json')
				.map(this.processData);
		}
	}

	loadSettingsFromStorage() {
		this.storage.get(this.SETTING_ENABLE_HOT).then(value => {
			if (value != undefined) {
				this.enableHot = value;
			}
		});

		this.storage.get(this.SETTING_ENABLE_TOP).then(value => {
			if (value != undefined) {
				this.enableTop = value;
			}
		});

		this.storage.get(this.SETTING_SHOW_AVATAR).then(value => {
			if (value != undefined) {
				this.showAvatar = value;
			}
		});

	}

	saveSettingFromStorage() {
		this.storage.set(this.SETTING_ENABLE_HOT, this.enableHot);
		this.storage.set(this.SETTING_ENABLE_TOP, this.enableTop);
		this.storage.set(this.SETTING_SHOW_AVATAR, this.showAvatar);
	}

	saveFilterData(options: any) {

		if (options.enableHot != undefined)
			this.enableHot = options.enableHot;

		if (options.enableTop != undefined)
			this.enableTop = options.enableTop;

		if (options.showAvatar != undefined)
			this.showAvatar = options.showAvatar;
		// this.enableTop = enableTop;
		this.saveSettingFromStorage();
	}

	processData(data) {
		this.data = data.json();

		return this.data;
	}

	getTypes(): any {
		if (this.types && this.types.length) {
			return Observable.of(this.types);
		} else {
			return this.http.get('assets/data/torrent-type.json')
				.map(data => {
					this.types = data.json();
					return this.types;
				})
		}
	}


	loadTorrentPage(force?: boolean, options?: { next?: boolean, keyword?: string }): Promise<TorrentList> {
		if (this.torrentList && (!force)) {
			return new Promise<TorrentList>(resolve => resolve(this.torrentList));
		}
		else {
			// return this.webHttp.get('http://pt.test/torrents.php').then(data => {

			let paras = '';
			if (options) {
				if (options.next) {
					paras += '&page=' + (this.torrentList ? (this.torrentList.page + 1) : 0);
				}
				if (options.keyword) {
					paras += '&search=' + options.keyword;
				}
			}
			return this.webHttp.get('torrents.php' + (paras ? "?" + paras : paras)).then(data => {

				// let types = this.webHttp.findElement(data, item=>{
				// 	return item.tagName==='tr' && item.id==='kAdvsearch';
				// })
				// if(types){
				// 	console.log(types);
				// 	let strs = '[';
				// 	types.children["0"].children["0"].children.forEach(row=>{
				// 		if(row.children){
				// 			row.children.forEach(item=>{
				// 				// console.log(item);
				// 				if(item.children && item.children.length==2){
				// 					// console.log(item.children[0], item.children[1]);
				// 					strs+='{ label:"'+item.children[1].title+'",value:"'+item.children[0].name+'"},';
				// 				}
				// 			})
				// 		}
				// 	});
				// 	strs+=']';
				// 	console.log(strs);
				// }


				//find table.torrents
				let table = this.webHttp.findElement(data, item => {
					return (item.tagName == 'table' && item.class == 'torrents');
				});
				let torrent = new TorrentList(table.children);
				let keyword = (options && options.keyword) ? options.keyword : '';


				//determin when to append!!: only when options.next
				if (this.torrentList && options && options.next) {
					torrent.list.forEach(item => this.torrentList.list.push(item));
					this.torrentList.page++;
				} else {
					torrent.page = 0;
					torrent.keyword = keyword;
					this.torrentList = torrent;
					this.torrentList.sortByRules(this.enableHot, this.enableTop);
				}

				return this.torrentList;
			});
		}

	}


	loadTorrentDatail(torrent: Torrent) {
		if (torrent.basicInfos.length) {
			return new Promise<Torrent>(resolve => resolve(torrent));
		} else {
			return this.webHttp.get('details.php?id=' + torrent.id).then(data => {
				// console.log(data);
				torrent.loadDetail(data, this.webHttp);
				return torrent;
			});
		}
	}

	loadTorrentComments(torrent: Torrent) {
		return this.webHttp.get('detail_comment.php?id=' + torrent.id).then(data => {
			torrent.loadComments(data, this.webHttp);
			return torrent;
		})
	}

	processTorrentPage(data: any) {

	}


	postTorrentComment(data: { torrent: string, message: string, quote?: Comment }) {
		let body = {
			'pid': data.torrent,
			'color': '0',
			'font': '0',
			'size': '0',
			'body': ((data.quote ? ('[quote=' + data.quote.userName + ']' + data.quote.getQuoteString() + '[/quote]\n') : '')) + data.message,
		};

		console.log(body);

		// if(userId){
		// body.shbox_text = +text;
		// }
		return this.webHttp.post('comment.php?action=add&type=torrent', body).then(data => {
			console.log(data);
			return data;
		})
	}


}
