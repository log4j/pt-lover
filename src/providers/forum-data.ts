import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {Forum,ForumSection} from '../models/forum';

import { WebHttp } from './web-http';
/*
  Generated class for the ForumData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ForumData {

	constructor(
		public http: Http,
		public webHttp: WebHttp,
	) {
		console.log('Hello ForumData Provider');
	}


	loadForumHome(): Promise<ForumSection> {
		return this.webHttp.get('forums.php').then(data => {
			// console.log(data);
			// torrent.loadDetail(data, this.webHttp);
			let section = new ForumSection();
			section.loadData(data, this.webHttp);
			return section;
		});
	}

	loadForumTopicList(forum: Forum, option?: { next?: boolean }) : Promise<Forum>{
		let fetchUrl = 'forums.php'+forum.url;
		if(option && option.next){
			fetchUrl+='&page='+(forum.page+1);
		}
		return this.webHttp.get(fetchUrl).then(data=>{
			forum.loadTopicList(data, this.webHttp);
			if(option && option.next){
				forum.page ++;
			}else{
				forum.page = 0;
			}
			return forum;
		})
	}

	loadForumSection(forum: Forum, option?: { next?: boolean }) {

	}

}
