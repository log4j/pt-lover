import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController, LoadingController,Loading } from 'ionic-angular';

import { TorrentData } from '../../providers/torrent-data';
import { WebHttp } from '../../providers/web-http';
import { Comment, Torrent, TorrentList } from '../../models/torrent';
import { FileOpener } from 'ionic-native';


declare var window: any;
declare var LocalFileSystem: any;
/*
  Generated class for the TorrentDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-torrent-detail',
	templateUrl: 'torrent-detail.html'
})
export class TorrentDetailPage {
	torrent: Torrent;
	isLoadingComment: boolean = false;
	isLoadingDetail: boolean = false;

	showAvatar: boolean = true;

	loader: Loading;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public torrentData: TorrentData,
		public webHttp: WebHttp,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController
	) {

		this.torrent = this.navParams.data.torrent;

		if (this.navParams.data.load === 'detail') {
			this.loadDetail();
		}
		else if (this.navParams.data.load === 'comments') {
			this.loadComments();
		}

		this.showAvatar = this.torrentData.showAvatar;

	}

	ionViewDidLoad() {
	}


	dismiss(data?: any) {
		// using the injected ViewController this page
		// can "dismiss" itself and pass back data
		this.viewCtrl.dismiss(data);
	}


showLoading() {
		this.loader = this.loadingCtrl.create({
			content: "正在载入, 请稍等..."
		});
		this.loader.present();
	}

	hideLoading() {
		if (this.loader) {
			this.loader.dismiss();
		}
	}

	loadComments() {
		this.isLoadingComment = true;
		return this.torrentData.loadTorrentComments(this.torrent).then(data => {
			this.isLoadingComment = false;
			return data;
		});;
	}

	loadDetail() {
		this.isLoadingDetail = true;
		this.torrentData.loadTorrentDatail(this.torrent).then(data => {
			this.isLoadingDetail = false;
		});;
	}

	postComment(reply?: Comment) {
		console.log(reply);
		let message = "";
		if (reply) {
			message = "引用" + reply.userName + "的评论:\"" + reply.getQuoteString() + "\"";
		}
		let prompt = this.alertCtrl.create({
			title: '添加评论',
			message: message,
			inputs: [
				{
					name: 'message',
					placeholder: '添加评论'
				},
			],
			buttons: [
				{
					text: '取消',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: '评论',
					handler: data => {
						console.log('Saved clicked', data);
						if (data && data.message) {
							let body = {
								torrent: this.torrent.id,
								message: data.message,
								quote: reply
							}
							this.showLoading();
							this.torrentData.postTorrentComment(body).then(res=>{
								this.loadComments().then(comms=>{
									this.hideLoading()
								});
							});
						}


						// 
						// this.userData.shout(data.message,message?message.userId:null).then(res=>{
						// 	console.log(res);
						// 	this.loadChatData().then(loadData=>{
						// 		
						// 	});
						// })

					}
				}
			]
		});
		prompt.present();
	}

	download() {

		// window.resolveLocalFileSystemURL('file:///storage/emulated/0/Download',function (fileSystem) {
		// 					alert(fileSystem.name+' '+fileSystem.root.fullPath);
		// 					let dataDir = fileSystem.root.getDirectory("Download", { create: false }, function(directory){
		// 						alert(directory.fullPath);
		// 					},function(error){
		// 						alert('failed to get Download folder '+JSON.stringify(error));
		// 					});
		// 					let lockFile = dataDir.getFile("lockfile.txt", { create: true, exclusive: true });
		// 				}, function () {
		// 					alert('failed to get file system');
		// 				}) ;

		// window.requestFileSystem(
		// 				LocalFileSystem.PERSISTENT,
		// 				0,
		// 				function (fileSystem) {
		// 					// alert(fileSystem.name+' '+fileSystem.root.fullPath);
		// 					let dataDir = fileSystem.root.getDirectory("/Download", { create: false }, function(directory){
		// 						alert(directory.fullPath);
		// 					},function(error){
		// 						alert('failed to get Download folder '+JSON.stringify(error));
		// 					});
		// 					let lockFile = dataDir.getFile("lockfile.txt", { create: true, exclusive: true });
		// 				}, function () {

		// 				});


		let toast = this.toastCtrl.create({
			message: '开始下载...',
			duration: 2000
		});


		toast.present();

		this.webHttp.download(this.torrent.url, this.torrent.getFileName()).then((entry) => {
			// alert('download complete: ' + entry.toURL());
			let duration: number = 10000;
			let openToast = this.toastCtrl.create({
				message: '文件已下载 ' + entry.fullPath,
				showCloseButton: true,
				closeButtonText: '打开'
			});
			let timeoutHandler = setTimeout(() => {
				openToast.dismiss({ autoClose: true });
			}, duration);
			openToast.onDidDismiss(data => {
				if (data && data.autoClose) {
					//do nothing
				} else {

					//user click
					FileOpener.open(entry.toURL(), 'application/x-bittorrent').then((event1) => {
						// alert(entry.toURL()+' event1 ' + event1);
					}, (event2) => {
						// alert(entry.toURL()+'event2' + JSON.stringify(event2));
					});
				}
			});
			openToast.present();

		}, (error) => {
			// handle error

			alert('error:' + JSON.stringify(error));
		});
	}
}
