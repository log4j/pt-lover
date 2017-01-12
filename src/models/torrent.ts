export class Torrent{

    id: string;
    name: string;
    url: string;
    type: string;

    uploader: string;

    seeders: any[];
    downloaders: any[];

    downloadeds: any[];

    constructor(){

    }
}

export class TorrentList{
    list:Torrent[];

    constructor(){
        this.list = [];
    }
}