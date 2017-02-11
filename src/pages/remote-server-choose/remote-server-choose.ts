import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';


import { RemoteData } from '../../providers/remote-data';

import {
	FormGroup,
	FormControl

} from '@angular/forms';



import { Remote, RemoteServer } from '../../models/remote';

/*
  Generated class for the RemoteServerChoose page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-remote-server-choose',
	templateUrl: 'remote-server-choose.html'
})
export class RemoteServerChoosePage {

	choice;
	server: RemoteServer;
	remote: Remote;
	torrent: string;
	target: string;
	isUploading: boolean = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public remoteData: RemoteData,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public viewCtrl: ViewController
	) {
		this.loadRemoteServers();
		this.torrent = this.navParams.data.torrent;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RemoteServerChoosePage');
	}


	loadRemoteServers() {
		return this.remoteData.getRemoteServers().then(res => {
			this.remote = res;
			if (this.remote && this.remote.servers && this.remote.servers.length) {
				this.choice = this.remote.servers[0].id;
				this.server = this.remote.servers[0];
			}
			return this.remote;
		})
	}

	choiceChange() {
		console.log(this.choice);
		if (this.remote && this.remote.servers && this.remote.servers.length) {
			this.remote.servers.forEach(item => {
				if (item.id === this.choice)
					this.server = item;
			})
		}

		// this.isUploading = !this.isUploading;
	}
	doRefresh(refresher) {

		this.loadRemoteServers().then(data => {
			this.remote = data;
			refresher.complete();
		})


	}

	dismiss(data?: any) {
		// using the injected ViewController this page
		// can "dismiss" itself and pass back data
		this.viewCtrl.dismiss(data);
	}

	confirm() {
		// this.viewCtrl.dismiss({id: this.choice});
		this.isUploading = true;
		//upload torrent!!!
		this.remoteData.postRemoteServerTorrent({
			torrent: this.torrent,
			server: this.choice,
			target: this.target
		}).then(res => {
			console.log(res);

			this.isUploading = false;

			if (res && res.result) {
				if (res.data.result === 'success') {
					//success!!

					if (res.data.arguments['torrent-add']) {
						//name in  res.data.arguments['torrent-add'].name
						let toast = this.toastCtrl.create({
							message: '下载任务已上传: "' + res.data.arguments['torrent-add'].name + '"',
							duration: 2000
						});
						toast.present();

						this.viewCtrl.dismiss({result:true, id: this.choice});
					}
					else if (res.data.arguments['torrent-duplicate']) {
						let alert = this.alertCtrl.create({
							title: '上传失败',
							subTitle: '种子任务已存在',
							buttons: ['确定']
						});
						alert.present();
					}

				} else {
					//something happened, make a alert
					let alert = this.alertCtrl.create({
						title: '上传失败',
						subTitle: '客户端返回错误提示:' + res.data.result,
						buttons: ['确定']
					});
					alert.present();
				}
			}
			else{
				//something happened, make a alert
				let alert = this.alertCtrl.create({
					title: '上传失败',
					subTitle: '服务器返回错误提示:' + res.err,
					buttons: ['确定']
				});
				alert.present();
			}
		})
	}
}