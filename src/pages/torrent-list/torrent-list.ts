import { Component, Input, ViewChild, NgZone } from '@angular/core';
import { Content, NavController, PopoverController, ModalController, NavParams, Events, List, Loading, LoadingController, Refresher } from 'ionic-angular';

import { TorrentData } from '../../providers/torrent-data';
import { UserData } from '../../providers/user-data';
import { TorrentFilter } from '../../models/filter'
import { Torrent, TorrentList } from '../../models/torrent'

import { PeerListPopOverPage } from '../peer-list-pop-over/peer-list-pop-over';
import { TorrentFilterPage } from '../torrent-filter/torrent-filter';
import { TorrentSearchPage } from '../torrent-search/torrent-search';
import { TorrentDetailPage } from '../torrent-detail/torrent-detail';


/*
  Generated class for the TorrentList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-torrent-list',
	templateUrl: 'torrent-list.html'
})
export class TorrentListPage {
	// the list is a child of the schedule page
	// @ViewChild('torrentList') gets a reference to the list
	// with the variable #scheduleList, `read: List` tells it to return
	// the List and not a reference to the element
	@ViewChild('torrentList', { read: List }) torrentList: List;
	@ViewChild(Refresher) refresher: Refresher;
	@ViewChild(Content) content: Content;

	torrents: TorrentList = new TorrentList();

	torrentFilter: TorrentFilter;

	keyword: string = '';
	greenMode: boolean;

	loader: Loading;
	isLoading: boolean = true;

	@Input() showScrollToTop: boolean = false;


	specialLabels = {
		'free': '免费',
		'halfdown': '50%下载',
		'd30down': '30%下载',
		'twoup': '2x上传',
		'd70down': '70%下载'
	};


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public torrentData: TorrentData,
		public userData: UserData,
		private popoverCtrl: PopoverController,
		public modalCtrl: ModalController,
		public loadingCtrl: LoadingController,
		public ngZone: NgZone,
		public events: Events
	) {


		this.greenMode = this.userData.greenMode;
		this.torrentData.getTypes().subscribe(data => {

			this.torrentFilter = new TorrentFilter(data);

			// console.log(this.torrentFilter);

		});
		this.events.subscribe("filters:publish", () => {
			this.torrents.sortByRules(this.torrentData.enableHot, this.torrentData.enableTop);
		});

		this.events.subscribe("mode:greenMode", () => {
			this.greenMode = this.userData.greenMode;
		});

	}

	ionViewDidLoad() {
		// this.updateTorrentList();

		if (this.navParams.data && this.navParams.data.openSearch) {

			this.ngZone.run(() => {
				setTimeout(() => {
					this.showTorrentSearch(true);
				}, 300)
			});
		} else {
			this.showLoading();
			this.updateTorrentList(true).then(data => {
				this.hideLoading();
				// refresher.complete();
			})
		}

	}


	ngAfterViewInit() {
		// this.refresher.
		// this.refresher._beginRefresh();

	}


	updateTorrentList(force?: boolean) {
		// Close any open sliding items when the schedule updates
		this.torrentList && this.torrentList.closeSlidingItems();

		return this.torrentData.loadTorrentPage(force, { keyword: this.keyword }).then(data => {
			this.torrents = data;
			return data;
		});

	}


	onInput($event) {
		console.log('trigger', $event);
	}

	showTorrentSearch(enableKeyword) {
		let modal = this.modalCtrl.create(TorrentSearchPage, { enableKeyword: enableKeyword });
		modal.present();

		modal.onWillDismiss((data: any) => {
			if (data) {
				// console.log(data);
				// this.torrentData.enableHot = data.enableHot;
				// this.torrentData.enableTop = data.enableTop;
				// this.torrents.sortByRules(data.enableHot, data.enableTop);
				// this.torrentData.saveFilterData(data);
				// this.keyword = data.keyword;
				this.refreshListDueToKeyword(data.keyword);
			} else {
				if (this.keyword) {
					this.refreshListDueToKeyword('');
				}
			}
		});
	}


	refreshListDueToKeyword(keyword) {
		this.keyword = keyword;
		this.torrentData.searchKeyword = keyword;
		// this.torrents.clear();
		this.showLoading();
		this.scrollToTop();
		this.updateTorrentList(true).then(() => {
			this.hideLoading();
		});
	}

	resetSearch() {
		// this.keyword = '';
		this.refreshListDueToKeyword('');
	}

	onScroll() {




		this.ngZone.run(() => {
			if (this.content.scrollTop >= 500) {
				this.showScrollToTop = true;
			}
			else if (this.content.scrollTop < 100) {
				this.showScrollToTop = false;
			}
		});


	}

	scrollToTop() {
		this.content.scrollToTop();
		// this.showScrollToTop = false;s
	}

	presentPopover(ev) {

		let popover = this.popoverCtrl.create(PeerListPopOverPage, {
		});

		popover.present({
			ev: ev
		});
	}


	showLoading() {
		// this.loader = this.loadingCtrl.create({
		// 	content: "正在载入, 请稍等..."
		// });
		// this.loader.present();
		this.isLoading = true;
	}

	hideLoading() {
		if (this.loader) {
			this.loader.dismiss();
		}
		this.isLoading = false;
		// console.log('hide loading');
	}

	presentFilter() {
		let modal = this.modalCtrl.create(TorrentFilterPage, this.torrentFilter);
		modal.present();

		modal.onWillDismiss((data: any) => {
			if (data) {
				// console.log(data);
				// this.torrentData.enableHot = data.enableHot;
				// this.torrentData.enableTop = data.enableTop;
				this.torrents.sortByRules(data.enableHot, data.enableTop);
				this.torrentData.saveFilterData(data);
			}
		});

	}

	presentDetailPage(torrent: Torrent) {

		// this.showLoading();

		// this.torrentData.loadTorrentDatail(torrent).then(data => {
		// this.hideLoading();
		//let modal = this.modalCtrl.create(TorrentDetailPage, { torrent: torrent, load: 'detail' });
		//modal.present();

		this.navCtrl.push(TorrentDetailPage, { torrent: torrent, load: 'detail' });
		// });;

	}

	presentCommentPage(torrent: Torrent) {

		// this.showLoading();

		// this.torrentData.loadTorrentComments(torrent).then(data => {
		// this.hideLoading();
		// let modal = this.modalCtrl.create(TorrentDetailPage, { torrent: torrent, load: 'comments' });
		// modal.present();

		this.navCtrl.push(TorrentDetailPage, { torrent: torrent, load: 'comments' });
		// });;

	}


	doRefresh(refresher) {

		this.updateTorrentList(true).then(data => {
			this.hideLoading();
			refresher.complete();
		})


	}

	doInfinite(infiniteScroll) {

		this.torrentData.loadTorrentPage(true, { next: true, keyword: this.keyword }).then(data => {
			if (data) {
				infiniteScroll.complete();
			} else {
				infiniteScroll.enable(false);
			}
		});

	}

}
