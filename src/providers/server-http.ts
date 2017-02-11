import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the WebHttp provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServerHttp {


	host: string = 'http://word.mangs.site:5000/';



	constructor(
		public http: Http
	) {

		console.log('Hello ServerHttp Provider');
	}

	

	get(url): Promise<any> {
		return new Promise<any>(resolve => {
			this.http.get(this.host + url, { withCredentials: true })
				.subscribe(
				response => resolve(response.json()),
				error => {
					// alert(error);
					resolve(null);
				});
		});

	}

	post(url, postBody): Promise<any> {

		// let body = new URLSearchParams();
		// for (let key in postBody)
		// 	body.set(key, postBody[key]);


		return new Promise<any>(resolve => {
			this.http.post(this.host + url, postBody, { withCredentials: true })
				.subscribe(
				response => resolve(response.json()),
				error => resolve(null)
				);
		});
	};

	

}
