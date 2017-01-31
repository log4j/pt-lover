import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { HomePage } from '../home/home';
import { TorrentListPage } from '../torrent-list/torrent-list';
import { ProfilePage } from '../profile/profile';
import { ForumListPage } from '../forum-list/forum-list';

/*
  Generated class for the Tabs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // set the root pages for each tab
  tab1Root: any = HomePage;
  tab2Root: any = TorrentListPage;
  tab4Root: any = ProfilePage;
  tab3Root: any = ForumListPage;
  mySelectedIndex: number;



  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  doubleClick(index){
    console.log(index);
  }

}
