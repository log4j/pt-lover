import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController, 
  public navParams: NavParams,
  public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
