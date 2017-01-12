import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { TorrentListPage } from '../pages/torrent-list/torrent-list';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { PeerListPopOverPage } from '../pages/peer-list-pop-over/peer-list-pop-over';
import { TorrentFilterPage } from '../pages/torrent-filter/torrent-filter';

import { TorrentData } from '../providers/torrent-data';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    TorrentListPage,
    ProfilePage,
    LoginPage,
    WelcomePage,
    PeerListPopOverPage,
    TorrentFilterPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    TorrentListPage,
    ProfilePage,
    LoginPage,
    WelcomePage,
    PeerListPopOverPage,
    TorrentFilterPage
  ],
  providers: [Storage,TorrentData, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
