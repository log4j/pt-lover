export class TorrentFilter{

    types: Array<{type:string, label:string, checked:boolean}> = [];

    constructor(types:any[]){
        if(types){
            types.forEach(type =>{
                this.types.push({
                    type: type.type,
                    label: type.label,
                    checked: true
                })
            });
        }
    }

}