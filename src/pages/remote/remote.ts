import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { RemoteData } from '../../providers/remote-data';

import { RemoteServerPage } from '../remote-server/remote-server';

import {Remote, RemoteServer} from '../../models/remote'

/*
  Generated class for the Remote page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-remote',
	templateUrl: 'remote.html'
})
export class RemotePage {

	remote: Remote;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public remoteData: RemoteData
	) { }

	ionViewDidLoad() {
		console.log('ionViewDidLoad RemotePage');


		
		this.loadRemoteServers();
	}

	loadRemoteServers(){
		return this.remoteData.getRemoteServers().then(res=>{
			console.log(res);
			this.remote = res;
			return this.remote;
		})
	}

	loadRemoteServerTorrents(server:RemoteServer){
		return this.remoteData.getRemoteServerTorrents(server);
	}

	openServerPage(server:RemoteServer){
		//RemoteServerPage
		this.navCtrl.push(RemoteServerPage, { server: server });
	}

}
