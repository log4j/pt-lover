import { WebHttp } from '../providers/web-http';


export class ForumMessage {
    id: string;
    level: string;
    userId: string;
    userName: string;
    userClass: string;
    userAvatar: string;
    contents: { content: string, quote: number, type: string, last?:boolean }[];
    date: string;

    constructor(data?: any) {
        if (data) {
            // console.log(data);
            if (data.children) {
                data.children.forEach(item => {
                    if (item.tagName === 'a' && item.name) {
                        this.id = item.name;
                    }
                    else if (item.tagName === 'p' && item.children && item.children.length == 2 && item.children[0].tagName === 'text') {
                        this.level = item.children[0].value;
                    }
                    else if (item.tagName === 'p' && item.children && item.children.length == 3 && item.children[0].tagName === 'text') {
                        this.date = item.children[2].value;
                        this.userClass = item.children[1].children["0"].class;
                        this.userName = item.children[1].children["0"].children["0"].text;
                        this.userId = item.children[1].children["0"].href;
                    }
                    else if (item.tagName === 'div') {
                        console.log(item);

                        this.contents = this.loadCommentContents(item.children, 0);
                    }

                    // console.log(this);
                })
            }
        }
    }


    loadCommentContents(children: [any], quote: number):{ content: string, quote: number,type:string, last?:boolean }[] {

        let comments:{ content: string, quote: number,type:string, last?:boolean }[] = new Array<{ content: string, quote: number,type:string, last?:boolean }>();
        // console.log(children);
        children.forEach(item=>{
            if(item.tagName==='text'){
                comments.push({content: item.value.replace(/\r|\n/g,''), quote: quote,type:'text'});
            }
            else if(item.tagName==='fieldset'){
                let insideComments = this.loadCommentContents(item.children, quote+1);
                insideComments.forEach(comment=>comments.push(comment));
            }
            else if(item.tagName == 'legend'){
                comments.push({content: item.text, quote:quote, type:'legend'});
            }
            else if(item.tagName === 'img' && item.class==='smilies'){
                comments.push({content: item.src.replace('pic/','assets/'), quote:quote, type:'smilies'});
            }
            else{
                // console.log(item);
            }
        });

        if(quote>0&&comments.length){
            comments[comments.length-1].last = true;
        }

        return comments;
    }
}

export class ForumTopic {
    topic: string;
    isTop: boolean = false;
    isClassic: boolean = false;
    isRead: boolean = true;
    isLocked: boolean = false;

    count: number = 0;

    url: string;

    user: string;

    messages: ForumMessage[];
    page: number = 0;
    maxPage: number = 0;

    constructor(data?: any) {
        if (data) {
            // console.log(data);
            if (data.children && data.children[0] && data.children["0"].children && data.children["0"].children.length) {
                data.children["0"].children.forEach(item => {
                    // console.log(item);
                    if (item.tagName === 'img') {
                        switch (item.alt) {
                            case ('unread'):
                                this.isRead = false;
                                break;
                            case ('Sticky'):
                                this.isTop = true;
                                break;
                            case ('read'):
                                this.isRead = true;
                                break;
                            case ('lockednew'):
                                this.isLocked = true;
                                this.isRead = false;
                                break;
                            case ('locked'):
                                this.isLocked = true;
                                break;
                            case ('Classic'):
                                this.isClassic = true;
                                break;
                        }
                    }
                    else if (item.tagName === 'p' && item.class === 'ui-li-aside') {
                        this.user = item.children["0"].children["0"].text;
                    }

                    else if (item.tagName === 'text') {
                        this.topic = item.value;
                    }

                    else if (item.tagName === 'b') {
                        this.topic = item.children["0"].text;
                    }
                    else if (item.tagName === 'span' && item.class === 'ui-li-count') {
                        this.count = parseInt(item.text);
                        if (this.count > 0)
                            this.maxPage = Math.floor((this.count - 1) / 10);
                    }
                });


                this.url = data.children[0].href;
            }



            // if(data.children["0"].children[1].tagName === 'text'){
            //     this.topic = data.children["0"].children[1].value;
            // }
            // else if(data.children["0"].children[1].tagName==='img'){
            //     this.topic = data.children["0"].children[3].children["0"].text;
            //     this.isTop = true;
            // }
        }


        // console.log(this);
    }

    loadMessages(data, webHttp: WebHttp) {
        console.log(data);
        let list = webHttp.fintElement(data, item => {
            return item.tagName === 'ul' && item['data-role'] === 'listview';
        });
        console.log(list);

        if (list && list.children && list.children.length) {
            this.messages = [];
            list.children.forEach(item => {
                this.messages.push(new ForumMessage(item.children["0"]));
            });
        }
    }
}


export class Forum {

    title: string;
    read: boolean;
    url: string;
    page: number = -1;

    topics: ForumTopic[];

    constructor(data?: any) {
        if (data) {
            this.title = data.children["0"].children[1].value;
            this.read = data.children["0"].children["0"].alt === 'read';
            this.url = data.children["0"].href;
        }

        this.topics = [];
    }

    loadTopicList(data, webHttp: WebHttp) {
        // console.log(data);
        let list = webHttp.fintElement(data, item => {
            return item.tagName === 'ul' && item['data-role'] === 'listview';
        });

        if (list && list.children && list.children.length) {
            list.children.forEach(item => {
                this.topics.push(new ForumTopic(item));
            })
        }
    }

}

export class ForumSection {
    sections: Array<{ title: string, forums: Forum[] }>;

    constructor(data?: any) {


        this.sections = new Array<{ title: string, forums: Forum[] }>();;



    }

    loadData(data: any, webHttp: WebHttp) {
        if (data) {
            let list = webHttp.fintElement(data, item => {
                return item.tagName === 'div' && item['data-role'] === 'collapsible-set';
            });

            if (list && list.children && list.children.length) {
                list.children.forEach(item => {

                    let title = item.children["0"].text;
                    let forums = [];
                    let forumsData = item.children[1].children;
                    if (forumsData && forumsData.length) {
                        forumsData.forEach(child => {
                            forums.push(new Forum(child));
                        })
                    }

                    this.sections.push({
                        title: title,
                        forums: forums
                    })

                })
            }
        }

    }
}