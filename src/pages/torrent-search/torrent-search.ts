import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar, Events } from 'ionic-angular';
import { UserData } from '../../providers/user-data';

import { TorrentData } from '../../providers/torrent-data';
import { TorrentFilter } from '../../models/filter'

/**
 * Generated class for the TorrentSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-torrent-search',
	templateUrl: 'torrent-search.html',
})
export class TorrentSearchPage {
	@ViewChild(Searchbar) searchbar: Searchbar;

	enableKeyword: boolean;
	category: TorrentFilter;
	keyword: string;
	greenMode: boolean;


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public userData: UserData,
		public torrentData: TorrentData,
		public events: Events
	) {
		this.enableKeyword = this.navParams.data.enableKeyword;
		this.category = torrentData.searchCategory.clone();
		this.keyword = torrentData.searchKeyword;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TorrentSearchPage');


		this.greenMode = this.userData.greenMode;
		this.events.subscribe("mode:greenMode", () => {
			this.greenMode = this.userData.greenMode;
			this.category = this.torrentData.searchCategory.clone();
		})

		if (this.enableKeyword) {
			this.searchbar.setFocus();
		}

	}

	dismiss(data?: any) {
		// using the injected ViewController this page
		// can "dismiss" itself and pass back data
		this.torrentData.searchKeyword = '';
		this.viewCtrl.dismiss();
	}

	applySearch() {
		this.torrentData.searchKeyword = this.keyword;
		this.torrentData.saveCategoryData(this.category);
		this.viewCtrl.dismiss({
			keyword: this.keyword
		})
	}

	selectAll(flag: boolean) {
		for (let i = 0; i < this.category.types.length; i++) {
			this.category.types[i].checked = flag;
		}
	}

}
