import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

/*
  Generated class for the TorrentData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TorrentData {

  data: any;

  types: any[];

  constructor(public http: Http) {
    console.log('Hello TorrentData Provider');

    this.getTypes();
  }

  load() :any {
    if(this.data){
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/torrent-data.json')
        .map(this.processData);
    }
  }

  processData(data){
    this.data = data.json();

    return this.data;
  }

  getTypes() :any {
    if(this.types && this.types.length){
      return Observable.of(this.types);
    } else {
      return this.http.get('assets/data/torrent-type.json')
        .map(data =>{
          this.types = data.json();
          return this.types;
        })
    }
  }

}


export class Torrent {

}