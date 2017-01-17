


export class Message{


    date: string;
    id: string;
    name: string;
    userId: string;
    content: string;
    replyTo: string;
    replyId: string;
    type: string;

    constructor(data?:any){
        if(data){
            // console.log(data);
            this.date = data.date;
            this.userId = data.userid;
            this.id = data.id;
            this.replyTo = data.replyto;
            this.content = data.text;
            this.type = data.type;
            this.name = data.username;

            //use reg match to get username
            let test = /<u>([\w\d\u4e00-\u9fa5])+<\/u>/g
            let results = this.name.match(test);
            if(results && results.length)
                this.name = results[0];
            
            
            if(this.name.length>7){
                this.name = this.name.substring(3,this.name.length-4);
            }


            if(this.replyTo!='no'){
                console.log(this.content);

                let replyPart = this.content.match(/回复 <span class=(\w|\d|\s|\'|=|_|<|>|\/|\.|\?)+span>(\s)*/g);
                if(replyPart && replyPart.length){
                    //get the reply title
                    this.content = this.content.substring(replyPart[0].length);
                }
                console.log(replyPart);
            }

            this.content = this.content.replace(/pic/g,'assets');
            // console.log(this);
        }
    }


}

export class MessageList{

    messages: Message[];

    constructor(data?:any){
        this.messages = [];
        // console.log(data);
        if(data){
            if(data.data && data.data.length){
                data.data.forEach(item=>{
                    this.messages.push(new Message(item));
                });
            }
        }
    }


}