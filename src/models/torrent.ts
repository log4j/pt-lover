export class Torrent{

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

    constructor(data:any){
        console.log(data);
        if(data){
            //special
            if(data.class){
                this.special = data.class.substring(0,data.class.length-3);
            }

            //name
            let infor = data.children[1].children["0"].children["0"].children["0"];
            for(let i=0;i<infor.children.length;i++){
                let child = infor.children[i];
                if(child.alt=='Sticky'){
                    this.isTop = true;
                }
                else if(child.tagName=='b' && child.children[0].class=='hot'){
                    this.isHot = true;
                }
                else if(child.tagName=='a' && child.title && child.href){
                    this.name = child.title;
                }
            }

            //url
            this.url = data.children[1].children["0"].children["0"].children[2].children["0"].href;
            this.id = this.url.substring(16);

            //type
            this.type = data.children["0"].children["0"].children["0"].href.substring(5);
            this.typeLabel = data.children["0"].children["0"].children["0"].title;

            //comments
            if(data.children[2].children["0"].text=="0"){
                //no comment
                this.commentsNumber = 0;
            }else{
                this.commentsNumber = parseInt(data.children[2].children["0"].children["0"].text);
                this.commentsUrl = data.children[2].children["0"].children["0"].href;
            }
            
            

            //date
            this.date = data.children[3].children["0"].text;

            //size
            this.size = data.children[4].text;

            //seeders
            if(data.children[5].text=='0'){
                //no seeders
                this.seedersNumber = 0;
            }else{
                this.seedersUrl = data.children[5].children["0"].children["0"].href;
                this.seedersNumber = parseInt(data.children[5].children[0].children[0].children[0].text);
            }

            //downloader
            if(data.children[6].text=='0'){
                //no downloaders
                this.downloadedsNumber = 0;
            }else{
                this.downloadersUrl = data.children[6].children["0"].children["0"].href;
                this.downloadersNumber = parseInt(data.children[6].children["0"].children["0"].text);
            }
            

            //downloadeds
            if(data.children[7].text=='0'){
                //no downloaders
                this.downloadedsNumber = 0;
            }else{
                this.downloadedsUrl = data.children[7].children["0"].href;
                this.downloadedsNumber = parseInt(data.children[7].children["0"].children["0"].text);
            }

            //uploader
            if(data.children[8].children["0"].tagName=='i'){
                //no name
                this.uploader = data.children[8].children["0"].text;
            }else{
                this.uploader = data.children[8].children["0"].children["0"].children["0"].text;
                this.uploaderUrl = data.children[8].children["0"].children["0"].href;
            }
        }
    }
}

export class TorrentList{
    list:Torrent[];

    constructor(listData ?:any){
        this.list = [];
        if(listData && listData.length>1){
            //the first line is title, ignore
            for(let i=1;i<listData.length;i++){
                let torrent = new Torrent(listData[i]);
                console.log(torrent);
                this.list.push(torrent);
            }
        }
    }
}