import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
// import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage'
import { Device } from '@ionic-native/device';
import { BrowserModule } from '@angular/platform-browser';
import { Transfer } from '@ionic-native/transfer';
import { Push } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FileOpener } from '@ionic-native/file-opener';
import { WebIntent } from '@ionic-native/web-intent';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { TorrentListPage } from '../pages/torrent-list/torrent-list';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { PeerListPopOverPage } from '../pages/peer-list-pop-over/peer-list-pop-over';
import { TorrentFilterPage } from '../pages/torrent-filter/torrent-filter';
import { TorrentDetailPage } from '../pages/torrent-detail/torrent-detail';
import { TorrentSearchPage } from '../pages/torrent-search/torrent-search';
import { TorrentAlertPage } from '../pages/torrent-alert/torrent-alert';
import { TorrentAlertDetailPage } from '../pages/torrent-alert-detail/torrent-alert-detail';
import { FaqPage } from '../pages/faq/faq';
import { AboutPage } from '../pages/about/about';
import { FaqDetailPage } from '../pages/faq-detail/faq-detail';

import { ForumListPage } from '../pages/forum-list/forum-list';
import { ForumTopicListPage } from '../pages/forum-topic-list/forum-topic-list';
import { ForumTopicPostPage } from '../pages/forum-topic-post/forum-topic-post';
import { ForumTopicPage } from '../pages/forum-topic/forum-topic';
import { RemotePage } from '../pages/remote/remote';
import { RemoteServerPage } from '../pages/remote-server/remote-server';
import { RemoteServerChoosePage } from '../pages/remote-server-choose/remote-server-choose';
import { RewardOptions } from '../pages/reward-options/reward-options';

import { TorrentData } from '../providers/torrent-data';
import { UserData } from '../providers/user-data';
import { ForumData } from '../providers/forum-data';
import { WebHttp } from '../providers/web-http';
import { ServerHttp } from '../providers/server-http';
import { RemoteData } from '../providers/remote-data';
import { PushData } from '../providers/push-data';

import { CategoryPipe } from '../pipes/torrent-category-pipe';
import { TorrentStatusPipe } from '../pipes/torrent-status-pipe';

import { FileSizePipe } from '../pipes/file-size-pipe';


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
    TorrentFilterPage,
    TorrentDetailPage,
    TorrentAlertPage,
    TorrentAlertDetailPage,
    FaqPage,
    AboutPage,
    FaqDetailPage,
    ForumListPage,
    ForumTopicListPage,
    ForumTopicPage,
    ForumTopicPostPage,
    RemotePage,
    RemoteServerPage,
    RewardOptions,
    RemoteServerChoosePage,
    CategoryPipe,
    TorrentStatusPipe,
    FileSizePipe,
    TorrentSearchPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      autoFocusAssist: false,
      backButtonText: '',
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthShortNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      dayShortNames: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    })
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
    TorrentFilterPage,
    TorrentDetailPage,
    TorrentAlertPage,
    TorrentAlertDetailPage,
    FaqPage,
    AboutPage,
    FaqDetailPage,
    ForumListPage,
    ForumTopicListPage,
    ForumTopicPage,
    ForumTopicPostPage,
    RemotePage,
    RemoteServerPage,
    RemoteServerChoosePage,
    TorrentSearchPage,
    RewardOptions
  ],
  providers: [
    Device,
    Push,
    StatusBar,
    SplashScreen,
    Transfer,
    FileOpener,
    WebHttp,
    WebIntent,
    TorrentData,
    UserData,
    ForumData,
    RemoteData,
    ServerHttp,
    PushData,
    { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
