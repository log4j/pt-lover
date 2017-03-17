import { WebHttp } from '../providers/web-http';

export class Question {
    title: string;
    id: string;
    answers: any[];
    visible: boolean = true;

    constructor(title) {
        this.answers = [];
        this.title = title;
    }

    setId(id: string) {
        this.id = id;
    }

    pushAnsers(ansewrLine: any) {
        if (!this.answers) {
            this.answers = [];
        }
        this.answers.push(ansewrLine);
    }

    pushTextLine(text: string) {
        this.answers.push({ text: text });
    }

    pushImgLine(img: string) {
        this.answers.push({ img: img });
    }

    pushLinkLine(link: string) {
        this.answers.push({ link: link });
    }

    pushStrongLine(text: string) {
        this.answers.push({ strong: text });
    }

    pushBrLine() {
        if (this.answers.length && this.answers[this.answers.length - 1].br) {
            return;
        } else {
            this.answers.push({ br: true });
        }
    }

    searchByKeyword(keyword) {
        this.visible = false;
        if (keyword) {
            if (this.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
                this.visible = true;
            if (!this.visible) {
                this.answers.forEach(item => {
                    if (item.text && item.text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
                        this.visible = true;
                        return;
                    }
                });
            }
            return this.visible;
        } else {
            this.visible = true;
            return true;
        }
    }
}


export class QuestionSet {

    titles: string[];
    titleVisible: Map<string, boolean>;
    ids: string[];
    map: Map<string, Question[]>;


    constructor() {
        // let questions:Question[] = this.map['data'];

        this.titles = [];
        this.ids = [];
        this.map = new Map<string, Question[]>();
        this.titleVisible = new Map<string, boolean>();
    }

    searchByKeyword(keyword) {
        if (keyword) {
            this.titles.forEach(item => {
                this.titleVisible.set(item, false);
                if (item.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
                    this.map.get(item).forEach(q => q.searchByKeyword(null));
                    this.titleVisible.set(item, true);
                } else {
                    this.map.get(item).forEach(q => {
                        if (q.searchByKeyword(keyword)) {
                            this.titleVisible.set(item, true);
                        }
                    })
                }
            })
        } else {
            this.titles.forEach(item => {
                this.titleVisible.set(item, true);
                this.map.get(item).forEach(q => q.searchByKeyword(null));
            });
        }
    }

    updateQuestions(data: any, webHttp: WebHttp) {
        // console.log(data);
        let contents = webHttp.findElement(data, item => {
            return item.tagName === 'td' && item.class === 'embedded';
        });
        // console.log(contents);

        let title = '';
        contents.children.forEach(item => {
            if (item.tagName === 'h2') {
                title = item.text;
                // console.log(title);
                title = title.replace('-', '');
                this.titles.push(title);
            } else if (item.tagName === 'table') {
                let questions = this.generateQuestions(item, webHttp);
                this.map.set(title, questions);
            }
        });

        let newTitles: string[] = [];
        this.titles.forEach(item => {
            if (this.map.has(item) && this.map.get(item).length > 0) {
                newTitles.push(item);
            }
        });
        this.titles = newTitles;

        // console.log(this.map);
    }

    generateQuestions(data: any, webHttp: WebHttp): Question[] {
        // console.log(data);

        let list = data.children["0"].children["0"].children;
        let titles: string[] = [];
        let titleQuestionMap: Map<string, Question> = new Map<string, Question>();
        let title;
        let lastTitle;
        let hasTitleToken = false;
        let inAnswerCollecting = false;
        // let question;
        // let answers;
        list.forEach(item => {
            //set title as null before each element
            if (lastTitle && (lastTitle !== title)) {
                //title changed, must followed directly by a href with id. other wise, change it back and add current title into answers
                if (item.tagName == 'a' && item.id) {
                    //do remove lastTitle
                    lastTitle = title;
                } else {
                    let question = titleQuestionMap.get(lastTitle);
                    question.pushStrongLine(title);
                    title = lastTitle;
                    hasTitleToken = false;
                }
            }

            if (item.tagName == 'b') {
                lastTitle = title;
                title = item.text;
                //generate title token
                hasTitleToken = true;
            }
            else if (item.tagName == 'a' && item.id) {
                //consume title token if there is one
                if (hasTitleToken) {
                    hasTitleToken = false;
                    titles.push(title);
                    titleQuestionMap.set(title, new Question(title));
                    let question = titleQuestionMap.get(title);
                    if (question) {
                        question.setId(item.id);
                    }
                }

            }

            else if (item.tagName == 'br') {
                let question = titleQuestionMap.get(title);
                if (question) {
                    question.pushBrLine();
                }
            }
            else if (item.tagName === 'text') {
                let question = titleQuestionMap.get(title);
                if (question) {
                    question.pushTextLine(item.value.replace(/\r|\n/g, ''));
                }
            }
            else if (item.tagName === 'img') {
                let question = titleQuestionMap.get(title);
                if (question) {
                    question.pushImgLine(item.src);
                }
            }
            else if (item.tagName === 'a') {
                let question = titleQuestionMap.get(title);
                if (question) {
                    question.pushLinkLine(item.href);
                }
            }
        });

        let results: Question[] = [];
        titles.forEach(item => results.push(titleQuestionMap.get(item)));

        return results;
    }
}