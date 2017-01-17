export class User {
    name: string;
    id: string;
    url: string;

    uploaded: string;
    downloaded: string;
    shareRate: number;

    uploading: number;
    downloading: number;

    level: string;
    accessable: boolean;

    bonus: number;

    constructor(data?:any){
        if(data && data.tagName=='table'){

            this.name = data.children["0"].children["0"].children["0"].children["0"].children["0"].children["0"].text;

            this.url = data.children["0"].children["0"].children["0"].children["0"].children["0"].href;
            this.id = this.url.substring(19);


            this.level = data.children["0"].children["0"].children["0"].children[2].children["0"].children["0"].text;
            if(this.level)
                this.level = this.level.match(/(\d|\.|\s|\w)+/g)[0];

            let shareRate:string = data.children["0"].children["0"].children["0"].children[2].children[1].children["0"].text;
            if(shareRate)
                shareRate = shareRate.match(/(\d|\.|\s|\w)+/g)[0];
            this.shareRate = parseFloat(shareRate);

            this.uploaded = data.children["0"].children["0"].children["0"].children[2].children[2].children["0"].text;
            if(this.uploaded)
                this.uploaded = this.uploaded.match(/(\d|\.|\s|\w)+/g)[0];

            this.downloaded = data.children["0"].children["0"].children["0"].children[2].children[3].children["0"].text;
            if(this.downloaded)
                this.downloaded = this.downloaded.match(/(\d|\.|\s|\w)+/g)[0];

        }
    }

}