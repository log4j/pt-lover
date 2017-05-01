


export class Message {


    date: string;
    id: string;
    name: string;
    userId: string;
    content: string;
    replyTo: string;
    replyId: string;
    // replyName: string;
    type: string;
    hasStar: boolean = false;
    userClass: string;

    constructor(data?: any) {
        if (data) {
            // console.log(data);
            this.date = data.date;
            this.userId = data.userid;
            this.id = data.id;
            this.replyId = data.replyto;
            this.content = data.text;
            this.type = data.type;
            this.name = data.username;

            if (/pic\/trans\.gif/g.test(this.name)) {
                this.hasStar = true;
            }

            let classes = this.name.match(/class=\'(\w|-)*\'/g);
            if (classes) {
                classes.forEach(item => {
                    if (/Name/g.test(item)) {
                        this.userClass = item.substring(7, item.length - 1);
                    }
                });
            }

            //use reg match to get username
            let test = /<u>([\w\d\u4e00-\u9fa5])+<\/u>/g
            let results = this.name.match(test);
            if (results && results.length)
                this.name = results[0];


            if (this.name.length > 7) {
                this.name = this.name.substring(3, this.name.length - 4);
            }


            if (this.replyId != 'no') {
                // console.log(this.content);



                // let replyPart = this.content.match(/回复 <span class=(\w|\d|\s|\'|=|_|<|>|\/|\.|\?|\"|\:|-)+span>(\s)*/g);

                let index = this.content.indexOf('</a></span>');
                // var firstPart = str.substr(0, index);
                // var lastPart = str.substr(index);
                if (index >= 0) {
                    // console.log(replyPart, this.content);
                    //get the reply title
                    this.replyTo = this.getNameFromHtml(this.content.substr(0, index));
                    this.content = this.content.substring(index + 11);

                    // console.log(replyPart[0], this);
                    if (this.replyTo) {
                        this.content = '回复 <b>' + this.replyTo + '</b>: ' + this.content;
                    }
                } else {
                    // console.log(replyPart, this.content);
                }
                // 
            }

            this.content = this.content.replace(/pic/g, 'assets');
            // console.log(this);
        }
    }

    getNameFromHtml(html: string): string {
        //use reg match to get username
        let test = /<u>([\w\d\u4e00-\u9fa5])+<\/u>/g;
        let results = html.match(test);
        if (results && results.length) {
            if (results[0].length > 7) {
                return results[0].substring(3, results[0].length - 4);
            }
        }
        return '';
    }


}

export class MessageList {

    messages: Message[];

    constructor(data?: any) {
        this.messages = [];
        // console.log(data);
        if (data) {
            if (data.data && data.data.length) {
                data.data.forEach(item => {
                    this.messages.push(new Message(item));
                });
            }
        }
    }

    append(msgs: Message[]) {
        if (msgs) {
            msgs.forEach(item => this.messages.push(item));
        }
    }

    appendInFront(msgs: Message[]) {
        if (msgs) {
            this.messages = msgs.concat(this.messages);
        }
    }


}