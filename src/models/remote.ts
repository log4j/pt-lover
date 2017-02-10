

export class RemoteServer{
    name:string;
    id: string;

    torrents:any[];

    constructor(data){
        this.name = data.name;
        this.id = data.id;
        this.torrents = [];
    }

    loadTorrents(data){
        this.torrents = [];
        console.log(data);
        if(data){
            data.forEach(item=>{
                this.torrents.push({
                    id:item.id,
                    name:item.name,
                    totalSize:item.totalSize
                })
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