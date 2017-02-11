import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ServerHttp } from './server-http';
import { UserData } from './user-data';

import { Remote, RemoteServer } from '../models/remote';

/*
  Generated class for the RemoteData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RemoteData {

	constructor(
		public http: Http,
		public serverHttp: ServerHttp,
		public userData: UserData
	) {



	}

	getRemoteServers(): Promise<Remote> {
		return this.serverHttp.get('device/' + this.userData.user.name)
			.then(res => {
				if (res && res.result) {
					return new Remote(res.data);
				}
				else {
					return null;
				}
			});
	}

	getRemoteServerTorrents(remoteServer:RemoteServer): Promise<RemoteServer> {
		return this.serverHttp.get('torrent/' + this.userData.user.name + '/' + remoteServer.id)
		.then(res=>{
			console.log(res);
			remoteServer.loadTorrents(res.data);
			return remoteServer;
		});
	}

	postRemoteServerTorrent(data:{torrent:string, server:string, target?:string}){
		return this.serverHttp.post(
			'torrent/'+this.userData.user.name + '/' + data.server,
			{
				torrent: data.torrent,
				target: data.target
			}
		);
	}

}
