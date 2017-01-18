import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

// import * as Parser from "htmlparser2";

import { Torrent,TorrentList } from '../models/torrent';

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

	enableHot: boolean = true;
	enableTop: boolean = true;

	constructor(
		public http: Http,
		public webHttp: WebHttp,
		public storage: Storage
	) {
		console.log('Hello TorrentData Provider');

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

	}

	saveSettingFromStorage(){
		this.storage.set(this.SETTING_ENABLE_HOT,this.enableHot);
		this.storage.set(this.SETTING_ENABLE_TOP,this.enableTop);
	}

	saveFilterData(enableHot:boolean, enableTop:boolean){
		this.enableHot = enableHot;
		this.enableTop = enableTop;
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


	loadTorrentPage(force?: boolean): Promise<TorrentList> {
		if (this.torrentList && (!force)) {
			return new Promise<TorrentList>(resolve => resolve(this.torrentList));
		}
		else {
			// return this.webHttp.get('http://pt.test/torrents.php').then(data => {
			return this.webHttp.get('torrents.php').then(data => {
				//find table.torrents
				let table = this.webHttp.fintElement(data, item=>{
					return (item.tagName == 'table' && item.class=='torrents');
				});
				this.torrentList = new TorrentList(table.children);
				this.torrentList.sortByRules(this.enableHot, this.enableTop);
				return this.torrentList;
			});
		}

	}


	loadTorrentDatail(torrent:Torrent){
		if(torrent.basicInfos.length){
			return new Promise<Torrent>(resolve => resolve(torrent));
		}else{
			return this.webHttp.get('details.php?id='+torrent.id).then(data =>{
				// console.log(data);
				torrent.loadDetail(data, this.webHttp);
				return torrent;
			});
		}
	}

	processTorrentPage(data: any) {

	}



}
