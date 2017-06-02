import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the WebHttp provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServerHttp {


	host: string = 'http://pt.mangs.site:5000/';
	username: string = 'ptlover';
	password: string = 'F5$/bBsq+eB7KQ';
	headers: Headers = new Headers();



	constructor(
		public http: Http
	) {
		//console.log('Hello ServerHttp Provider');
		this.headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
		// this.headers.append("Content-Type", "application/x-www-form-urlencoded");

	}



	get(url): Promise<any> {
		return new Promise<any>(resolve => {
			this.http.get(this.host + url, { withCredentials: true, headers: this.headers })
				.subscribe(
				response => resolve(response.json()),
				error => {
					// alert(error);
					resolve(null);
				});
		});

	}

	post(url, postBody): Promise<any> {
		return new Promise<any>(resolve => {
			this.http.post(this.host + url, postBody, { withCredentials: true, headers: this.headers })
				.subscribe(
				response => resolve(response.json()),
				error => resolve({ result: false, err: error })
				);
		});
	};

	put(url, postBody): Promise<any> {
		return new Promise<any>(resolve => {
			this.http.put(this.host + url, postBody, { withCredentials: true, headers: this.headers })
				.subscribe(
				response => resolve(response.json()),
				error => resolve(null)
				);
		});
	};

	delete(url): Promise<any> {
		return new Promise<any>(resolve => {
			this.http.delete(this.host + url, { withCredentials: true, headers: this.headers })
				.subscribe(
				response => resolve(response.json()),
				error => resolve(null)
				);
		});
	};





}
