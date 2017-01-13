import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import * as Parser from "htmlparser2";

import {Torrent, TorrentList} from '../models/torrent';

/*
  Generated class for the TorrentData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TorrentData {

  data: any;

  types: any[];

  torrentList:TorrentList;

  constructor(public http: Http) {
    console.log('Hello TorrentData Provider');

    this.getTypes();
    // this.loadTorrentPage();
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

  loadTorrentPage(): Promise<TorrentList>{
    // return this.http.get('http://pt.test/torrents.php',{withCredentials:true})
    //   .map(data=>{
    //     console.log(data);
    //   });

    return new Promise<TorrentList>(resolve=>{
      if(this.torrentList){
        resolve(this.torrentList);
      }else{
        this.http.get('assets/data/pages/torrents.html')
        .subscribe(response =>{

          //parse the html content
          let html = response.text().replace(/>(\s|\r|\n)+</g,'><');
          let root:any = {};
          let current:any = root;
          let parent = root;
          let inParent = false;

          let parser = new Parser.Parser({
            onopentag: function(tagName, attribs){
              current = {
                tagName: tagName,
                parent: parent
              };
              for(let key in attribs)
                current[key] = attribs[key];

              
              if(!parent.children)
                parent.children = [];
              parent.children.push(current);

              parent = current;
            },
            ontext: function(text){
                //console.log(text);
                if(!current.text)
                  current.text = text;
                else
                  current.text += ' '+text;
            },
            onclosetag: function(tagname){
              parent = current.parent;
              current = parent;
            },
            onend:function(){
              let removeParent = function(node:any){
                if(node.parent)
                  delete node.parent;
                if(node.children){
                  // node.children.forEach(child=>{
                  //   removeParent(child);
                  // })
                  let excludeMap = {
                    'script':true,
                    'link':true,
                    'meta':true
                  }
                  for(let i=node.children.length-1;i>=0;i--){
                    //remove 'script', 'link', 'meta'
                    if(excludeMap[node.children[i].tagName]){
                      node.children.splice(i,1);
                      continue;
                    }
                    removeParent(node.children[i]);
                  }
                }
              }
              removeParent(root);



              //find table.torrents
              let findTorrentsTable = function(node:any){
                if(node.tagName=='table' && node.class=='torrents')
                  return node;
                if(node.children){
                  for(let i=0;i<node.children.length;i++){
                    let result = findTorrentsTable(node.children[i]);
                    if(result)
                      return result;
                  }
                }else{
                  return null;
                }
              }

              let table = findTorrentsTable(root);

              // console.log(JSON.stringify(table));

              // let torrent = new Torrent(table.children[10]);
              let torrentList = new TorrentList(table.children);
              // console.log(torrentList);
              resolve(torrentList);
            }
          }, {decodeEntities: true});

          parser.write(html);
          parser.end();

        
          return response;
        })
      }
    });

  }

  processTorrentPage(data:any){

  }


  login(): any {
    const body = new URLSearchParams();
    body.set('username','yangmang');
    body.set('password','mission');
    body.set('checkcode', 'XxXx');
    let url = 'http://pt.test/takelogin.php';
    // let url = 'http://localhost:8080/https://pt.sjtu.edu.cn/takelogin.php';

    let headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(url, body.toString(), {headers : headers, withCredentials:true})
      .map(res => {
        console.log(res)
      });
  }
}
