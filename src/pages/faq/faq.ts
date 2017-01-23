import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { QuestionSet } from '../../models/question';

import { FaqDetailPage } from '../faq-detail/faq-detail';

/*
  Generated class for the Faq page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html'
})
export class FaqPage {

  questions: QuestionSet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public userData: UserData
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');

    this.userData.loadQuestions().then(data => {
      console.log(data)
      this.questions = data;
      this.doFilter(null);
    });
  }

  viewMoreDetail(title:string){
    this.navCtrl.push(FaqDetailPage, {
      title: title,
      questions:this.questions.map.get(title)
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  searchKeyword(event:any){
    this.doFilter(event.target.value);
  }

  doFilter(value){
    if(value){

    }
    this.questions.searchByKeyword(value);
  }
}
