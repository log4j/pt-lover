export class Notice{
    date: string;
    title: string;
    content: string;

    constructor(part1?:any,part2?:any){
        if(part1 && part2){
            console.log(part1, part2);

            this.date = part1.text;
            if(this.date)
                this.date = this.date.replace(/(\s|-)+/g,'');
            this.title = part1.children[part1.children.length-1].text;
            this.content = part2.text;
        }
    }

}

export class NoticeList{
    notices:Notice[];

    constructor(data?:any){
        this.notices = [];
        if(data){
            //console.log(data);
            let list = data.children[1].children["0"].children["0"].children["0"].children;
            // console.log(list);
            if(list && list.length){
                for(let i=0;i<list.length-1;i+=2){
                    this.notices.push(new Notice(list[i],list[i+1]));
                    console.log(this.notices[this.notices.length-1]);
                }
            }
        }
    }
}