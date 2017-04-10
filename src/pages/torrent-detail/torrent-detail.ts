import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController, LoadingController, Loading, ModalController } from 'ionic-angular';

import { TorrentData } from '../../providers/torrent-data';
import { WebHttp } from '../../providers/web-http';
import { Comment, Torrent, TorrentList } from '../../models/torrent';
import { FileOpener } from '@ionic-native/file-opener';

import { RemoteServerChoosePage } from '../remote-server-choose/remote-server-choose';
import { WebIntent } from '@ionic-native/web-intent';



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

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public torrentData: TorrentData,
		public webHttp: WebHttp,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public ngZone: NgZone,
		private fileOpener: FileOpener,
		private webIntent: WebIntent
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

		let toast = this.toastCtrl.create({
			message: '开始下载...',
			duration: 2000
		});



		toast.present();

		// let test = 'ZDg6YW5ub3VuY2U4MTpodHRwczovL3RyYWNrZXIuc2p0dS5lZHUuY24vYW5ub3VuY2UucGhwP3Bhc3NrZXk9NThkNjEyYWRiOWY2NzVhOGFhYzU3ZTRmZDA4MzBlM2ExMDpjcmVhdGVkIGJ5MTM' +
		// 	'6dVRvcnJlbnQvMzAwMDEzOmNyZWF0aW9uIGRhdGVpMTQ5MTUzMTYxOWU4OmR1cmF0aW9uaTYzMDdlMTI6ZW5jb2RlZCByYXRlaTExNTU2NjJlODplbmNvZGluZzU6VVRGLTg2OmhlaWdodGk1NDRlNDppbmZvZDU6ZmlsZXNsZDY6bGVuZ3RoaTU4OTM4Nzc0ZTQ6cGF0aGw2OlNhbXBsZTU3OlNpbHZlci5NZWRhbGlzdC4yMDA5LjcyMHAuQmx1UmF5LngyNjQuRFRTLVdpS2kuU2FtcGxlLm1rdmVlZDY6bGVuZ3RoaTg1ZTQ6cGF0aGw1MDpTaWx2ZXIuTWVkYWxpc3QuMjAwOS43MjBwLkJsdVJheS54MjY0LkRUUy1XaUtpLm1kNWVlZDY6bGVuZ3RoaTcwNzQ4NTM0MTRlNDpwYXRobDUwOlNpbHZlci5NZWRhbGlzdC4yMDA5LjcyMHAuQmx1UmF5LngyNjQuRFRTLVdpS2kubWt2ZWVkNjpsZW5ndGhpNDkzMmU0OnBhdGhsNTA6U2lsdmVyLk1lZGFsaXN0LjIwMDkuNzIwcC5CbHVSYXkueDI2NC5EVFMtV2lLaS5uZm9lZWU0Om5hbWU0NjpTaWx2ZXIuTWVkYWxpc3QuMjAwOS43MjBwLkJsdVJheS54MjY0LkRUUy1XaUtpMTI6cGllY2UgbGVuZ3RoaTgzODg2MDhlNjpwaWVjZXMxNzAyMDqFy/xqc74T3NWzWE4FM0zc1XOhlKzUAeBtiYPXhXVhXNh63/11irjnYbxNwVzLpLo2Je3MYx1ZOpI3bBAivphTBLlQzxtFgvDoKmhrE1S8QAYb4ITTnlkyPBwoJdZ6IuWmJza1qqH31LI3XB/z3qLs9idw/1qdpQ+wTc36vwCNjLUJMGAgtCLsPrfkTpT/3nIePrgBHPx/JYg7J94ZuSWtRnxeo1QVL5dkT/qw6wvtsGR8H9oRmEE1E6wHPImN0oVTgixf3f+hKasrtY0BTGXs1QqMAVx7whh94UuTsuE7j/+A6pZZtAaz0rdXD2E7il8xnsWBWhPu3+OItwUbwHM85Buvm9Kf8caNRlhT0yRlNkCAWU6DoL+SxMljTRTZ24SkhcU6PNesUQLbLSj0itAVvPH/E0uNHDFJG3JffCuHHnERYgImScV1WYh5yLayC7m5Jm1lC8gC8pzxEF+SQ9KDXWjOih/sLKBKxp+30yVwgXxKnEP5JLxXs7LYieQOlq2G7MScgEOYYlb+fmyTG5nUKtKBdyaSKQc5+JjTYgfX6LltOjhM7rOJm0eu6/zn7CqghOqpJpCiRgMGRDTM86UMt+n+8sxAOp8PG4EM30BxqoeM8NqFPrU0mX0MQz2/7w63oYimnyh3Pg3GopKY5q8gyBETyxNsRysJvFMqzzV31eaaSruarBaXgzPUiu1jgpz88wMYj7q+yihrzqKVEly7yFVTJNLWpeyNG/E/WDWgMX3H2yUnR8qnmqzH3Bd21JvzOAubukwt3PPlhbUV4iRctigjGhUYTFtnje7woh95SaWEuJDjbAdkf+qDN0h+mgCbvRMH+Fn/We32Otrf5WO27+qtG3aHvWOqi41oKqHEpRbswBE5kbwrhPOiEKYdktOzpgOKEKAegCjza4xjkL5N0OFufGOVWA5GgY1kebXW84EC7Yx/Vs4zQcTPN67sg1iiP3Y6Cy2iVE63ZOt5NGWy7snv0O079vfaLfjSCTg2dVBxBCcXpT83gfTh1pNWZYjQW6Jdb34/0aQKnl+EvtGH93n+3kIpL2W1eu1y9r3/ZtQCZ9NWRlsA3Na6bHHvVQYh1ybzOgCPP0kAiAkZExywxsnTT68r8Ob+SkiCxsnQHNDgcGLMg+Fbqjyc/hd0s+6cL/c7DKoFMe4d/cceJ+IICllQUL/qr2ZcS/YNHRmSbjY8qlF0adFyzKXQG6mUjxxP6+srPOQAsJ91EHDIUMGPebRZxmMuCvVGf4pdk9vmQQ5IhIlqPuicx0fD33qLL/hFk1zS5hITTs9RMAF6NelYz2pTk46Dl1pnLb/RByM///eqEbRnjzwaqoNUBXrxv4k5KtMkCEtFB/5nNYzFu22txYr9+4sMGzeaiAqxZdeRvtkFcSMgRqsJuHkVSRF/0kOEj++hGi6BBAtChFajlWwbTj/Ok2D2h+VnBziedAVr4SB5IdU9gQkBKJ1KE+L+zMY/HudOZ5QLDSRGfX0YF3kv6MAhwopcdSABNFaHE+1p7jsFCyQjam7DsfFuJt8QhSnpOUBAKlAxoQubPJ+1bmtAMGMioMkt1fd7MQ4czxWKBGLF9XVACReYcT7Grm'
		// 	+ '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' +
		// 	'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' +
		// 	'C/d9mp95HE9h17RIaGpsN79HPIcPU0nl8OnMMQ5f5E4mhmXBNcZnwBS0ZsXZFIyhXKFIn2xDvw5Q9UUtoyst7QmA0xhSvfzuAWISPjD/mfmlDYfF/1fxw1foQJ9hup1J4IcjuhwWAgCzqpxxbq+FQN+p4xOLIz88j2gwbVynR8MS3DRKBuEmEq1m8xADEIFFkP7ksWfBwKbgPzxngl1N6QFW8/+9zUq5OLl09u7RUR0O6FYSicBqT8CaTbhH5qhdCaMAr/3ylkngm++rdYVn9KSadPru3MdgD4KEsC/Z3Bnxk8nbWGWXOEu6hVHUyER3U+/Oq6JJLErqesgWxS289M4ci5k9+nCeLkbFJ4JMvh4kXGsde388dTjqPSfklLYifjIx0meK0k1uPWmn/tEqvFi996n6sGyysJ/Ftqqo1qi3W1Rd5rgtTUoz4rBu0krCVzMHB2+Jj3bfcpQrzHb+Le51K6NVr++Z+vqn+VJ/rxpmCMsRAp9fiFdnkvRus9pIdCSKdw4zBJsOTrroboG/7LMsGFcB1p1mJrCvcp6+AwVhRzQvUcKRursf/HWdh6+LmgZ4NQKZQy8qYnD0L6sFJLCJj3U2AmwmjqN4sqoH4/RqmcTwKAlhSUrQLcI1zQ/r/4sJBcNWfB7aoTazzHsBzmq2Mm50IiJNcej1Dx8bD7KXws7OwO7x2dyBcRAtfNFAYql5nyMDAAJv+2JplNGE/A6XKasMWuKxEvEhyBUXBZ6wDhnxku0byEQQBcX194BrufN+NBG4n4JgmE9qor1Yg0w6BKUFOeoYMsz3OLisdW49UOtKSH2KTWvNDsz4RbeY3joAB9qcHUPjn4mDGkqngte7Y6XMGgsCjhG4oF1z/+vhTR6VniauZToVBBfAPmM54yJPnLWWm+6zQesP45Sw+cI0X+YrPrAXbpMc3uwscgcxkxEwaTVXXBHMOZBeQxw08uroTENX1uit57Zvh3NZBGJAy2ws1xAdDL65UAXJH4SLVtTsA2irubMpKOreBJmtoBfc765LDjZ+dVVuRKOd5NKLnrj7b7q4Hb5HQC3q5tPKDdAKKz+m+BL5jGhPPkRu1692SeYUCtIUOTztkPB0txOUf1l92swBNKA08jPIPUH17w2Nzpwcml2YXRlaTFlNjpzb3VyY2UyMzpbcHQuc2p0dS5lZHUuY25dIOiRoeiQhGU1OndpZHRoaTEyODBlZQ==';

		// this.presentRemoteServerChoosePage(test).then(saveRes => {
		// 	// alert(saveRes);
		// });

		this.webHttp.download(this.torrent.url, this.torrent.getFileName()).then((entry) => {


			if (type === 'remote') {
				entry.file(file => {
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
								// alert(saveRes);
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
							this.fileOpener.open(entry.toURL(), 'application/x-bittorrent')
								.then((event1) => {
									alert(entry.toURL() + ' event1 ' + JSON.stringify(event1));
								}, (event2) => {
									alert(entry.toURL() + ' event2 ' + JSON.stringify(event2));
								}).catch(e => alert('Error openening file' + JSON.stringify(e)));;
						}


					}
				});
				openToast.present();
			}



		}, (error) => {
			// handle error

			alert('error:' + JSON.stringify(error));
		});
	}


	presentRemoteServerChoosePage(torrent: String) {
		return new Promise(resolve => {
			// alert('start modal');
			let modal = this.modalCtrl.create(RemoteServerChoosePage, { torrent: torrent });
			modal.onDidDismiss(data => {
				return resolve(data);
			})
			modal.present();
		});
	}
}
