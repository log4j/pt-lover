

export class RemoteServer{
    name:string;
    id: string;
    folders: {label:string,value:string}[];

    torrents:any[];

    constructor(data){
        this.name = data.name;
        this.id = data.id;
        this.torrents = [];
        if(data.folders){
            this.folders = data.folders;
        }else{
            this.folders = [];
        }
    }

    loadTorrents(data){
        this.torrents = [];
        console.log(data);
        if(data){
            data.forEach(item=>{
                this.torrents.push(item)
            })
        }
    }

}

export class Remote{
    servers: RemoteServer[];

    constructor(data:any[]){
        this.servers = [];
        data.forEach(item=>{
            this.servers.push(new RemoteServer(item));
        })
    }

}