import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';


import { UserData } from '../../providers/user-data';
import { RemoteData } from '../../providers/remote-data';





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
	noServer: boolean = false;
	isUploading: boolean = false;
	style: string = 'primary';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public remoteData: RemoteData,
		public userData: UserData,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public viewCtrl: ViewController,
		public ngZone: NgZone
	) {
		this.loadRemoteServers();
		this.torrent = this.navParams.data.torrent;

		userData.loadThemeSetting().then(data => {
			if (data === 'theme-default') {
				this.style = 'primary';
			} else {
				this.style = 'light';
			}
		})
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

			if (!(this.remote && this.remote.servers && this.remote.servers.length)) {
				this.noServer = true;
			}
			return this.remote;
		})
	}

	choiceChange() {
		console.log(this.choice);
		if (this.remote && this.remote.servers && this.remote.servers.length) {
			this.remote.servers.forEach(item => {
				if (item.id === this.choice) {
					this.server = item;
					if (this.server.folders && this.server.folders.length) {
						this.target = this.server.folders[0].value;
					} else {
						this.target = '';
					}
				}

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
		this.ngZone.run(() => {
			this.isUploading = true;
		});

		console.log(this.torrent);
		//upload torrent!!!
		this.remoteData.postRemoteServerTorrent({
			torrent: this.torrent,
			server: this.choice,
			target: this.target
		}).then(res => {
			console.log('b============================');
			console.log(res);
			console.log('b============================');
			this.isUploading = true;

			if (res && res.result) {
				if (res.data.result === 'success') {
					//success!!

					console.log('success uploaded!!');
					console.log(JSON.stringify(res.data));
					if (res.data.arguments['torrent-added']) {
						//name in  res.data.arguments['torrent-add'].name
						console.log('start ngZone');
						// this.ngZone.run(() => {
						let toast = this.toastCtrl.create({
							message: '下载任务已上传: "' + res.data.arguments['torrent-added'].name + '"',
							duration: 2000
						});
						toast.present();

						this.viewCtrl.dismiss({ result: true, id: this.choice });
						// })
					}
					else if (res.data.arguments['torrent-duplicate']) {
						let alert = this.alertCtrl.create({
							title: '上传失败',
							subTitle: '种子任务已存在',
							buttons: ['确定']
						});
						alert.present();
						this.isUploading = false;
					}

					else {
						let alert = this.alertCtrl.create({
							title: '上传失败',
							subTitle: '客户端返回错误提示:' + res.data.result,
							buttons: ['确定']
						});
						alert.present();
						this.isUploading = false;
					}

				} else {
					//something happened, make a alert
					let alert = this.alertCtrl.create({
						title: '上传失败',
						subTitle: '客户端返回错误提示:' + res.data.result,
						buttons: ['确定']
					});
					alert.present();
					this.isUploading = false;
				}
			}
			else {
				//something happened, make a alert
				let alert = this.alertCtrl.create({
					title: '上传失败',
					subTitle: '服务器返回错误提示:' + res ? res.err : '',
					buttons: ['确定']
				});
				alert.present();
				this.isUploading = false;
			}
		}, (err) => {
			console.log('--------------');
			console.log(err);
			console.log('--------------');
		})
	}
}
