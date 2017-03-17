import { WebHttp } from '../providers/web-http';


export class ForumMessage {
    id: string;
    level: string;
    userId: string;
    userName: string;
    userClass: string;
    userAvatar: string;
    contents: { content: string, quote: number, type: string, last?: boolean }[];
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

                        this.contents = this.loadCommentContents(item.children, 0);
                    }

                    // console.log(this);
                })
            }
        }
    }


    loadCommentContents(children: [any], quote: number): { content: string, quote: number, type: string, last?: boolean }[] {

        let comments: { content: string, quote: number, type: string, last?: boolean }[] = new Array<{ content: string, quote: number, type: string, last?: boolean }>();
        // console.log(children);
        children.forEach(item => {
            if (item.tagName === 'text' && item.value.trim()) {
                comments.push({ content: item.value.replace(/\r|\n/g, ''), quote: quote, type: 'text' });

                // if(item.value.indexOf('nbsp')>=0){
                // }
            }
            else if (item.tagName === 'fieldset') {
                let insideComments = this.loadCommentContents(item.children, quote + 1);
                insideComments.forEach(comment => comments.push(comment));
            }
            else if (item.tagName == 'legend') {
                comments.push({ content: item.text, quote: quote, type: 'legend' });
            }
            else if (item.tagName === 'img' && item.class === 'smilies') {
                comments.push({ content: item.src.replace('pic/', 'assets/'), quote: quote, type: 'smilies' });
            }
            else if (item.tagName === 'img' && item.alt === 'image') {
                comments.push({ content: item.src, quote: quote, type: 'image' });
            }
            else if (item.tagName === 'a') {
                comments.push({ content: item.text, quote: quote, type: 'link' });
            }
            // else if(item.tagName==='span'){

            // }
            else if (item.tagName === 'br') {
                comments.push({ content: '', quote: quote, type: 'br' });
            }
            else if (item.tagName === 'font' || item.tagName === 'span' || item.tagName === 'b' || item.tagName === 'u') {
                let insideComments = this.loadCommentContents(item.children, quote);
                insideComments.forEach(comment => comments.push(comment));
            }
            else {
            }
        });

        if (quote > 0 && comments.length) {
            comments[comments.length - 1].last = true;
        }
        return comments;
    }

    getQuoteString(): string {
        let result = '';
        this.contents.forEach(item => {
            if (item.quote == 0 && item.type === 'text') {
                result += item.content + '\n';
            }
        })
        return result;
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
    id: string;

    user: string;

    messages: ForumMessage[];
    page: number = 0;
    maxPage: number = 0;

    hasNext: boolean = false;
    hasPrevious: boolean = false;
    isLast: boolean = false;
    isFirst: boolean = false;

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
                this.id = this.url.substring(this.url.indexOf('topicid=') + 8);
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
        let list = webHttp.findElement(data, item => {
            return item.tagName === 'ul' && item['data-role'] === 'listview';
        });
        //update id
        let modalLink = webHttp.findElement(data, item => {
            return item.tagName === 'a' && item['data-rel'] === 'dialog' && item.href.indexOf('?action=reply&topicid=') >= 0;
        });
        if (modalLink) {
            this.id = modalLink.href.substring(modalLink.href.indexOf('topicid=') + 8);
        }

        if (list && list.children && list.children.length) {
            this.messages = [];
            list.children.forEach(item => {
                this.messages.push(new ForumMessage(item.children["0"]));
            });
        }
    }

    loadLastPageMessage(data, webHttp: WebHttp): boolean {
        let list = webHttp.findElement(data, item => {
            return item.tagName === 'ul' && item['data-role'] === 'listview';
        });


        if (list && list.children && list.children.length) {
            this.messages = [];
            list.children.forEach(item => {
                this.messages.push(new ForumMessage(item.children["0"]));
            });

            //update maxPage
            let lastMessage = this.messages[this.messages.length - 1];
            this.count = parseInt(lastMessage.level.substring(0, lastMessage.level.length - 1));
            if (this.count > 0) {
                this.maxPage = Math.floor((this.count - 1) / 10);
                this.setPage(this.maxPage);
            }


            return true;
        } else {
            return false;
        }

    }

    setPage(page: number) {
        if (page >= 0 && page <= this.maxPage) {
            this.page = page;
            this.isFirst = (page === 0);
            this.isLast = (page === this.maxPage);
            this.hasNext = (page < this.maxPage);
            this.hasPrevious = (page > 0);
        }
    }
}


export class Forum {

    title: string;
    read: boolean;
    url: string;
    page: number = -1;
    id: string;
    count: number = 0;

    topics: ForumTopic[];

    constructor(data?: any) {
        if (data) {
            this.title = data.children["0"].children[1].value;
            this.read = data.children["0"].children["0"].alt === 'read';
            this.url = data.children["0"].href;
            this.id = this.url.substring(this.url.indexOf('forumid=') + 8);
            data.children["0"].children.forEach(item => {
                if (item.tagName === 'span' && item.class === 'ui-li-count') {
                    this.count = parseInt(item.text);
                }
            })
        }



        this.topics = [];
    }


    loadTopicList(data, webHttp: WebHttp, forceClean?: boolean) {
        // console.log(data);
        let list = webHttp.findElement(data, item => {
            return item.tagName === 'ul' && item['data-role'] === 'listview';
        });
        if (forceClean) {
            this.topics = [];
        }

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
            let list = webHttp.findElement(data, item => {
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