import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Parser from "htmlparser2";
import { Device } from '@ionic-native/device';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
declare var cordova: any;

/*
  Generated class for the WebHttp provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WebHttp {


	isLocal: boolean = false;
	useProxy: boolean = false;
	host: string = this.isLocal ? 'assets/data/pages/' : (this.useProxy ? 'http://pt-proxy.mangs.site/' : 'https://pt.sjtu.edu.cn/');



	constructor(
		public http: Http,
		private device: Device,
		private transfer: Transfer
		// public device: Device
	) {



		console.log('Hello WebHttp Provider');

		console.log(device.platform);


		const fileTransfer: TransferObject = this.transfer.create();
	}



	parseHtml(text: any, callback: Function): any {


		let html = text.replace(/>(\s|\r|\n)+</g, '><');
		let root: any = {};
		let current: any = root;
		let parent = root;
		let parser = new Parser.Parser({
			onopentag: function (tagName, attribs) {
				current = {
					tagName: tagName,
					parent: parent
				};
				for (let key in attribs)
					current[key] = attribs[key];

				if (!parent.children)
					parent.children = [];
				parent.children.push(current);

				parent = current;

			},
			ontext: function (text) {
				//console.log(text);
				if (!current.text)
					current.text = text;
				else
					current.text += ' ' + text;

				if (!current.children)
					current.children = [];
				current.children.push({
					tagName: 'text',
					value: text
				});
			},
			onclosetag: function (tagname) {
				parent = current.parent;
				current = parent;
			},
			onend: function () {
				let removeParent = function (node: any) {
					if (node.parent)
						delete node.parent;
					if (node.children) {
						// node.children.forEach(child=>{
						//   removeParent(child);
						// })
						let excludeMap = {
							'script': true,
							'link': true,
							'meta': true
						}
						for (let i = node.children.length - 1; i >= 0; i--) {
							//remove 'script', 'link', 'meta'
							if (excludeMap[node.children[i].tagName]) {
								node.children.splice(i, 1);
								continue;
							}
							removeParent(node.children[i]);
						}
					}
				}
				removeParent(root);
				callback(root);
			},
			onerror: function () {
				callback({});
			}
		}, { decodeEntities: true });

		parser.write(html);
		parser.end();

	}

	findElement(node: any, isThatOne: Function): any {
		if (node) {
			let list: any[] = [];
			list.push(node);

			while (list.length) {
				let item = list.pop();
				if (isThatOne(item)) {
					return item;
				}
				//push every child into list
				if (item.children) {
					item.children.forEach(child => list.push(child));
				}

			}
			return null;
		}
		return null;
	}

	get(url): Promise<any> {
		if (this.isLocal) {
			url = url.replace('php', 'html')
		}
		if (!this.device.platform) {
			this.useProxy = true;
		}
		this.host = this.isLocal ? 'assets/data/pages/' : (this.useProxy ? 'http://pt-proxy.mangs.site/' : 'https://pt.sjtu.edu.cn/');



		return new Promise<any>(resolve => {
			this.http.get(this.host + url, { withCredentials: true })
				.subscribe(
				response => {
					// console.log(response.text());
					this.parseHtml(response.text(), resolve);
				},
				error => {
					// alert(error);

					resolve(null);
				});
		});

	}

	post(url, postBody): Promise<any> {
		if (this.isLocal) {
			url = url.replace('php', 'html')
		}

		if (!this.device.platform) {
			this.useProxy = true;
		}
		this.host = this.isLocal ? 'assets/data/pages/' : (this.useProxy ? 'http://pt-proxy.mangs.site/' : 'https://pt.sjtu.edu.cn/');


		let body = new URLSearchParams();
		for (let key in postBody)
			body.set(key, postBody[key]);

		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		return new Promise<any>(resolve => {
			this.http.post(this.host + url, body.toString(), { headers: headers, withCredentials: true })
				.subscribe(
				response => this.parseHtml(response.text(), resolve),
				error => resolve(null)
				);
		});
	};

	getJson(url): Promise<any> {
		if (this.isLocal) {
			url = url.replace('php', 'html')
		}

		if (!this.device.platform) {
			this.useProxy = true;
		}
		this.host = this.isLocal ? 'assets/data/pages/' : (this.useProxy ? 'http://pt-proxy.mangs.site/' : 'https://pt.sjtu.edu.cn/');


		return new Promise<any>(resolve => {
			this.http.get(this.host + url, { withCredentials: true })
				.subscribe(
				response => {
					try {
						resolve(response.json());
					}
					catch (exception) {
						console.log(exception);
						resolve(null);
					}
				},
				error => resolve(null)
				);
		});
	};

	// Cordova


	//target directory depends on which platform
	download(url: string, name: string) {

		if (!this.device.platform) {
			this.useProxy = true;
		}
		this.host = this.isLocal ? 'assets/data/pages/' : (this.useProxy ? 'http://pt-proxy.mangs.site/' : 'https://pt.sjtu.edu.cn/');


		let fileTransfer: TransferObject = this.transfer.create();
		// let url = 'http://www.example.com/file.pdf';
		// console.log(name);
		let target = cordova.file.dataDirectory;
		if (this.device.platform === 'Android') {
			target = cordova.file.externalDataDirectory;
		}
		return fileTransfer.download(this.host + url, target + name);
	}


}
