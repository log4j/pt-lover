import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RemoteData } from '../../providers/remote-data';
import { Remote, RemoteServer } from '../../models/remote'

/*
  Generated class for the RemoteServer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-remote-server',
	templateUrl: 'remote-server.html'
})
export class RemoteServerPage {
	server: RemoteServer;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public remoteData:RemoteData
	) {

		this.server = this.navParams.data.server;

	 }

	ionViewDidLoad() {
		console.log('ionViewDidLoad RemoteServerPage');

		this.loadTorrentList().then(res=>{
			console.log(this.server);
		});
	}

	loadTorrentList(){
		return this.remoteData.getRemoteServerTorrents(this.server);
	}

}
