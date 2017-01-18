import { Component, ViewChild } from '@angular/core';
import { NavController, PopoverController, ModalController, NavParams, List, Loading, LoadingController, Refresher } from 'ionic-angular';


import { TorrentData } from '../../providers/torrent-data';
import { TorrentFilter } from '../../models/filter'
import { Torrent,TorrentList } from '../../models/torrent'

import { PeerListPopOverPage } from '../peer-list-pop-over/peer-list-pop-over';
import { TorrentFilterPage } from '../torrent-filter/torrent-filter';
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

	torrents: TorrentList = new TorrentList();

	torrentFilter: TorrentFilter;

	loader: Loading;

	specialLabels = {
		'free':'免费',
		'halfdown':'50%下载',
		'd30down':'30%下载',
		'twoup':'2x上传',
		'd70down':'70%下载'
	};


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public torrentData: TorrentData,
		private popoverCtrl: PopoverController,
		public modalCtrl: ModalController,
		public loadingCtrl: LoadingController
	) {

		this.torrentData.getTypes().subscribe(data => {

			this.torrentFilter = new TorrentFilter(data);

			// console.log(this.torrentFilter);

		});



	}

	ionViewDidLoad() {
		// this.updateTorrentList();
	}


	ngAfterViewInit() {
		// this.refresher.
		this.refresher._beginRefresh();
		this.showLoading();
	}


	updateTorrentList(force?:boolean) {
		// Close any open sliding items when the schedule updates
		this.torrentList && this.torrentList.closeSlidingItems();

		return this.torrentData.loadTorrentPage(force).then(data => {
			this.torrents = data;
			console.log(data);
			return data;
		});

	}

	presentPopover(ev) {

		let popover = this.popoverCtrl.create(PeerListPopOverPage, {
		});

		popover.present({
			ev: ev
		});
	}


	showLoading() {
		this.loader = this.loadingCtrl.create({
			content: "正在载入, 请稍等..."
		});
		this.loader.present();
	}

	hideLoading() {
		if(this.loader){
			this.loader.dismiss();
		}
	}

	presentFilter() {
		let modal = this.modalCtrl.create(TorrentFilterPage, this.torrentFilter);
		modal.present();

		modal.onWillDismiss((data: any) => {
			if (data) {
				console.log(data);
				// this.torrentData.enableHot = data.enableHot;
				// this.torrentData.enableTop = data.enableTop;
				this.torrents.sortByRules(data.enableHot,data.enableTop);
				this.torrentData.saveFilterData(data.enableHot,data.enableTop)
			}
		});

	}

	presentDetailPage(torrent:Torrent) {

		this.showLoading();

		this.torrentData.loadTorrentDatail(torrent).then(data=>{
			this.hideLoading();
			let modal = this.modalCtrl.create(TorrentDetailPage, data);
			modal.present();
		});;
		

	}


	doRefresh(refresher) {

		this.updateTorrentList(true).then(data => {
			if (this.loader)
				this.loader.dismiss();
			refresher.complete();
		})


	}

}
