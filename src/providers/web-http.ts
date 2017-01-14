import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as Parser from "htmlparser2";

/*
  Generated class for the WebHttp provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WebHttp {

	constructor(public http: Http) {
		console.log('Hello WebHttp Provider');
	}

	parseHtml(response: any, callback: Function): any {

		let html = response.text().replace(/>(\s|\r|\n)+</g, '><');
		let root: any = {};
		let current: any = root;
		let parent = root;
		let inParent = false;

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
					
				if(!current.children)
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

	fintElement(node:any, isThatOne: Function):any {
		if(node){
			let list:any[] = [];
			list.push(node);

			while(list.length){
				let item = list.pop();
				if(isThatOne(item)){
					return item;
				}
				//push every child into list
				if(item.children){
					item.children.forEach(child=>list.push(child));
				}
					
			}
			return null;
		}
		return null;
	}

	get(url): Promise<any> {
		return new Promise<any>(resolve => {
			this.http.get(url, {withCredentials: true})
				.subscribe(
					response => this.parseHtml(response, resolve),
					error => resolve(null)
				);
		});

	}

}
