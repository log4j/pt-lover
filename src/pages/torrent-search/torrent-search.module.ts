import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TorrentSearchPage } from './torrent-search';

@NgModule({
  declarations: [
    TorrentSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(TorrentSearchPage),
  ],
  exports: [
    TorrentSearchPage
  ]
})
export class TorrentSearchPageModule {}
