
import { WebHttp } from '../providers/web-http';

export class Torrent {

    id: string;

    name: string;
    subName: string;
    isHot: boolean = false;
    isTop: boolean = false;

    url: string;
    type: string;
    typeLabel: string;
    special: string;
    size: string;

    comments: any[];
    commentsUrl: string;
    commentsNumber: number;

    uploader: string;
    uploaderUrl: string;


    seeders: any[];
    seedersNumber: number;
    seedersUrl: string;

    downloaders: any[];
    downloadersNumber: number;
    downloadersUrl: string;

    downloadeds: any[];
    downloadedsNumber: number;
    downloadedsUrl: string;

    date: string;

    basicInfos: { key: string, value: string }[] = [];
    descriptions: any[] = [];

    detail: string;

    constructor(data: any) {
        if (data) {

            // console.log(data);

            //special
            if (data.class) {
                this.special = data.class.substring(0, data.class.length - 3);
            }

            //name
            let infor = data.children[1].children["0"].children["0"].children["0"];
            for (let i = 0; i < infor.children.length; i++) {
                let child = infor.children[i];
                if (child.alt == 'Sticky') {
                    this.isTop = true;
                }
                else if (child.tagName == 'b' && child.children[0].class == 'hot') {
                    this.isHot = true;
                }
                else if (child.tagName == 'a' && child.title && child.href) {
                    this.name = child.title;
                }
                else if (child.tagName == 'text') {
                    this.subName = child.value;
                }
            }

            //url
            this.url = data.children[1].children["0"].children["0"].children[2].children["0"].href;
            this.id = this.url.substring(16);

            //type
            this.type = data.children["0"].children["0"].children["0"].href.substring(5);
            this.typeLabel = data.children["0"].children["0"].children["0"].title;

            //comments
            if (data.children[2].children["0"].text == "0") {
                //no comment
                this.commentsNumber = 0;
            } else {
                this.commentsNumber = parseInt(data.children[2].children["0"].children["0"].text);
                this.commentsUrl = data.children[2].children["0"].children["0"].href;
            }



            //date
            this.date = data.children[3].children["0"].text;

            //size
            this.size = data.children[4].text;

            //seeders
            if (data.children[5].children["0"].text == '0') {
                //no seeders
                this.seedersNumber = 0;
            } else {
                this.seedersUrl = data.children[5].children["0"].children["0"].href;
                this.seedersNumber = parseInt(data.children[5].children[0].children[0].children[0].text);
            }


            //downloader
            if (data.children[6].text == '0') {
                //no downloaders
                this.downloadersNumber = 0;
            } else {
                this.downloadersUrl = data.children[6].children["0"].children["0"].href;
                this.downloadersNumber = parseInt(data.children[6].children["0"].children["0"].text);
            }


            //downloadeds
            if (data.children[7].text == '0') {
                //no downloaders
                this.downloadedsNumber = 0;
            } else {
                this.downloadedsUrl = data.children[7].children["0"].href;
                this.downloadedsNumber = parseInt(data.children[7].children["0"].children["0"].text);
            }

            //uploader
            if (data.children[8].children["0"].tagName == 'i') {
                //no name
                this.uploader = data.children[8].children["0"].text;
            } else {
                this.uploader = data.children[8].children["0"].children["0"].children["0"].text;
                this.uploaderUrl = data.children[8].children["0"].children["0"].href;
            }



        }
    }

    loadDetail(data: any, webHttp: WebHttp) {
        if (data) {

            // console.log(data);

            this.basicInfos = [];

            let basicInfos = webHttp.fintElement(data, item => {
                return (item.children && item.children.length && item.children[0].tagName == 'td' && item.children[0].text == '基本信息');
            })

            if (basicInfos && basicInfos.children && basicInfos.children.length == 2) {
                let nextTitle: boolean = true;
                // console.log(basicInfos.children[1].children);
                //start to loop on basicInfos[1].children
                basicInfos.children[1].children.forEach(item => {
                    // console.log(item);
                    if (nextTitle) {
                        if (item.tagName == 'b') {
                            let value = '';
                            if (item.children && item.children.length > 0) {
                                item.children.forEach(child => {
                                    if (child.tagName == 'text' && child.value && child.value.trim()) {
                                        // console.log('title', child.value);
                                        value += child.value;
                                    } else {
                                        if (child.text && child.text.trim()) {
                                            value += child.text.trim();
                                        }
                                    }

                                });

                            } else {
                                value = item.text;
                            }
                            this.basicInfos.push({ key: value, value: null });
                            nextTitle = false;
                        }
                    }
                    else {
                        if (item.tagName == 'text' && item.value && item.value.trim()) {
                            // console.log('value', item.value);
                            this.basicInfos[this.basicInfos.length-1].value = item.value.trim();
                            nextTitle = true;
                        }
                    }
                });

                // console.log(this);
            }


            this.descriptions = [];
            let desciption = webHttp.fintElement(data, item=>{
                return item.tagName==='div' && item.id==='kdescr';
            });
            if(desciption){
                // console.log(desciption);
                desciption.children.forEach(item=>{
                    if(item.tagName === 'text'){
                        this.descriptions.push({text:item.value});
                    }else if(item.tagName === 'br'){
                        //do nothing   
                    }
                    else if(item.tagName === 'img'){
                        this.descriptions.push({img:item.src});
                    }

                    else if(item.tagName === 'a'){
                        this.descriptions.push({link:item.href});
                    }

                    else if(item.tagName === 'fieldset'){

                    }
                    
                    else{
                        console.log(item);
                    }
                });              
            }

            // console.log(this.descriptions);

            // console.log(basicInfos);
        }

    }
}

export class TorrentList {
    list: Torrent[];

    constructor(listData?: any) {
        this.list = [];
        if (listData && listData.length > 1) {
            //the first line is title, ignore
            for (let i = 1; i < listData.length; i++) {
                let torrent = new Torrent(listData[i]);
                // console.log(torrent);
                this.list.push(torrent);
            }
        }
    }

    sortByRules(hot: boolean, top: boolean) {
        this.list.sort((item1, item2) => {

            if (hot && !(item1.isHot && item2.isHot) && (item1.isHot || item2.isHot)) {
                if (item1.isHot) {
                    return -1;
                } else {
                    return 1;
                }
            }

            if (top && !(item1.isTop && item2.isTop) && (item1.isTop || item2.isTop)) {
                if (item1.isTop) {
                    return -1;
                } else {
                    return 1;
                }
            }

            if (item1.id > item2.id) {
                return -1;
            } else if (item1.id < item2.id) {
                return 1;
            } else {
                return 0;
            }


        })
    }
}