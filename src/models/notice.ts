export class Notice {
    date: string;
    title: string;
    content: string;
    paragraphs: any[];

    constructor(part1?: any, part2?: any) {
        if (part1 && part2) {

            this.date = part1.text;
            if (this.date)
                this.date = this.date.replace(/(\s|-)+/g, '');
            this.title = part1.children[part1.children.length - 1].text;
            this.content = part2.text;

            this.paragraphs = [];
            part2.children.forEach(item => {
                if (item.tagName === 'text') {
                    this.paragraphs.push({ text: item.value });
                }
                else if (item.tagName === 'a') {
                    this.paragraphs.push({ link: item.href });
                }
                else if (item.tagName === 'img') {
                    if (item.src.indexOf('gif')) {

                        item.src = item.src.replace('pic/', 'assets/')
                    }
                    this.paragraphs.push({ img: item.src });
                } else if (item.tagName === 'br') {
                    //if last one is also br, do nothing
                    if (this.paragraphs.length == 0 || this.paragraphs[this.paragraphs.length - 1].br != true)
                        this.paragraphs.push({ br: true });
                } else {
                    // console.log(item);
                }
            })

            // console.log(this);

        }
    }

}

export class NoticeList {
    notices: Notice[];

    constructor(data?: any) {
        this.notices = [];
        if (data && data.children[1].children["0"].children) {
            //console.log(data);
            let list = data.children[1].children["0"].children["0"].children["0"].children;
            // console.log(list);
            if (list && list.length) {
                for (let i = 0; i < list.length - 1; i += 2) {
                    this.notices.push(new Notice(list[i], list[i + 1]));
                }
            }
        }
    }
}