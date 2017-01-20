export class Question{
    title: string;
    answers: string[];


    constructor(data?:any){
        this.answers = [];
        if(data){

        }
    }
}


export class QuestionSet{

    titles: string[];

    map:Map<string,Question[]>;


    constructor(data?:any){
        let questions:Question[] = this.map['data'];
    }
}