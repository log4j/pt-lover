import { WebHttp } from '../providers/web-http';

export class ForumTopic{
    topic:string;
    isTop: boolean= false;

    constructor(data?:any){
        if(data){
            console.log(data);
            if(data.children["0"].children[1].tagName === 'text'){
                this.topic = data.children["0"].children[1].value;
            }
            else if(data.children["0"].children[1].tagName==='img'){
                this.topic = data.children["0"].children[3].children["0"].text;
                this.isTop = true;
            }
        }
    }
}


export class Forum {

    title:string;
    read:boolean;
    url:string;
    page:number=-1;

    topics: ForumTopic[];

    constructor(data?:any){
        if(data){
            this.title = data.children["0"].children[1].value;
            this.read = data.children["0"].children["0"].alt === 'read';
            this.url = data.children["0"].href;
        }

        this.topics = [];
    }

    loadTopicList(data, webHttp:WebHttp){
        // console.log(data);
        let list = webHttp.fintElement(data,item=>{
            return item.tagName==='ul' && item['data-role']==='listview';
        });

        if(list && list.children && list.children.length){
            list.children.forEach(item=>{
                this.topics.push(new ForumTopic(item));
            })
        }
    }

}

export class ForumSection {
    sections:Array<{title:string,forums:Forum[]}>;

    constructor(data?:any){

        
        this.sections = new Array<{title:string,forums:Forum[]}>();;


        
    }

    loadData(data:any, webHttp:WebHttp){
        if(data){
            let list = webHttp.fintElement(data, item=>{
                return item.tagName === 'div' && item['data-role']==='collapsible-set';
            });

            if(list && list.children && list.children.length){
                list.children.forEach(item=>{

                    let title = item.children["0"].text;
                    let forums = [];
                    let forumsData = item.children[1].children;
                    if(forumsData && forumsData.length){
                        forumsData.forEach(child=>{
                            forums.push(new Forum(child));
                        })
                    }

                    this.sections.push({
                        title: title,
                        forums:forums
                    })

                })
            }
        }

    }
}