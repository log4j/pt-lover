import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


import { AlertRule } from '../models/alert';

import { ServerHttp } from './server-http';

/*
  Generated class for the PushData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PushData {

	pushId: string = '';

	constructor(
		public http: Http,
		public serverHttp: ServerHttp,
	) {
		console.log('Hello PushData Provider');
	}


	updatePushId(id) {
		this.pushId = id;
		// alert('id in service:'+id);
	}

	getTorrentAlertRules(): Promise<AlertRule[]> {
		//works only when pushId is available
		if (this.pushId) {
			return this.serverHttp.get('subscription/'+this.pushId).then(res=>{
				if(res && res.result){
					let results:AlertRule[] = [];

					res.data.forEach(item=>results.push(new AlertRule(item)));

					return results; 
				}else{
					return [];
				}
			});
		} else {
			return new Promise(resolve => {
				resolve([]);
			});
		}
	}

	updateTorrentAlertRule(rule:AlertRule):Promise<AlertRule>{

		if(rule.id){
			//update
			return this.serverHttp.put('subscription/'+this.pushId+'/'+rule.id, rule).then(res=>{
				if(res && res.result){
					return rule;
				}else{
					return null;
				}
			});
		}else{
			//post
			return this.serverHttp.post('subscription/'+this.pushId, rule).then(res=>{
				if(res && res.result){
					return rule;
				}else{
					return null;
				}
			});
		}
	}

	removeTorrentAlertRule(rule:AlertRule):Promise<boolean>{
		if(rule && rule.id){
			return this.serverHttp.delete('subscription/'+this.pushId+'/'+rule.id).then(res=>{
				if(res && res.result){
					return true;
				}else{
					return false;
				}
			});
		} else {
			return new Promise(resolve => {
				resolve(false);
			});
		}
	}

}
