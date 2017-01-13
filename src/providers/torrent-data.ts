import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import * as Parser from "htmlparser2";

import { Torrent, TorrentList } from '../models/torrent';

import { WebHttp } from './web-http';

/*
  Generated class for the TorrentData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TorrentData {

  data: any;

  types: any[];

  torrentList: TorrentList;

  constructor(
    public http: Http,
    public webHttp: WebHttp
  ) {
    console.log('Hello TorrentData Provider');

    this.getTypes();
    // this.loadTorrentPage();
  }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/torrent-data.json')
        .map(this.processData);
    }
  }

  processData(data) {
    this.data = data.json();

    return this.data;
  }

  getTypes(): any {
    if (this.types && this.types.length) {
      return Observable.of(this.types);
    } else {
      return this.http.get('assets/data/torrent-type.json')
        .map(data => {
          this.types = data.json();
          return this.types;
        })
    }
  }


  loadTorrentPage(): Promise<TorrentList> {
    if (this.torrentList) {
      return new Promise<TorrentList>(resolve => resolve(this.torrentList));
    }
    else {
      return this.webHttp.get('assets/data/pages/torrents.html').then(data => {
        //find table.torrents
        let findTorrentsTable = function (node: any) {
          if (node.tagName == 'table' && node.class == 'torrents')
            return node;
          if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
              let result = findTorrentsTable(node.children[i]);
              if (result)
                return result;
            }
          } else {
            return null;
          }
        }
        
        let table = findTorrentsTable(data);

        this.torrentList = new TorrentList(table.children);
        return this.torrentList;
      });
    }

  }

  processTorrentPage(data: any) {

  }


  login(): any {
    const body = new URLSearchParams();
    body.set('username', 'yangmang');
    body.set('password', 'mission');
    body.set('checkcode', 'XxXx');
    let url = 'http://pt.test/takelogin.php';
    // let url = 'http://localhost:8080/https://pt.sjtu.edu.cn/takelogin.php';

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(url, body.toString(), { headers: headers, withCredentials: true })
      .map(res => {
        console.log(res)
      });
  }
}
