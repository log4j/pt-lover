import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, ActionSheetController, ToastController, AlertController, LoadingController, Loading, ModalController } from 'ionic-angular';

import { TorrentData } from '../../providers/torrent-data';
import { UserData } from '../../providers/user-data';
import { WebHttp } from '../../providers/web-http';
import { Comment, Torrent, TorrentList } from '../../models/torrent';
import { FileOpener } from '@ionic-native/file-opener';

import { RemoteServerChoosePage } from '../remote-server-choose/remote-server-choose';
import { WebIntent } from '@ionic-native/web-intent';
import { Device } from '@ionic-native/device';

declare var cordova: any;
declare var window: any;
declare var FileTransfer: any;
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

	userCancelDownload: boolean = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public torrentData: TorrentData,
		public userData: UserData,
		public webHttp: WebHttp,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public ngZone: NgZone,
		public actionSheetCtrl: ActionSheetController,
		private fileOpener: FileOpener,
		private webIntent: WebIntent,
		private platform: Platform,
		private device: Device
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
							this.torrentData.postTorrentComment(body).then(res => {
								this.loadComments().then(comms => {
									this.hideLoading()
								});
							});
						}



					}
				}
			]
		});
		prompt.present();
	}

	/**
	 * type: 
	 * 	'file': download file and ask how to open it
	 *  'remote': download file and let user choose which RemoteServer to add
	 */
	download(type: string) {

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

		if (typeof FileTransfer === 'undefined') {
			let base64 = 'fake file';
			this.presentRemoteServerChoosePage(base64).then(saveRes => {
				console.log(saveRes);
			});
			return;
		}

		this.userCancelDownload = false;

		let toast = this.toastCtrl.create({
			message: type == 'remote' ? '正在获取种子信息...' : '开始下载...',
			// duration: 2000
			showCloseButton: true,
			closeButtonText: '取消'
		});

		toast.onDidDismiss(data => {
			if (data && data.downloaded) {
				//do nothing
			} else {
				this.userCancelDownload = true;
			}
		});



		toast.present();


		this.webHttp.download(this.torrent.url, this.torrent.getFileName()).then((entry) => {

			if (this.userCancelDownload)
				return;

			toast.dismiss({ donwloaded: true });

			if (type === 'remote') {
				// alert(entry);
				entry.file(file => {
					// alert(file);
					let reader = new FileReader();
					reader.onload = (event) => {
						let target: any = event.target;
						// console.log(event);
						// console.log(target.result)
						if (target && target.result) {
							let base64 = target.result.substring(
								target.result.indexOf('base64,') + 7);

							// alert(base64);


							this.presentRemoteServerChoosePage(base64).then(saveRes => {
							});

						}
					}

					reader.readAsDataURL(file);
				})
			} else {

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


						// entry.getParent(parent=>{
						// 	alert("Parent Name: " + parent.name);

						// },err=>{
						// 	alert(err.code);
						// })

						if (type === 'file') {
							//user click
							//decide path 
							let target = cordova.file.dataDirectory;
							if (this.device.platform === 'Android') {
								target = cordova.file.externalDataDirectory;
							}
							this.fileOpener.open(target + entry.fullPath, 'application/x-bittorrent')
								.then((event1) => {
									// alert(entry.toURL() + ' event1 ' + JSON.stringify(event1));
								}, (event2) => {
									//alert('Err: file:' + target + entry.fullPath + ' err:' + JSON.stringify(event2));

									let message = '';
									if (event2.status === 9) {
										message = "未找到打开.torrent文件的应用."
									} else {
										message = event2.message;
									}
									let alert = this.alertCtrl.create({
										title: '提示',
										subTitle: '打开文件失败, 错误信息:' + message,
										buttons: ['确定	']
									});
									alert.present();

								}).catch(e => alert('Error openening file: ' + JSON.stringify(e)));;
						}


					}
				});
				openToast.present();
			}



		}, (error) => {
			// handle error

			if (this.userCancelDownload)
				return;
			alert('error:' + error);
		});
	}


	viewMoreOptions() {
		if (this.platform.is('ios') && this.userData.user && this.userData.greenMode) {
			let actionSheet = this.actionSheetCtrl.create({
				title: 'PTLover不提供任何资源下载功能',
				buttons: [
					{
						text: '评论',
						icon: !this.platform.is('ios') ? 'chatboxes' : null,
						handler: () => {
							this.postComment();
						}
					}, {
						text: '取消',
						role: 'destructive',
						icon: !this.platform.is('ios') ? 'close' : null,
						handler: () => {
							console.log('Cancel clicked');
						}
					}
				]
			});
			actionSheet.present();
		} else {
			let actionSheet = this.actionSheetCtrl.create({
				title: 'PTLover不提供任何资源内容下载功能',
				buttons: [
					{
						text: '上传下载任务',
						icon: !this.platform.is('ios') ? 'clipboard' : null,
						handler: () => {
							this.download('remote');
						}
					}, {
						text: '下载种子',
						icon: !this.platform.is('ios') ? 'download' : null,
						handler: () => {
							this.download('file');
						}
					}, {
						text: '评论',
						icon: !this.platform.is('ios') ? 'chatboxes' : null,
						handler: () => {
							this.postComment();
						}
					}, {
						text: '取消',
						role: 'destructive',
						icon: !this.platform.is('ios') ? 'close' : null,
						handler: () => {
							console.log('Cancel clicked');
						}
					}
				]
			});
			actionSheet.present();
		}
	}

	presentRemoteServerChoosePage(torrent: String) {
		return new Promise(resolve => {
			// 


			this.ngZone.run(() => {
				setTimeout(() => {
					// alert('start modal');
					let modal = this.modalCtrl.create(RemoteServerChoosePage, { torrent: torrent });
					modal.onDidDismiss(data => {
						return resolve(data);
					})
					modal.present();
				}, 200)
			});



		});
	}
}
