import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { Question } from '../../models/question';

/*
  Generated class for the FaqDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-faq-detail',
  templateUrl: 'faq-detail.html'
})
export class FaqDetailPage {
  title: string;
  questions:Question[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.title = navParams.get('title');
    this.questions = navParams.get('questions');


  }

  ionViewDidLoad() {
  }

}
